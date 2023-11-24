/* eslint-disable @typescript-eslint/naming-convention */
import { GameConfig } from "../../../../config/GameConfig";
import { AttrSetSource } from "./aggregator/AttrSetSource";
import { AllAttributeChangeRpc, BaseAttributeData, initData } from "./AttributeData";
import { IAttributeSet, IAttributeSetOwner } from "./IAttributeSet";

class InnerAttributeSet {
	constructor(public setName: string = "") {
		if (!setName) {
			this.setName = this.constructor.name;
		}
	}
}
export abstract class BaseAttributeSet extends InnerAttributeSet implements IAttributeSet {
	protected _owner: IAttributeSetOwner;
	private _fromSign: string;
	public set owner(v: IAttributeSetOwner) {
		this._owner = v;
	}

	public get owner() {
		return this._owner;
	}

	private _currentDataProxy: BaseAttributeData;
	private _baseDataProxy: BaseAttributeData;
	private _currentData: BaseAttributeData;
	private _baseData: BaseAttributeData;

	private _names: string[] = [];

	private _readOnlyCurrentData: BaseAttributeData;

	public get currentData(): Readonly<BaseAttributeData> {
		return this._readOnlyCurrentData;
	}

	constructor(data: BaseAttributeData) {
		super();
		const self = this;
		this._names.push(...Object.keys(data));
		this._baseData = { ...data };
		this._currentData = { ...data };
		this._readOnlyCurrentData = new Proxy(this._currentData, {
			set() {
				return true;
			},
			get(target, p, receiver) {
				return Reflect.get(target, p, receiver);
			},
		});
		this._currentDataProxy = new Proxy(this._currentData, {
			set(target, p, newValue, receiver) {
				const property = p.toString();
				const oldValue = Reflect.get(target, p, receiver);
				// console.log('[ currentData ] pre >', p, oldValue, newValue)
				newValue = self.preAttributeChange(property, newValue);
				if (newValue === null) {
					return true;
				}
				let isT = Reflect.set(target, p, newValue, receiver);
				self.postAttributeChange(property, oldValue, newValue);
				// console.log('[ currentData ] post >', p, isT, oldValue, newValue)
				return isT;
			},
			get(target, p, receiver) {
				return Reflect.get(target, p, receiver);
			},
		});
		this._baseDataProxy = new Proxy(this._baseData, {
			set(target, p, newValue, receiver) {
				const property = p.toString();
				const oldValue = Reflect.get(target, p, receiver);
				// console.log('[ baseData ] pre >', p, oldValue, newValue)
				newValue = self.preAttributeBaseChange(property, newValue);
				if (newValue === null) {
					return true;
				}
				let isT = Reflect.set(target, p, newValue, receiver);
				self.postAttributeBaseChange(property, oldValue, newValue);
				// console.log('[ baseData ] post >', p, isT, oldValue, newValue)
				return isT;
			},
			get(target, p, receiver) {
				return Reflect.get(target, p, receiver);
			},
		});
	}
	clear(): void {
		// this._baseData = null;
		// this._baseDataProxy = null;
		// this._currentData = null;
		// this._currentDataProxy = null;
		this.owner = null;
	}
	abstract preBuffExecute(buff: AttrSetSource, attributeName: string, value: number): boolean;

	public resetData() {}

	public getAllAttrDataList(): AllAttributeChangeRpc[] {
		const result: AllAttributeChangeRpc[] = [];
		const base = this._baseData;
		const current = this._currentData;
		for (const name of this._names) {
			result.push(new AllAttributeChangeRpc(name, current[name], base[name]));
		}
		return result;
	}
	public preAttributeBaseChange(attributeName: string, value: number): number {
		let newValue = Math.max(0, value);
		if (attributeName === "hp") {
			newValue = MathUtil.clamp(value, 0, this._baseData.maxHp);
		}
		if (this.getBaseValue(attributeName) === newValue) {
			return null;
		}
		return newValue;
	}
	public postAttributeBaseChange(attributeName: string, oldValue: number, newValue: number): void {
		if (attributeName === "maxHp" && newValue > oldValue) {
			this._currentData.hp += newValue - oldValue;
		} else if (attributeName === "maxMp" && newValue > oldValue) {
			this._currentData["mp"] += newValue - oldValue;
		}
		attributeName !== "recover" && this._owner.postAttributeBaseChange(attributeName, oldValue, newValue, this._fromSign);
	}
	public preAttributeChange(attributeName: string, value: number): number {
		let newValue = Math.max(0, value);
		if (attributeName === "hp") {
			newValue = MathUtil.clamp(value, 0, this._currentData.maxHp);
		}
		if (this.getNumericValue(attributeName) === newValue) {
			return null;
		}
		return newValue;
	}

	public postAttributeChange(attributeName: string, oldValue: number, newValue: number): void {
		if (attributeName === "maxHp" && newValue > oldValue) {
			this._currentData.hp += newValue - oldValue;
		} else if (attributeName === "maxMp" && newValue > oldValue) {
			this._currentData["mp"] += newValue - oldValue;
		}
		attributeName !== "recover" && this._owner.postAttributeChange(attributeName, oldValue, newValue, this._fromSign);
	}

	public setBaseValue(newValue: number, attributeName: string, fromSign: string): number {
		this._fromSign = fromSign;
		this._baseDataProxy[attributeName] = newValue;
		return this._baseDataProxy[attributeName];
	}

	public getBaseValue(name: string): number {
		return this._currentData[name] || 0;
	}

	public setNumericValue(newValue: number, attributeName: string, fromSign: string): number {
		this._fromSign = fromSign;
		this._currentDataProxy[attributeName] = newValue;
		return this._readOnlyCurrentData[attributeName];
	}

	public getNumericValue(attributeName: string): number {
		return this._currentData[attributeName] || 0;
	}
}

type _ReadonlyAttr1<T extends BaseAttributeSet> = Omit<T, "preAttributeChange">;

type _ReadonlyAttr2<T extends BaseAttributeSet> = Omit<_ReadonlyAttr1<T>, "postAttributeChange">;

type _ReadonlyAttr3<T extends BaseAttributeSet> = Omit<_ReadonlyAttr2<T>, "preAttributeBaseChange">;

type _ReadonlyAttr4<T extends BaseAttributeSet> = Omit<_ReadonlyAttr3<T>, "postAttributeBaseChange">;

export type ReadonlyAttrSet<T extends BaseAttributeSet> = Omit<_ReadonlyAttr4<T>, "owner">;
export class AttributeSet extends BaseAttributeSet {
	public get configId(): number {
		return this._configId;
	}

	constructor(data: BaseAttributeData, private _configId: number) {
		const config = GameConfig.FightAttr.getElement(_configId);
		initData(data, config);
		super(data);
	}

	public preBuffExecute(effect: AttrSetSource, attributeName: string, value: number): boolean {
		// 伤害处理
		const current = this.currentData;
		const source = effect.contextInfo.from;
		if (attributeName === "damage") {
			let resultDamage = 0;
			if (current.hp <= 0) {
				return;
			}
			if (value > 0) {
				// 有无敌标签，本次伤害也取消
				// if (this.owner.entity.hasComponent(TagComponent)) {
				// 	const tagComponent = this.owner.entity.getComponent(TagComponent);
				// 	// tagComponent.hasAnyExact()
				// }

				// const attrComponent = source.getComponent(AttributeComponent);
				let isCritical = false;
				// if (attrComponent) {
				// 	const criticalRatio = current.criticalRatio;
				// 	value *= 1 + current.damageRatio;
				// 	if (Math.random() <= criticalRatio) {
				// 		value *= 1 + current.criticalDamageRatio;
				// 		isCritical = true;
				// 	}
				// }

				// 结算伤害 = 伤害值*(1-伤害减免系数)-防御力
				resultDamage = Math.floor(value); //Math.floor(value * (1 - current.decreaseDamageRatio) - current.defense);
				const tag = this.owner.tag;
				if (resultDamage <= 0) {
					resultDamage = 1;
				}
				if (resultDamage > 0) {
					this.setNumericValue(current.hp - resultDamage, "hp", source);
					if (!this.owner.ownerSign) {
						return false;
					}
				}
				// 清除伤害
				return false;
			}
		}
		// 恢复处理
		// else if (attributeName === "recover") {
		// 	if (value > 0) {
		// 		// 恢复效果  = 回复值*(1+恢复系数)
		// 		const trulyRecover = value * (1 + current.recoverHpRatio);
		// 		const resultRecover = Math.round(trulyRecover > current.maxHp - current.hp ? current.maxHp - current.hp : trulyRecover);
		// 		if (resultRecover <= 0) {
		// 			return false;
		// 		}
		// 		this.setNumericValue(current.hp + resultRecover, "hp", source.sign);
		// 		return false;
		// 	}
		// }
		return true;
	}
}
