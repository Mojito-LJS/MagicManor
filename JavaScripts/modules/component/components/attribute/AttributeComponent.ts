/**
 * @Author       : peiwen.chen
 * @Date         : 2023-03-27 14:42:20
 * @LastEditors  : peiwen.chen
 * @LastEditTime : 2023-03-27 15:56:10
 * @FilePath     : \mollywoodschool\JavaScripts\modules\fighting\core\attribute\AttributeComponent.ts
 * @Description  : 修改描述
 */
import { myPlayerID } from "../../../../ExtensionType";
import Component from "../../base/Component";
import ComponentSystem, { component } from "../../base/ComponentSystem";
import { TagComponent } from "../tag/TagComponent";
import { AttributeChangeRpc } from "./AttributeData";
import { AttributeSet, ReadonlyAttrSet } from "./AttributeSet";
import { IAttributeSetOwner } from "./IAttributeSet";
import { Aggregator } from "./aggregator/Aggregator";
import { IModifiers } from "./aggregator/Modifier";
import AttrScript, { AttrScriptMgr } from "./server/AttrScript";
export enum AttributeEvent {
	/**
	 * 属性变更
	 */
	attributeChange = "attributeChange",

	/**
	 * 属性值变更
	 */
	attributeChangeValue = "attributeChangeValue",

	/**
	 * 血量xiu
	 */
	hpChange = "hpChange",

	/**
	 * 单位死亡
	 */
	unitDeath = "unitDeath",
}
export type AttributeAgent = {
	/**
	 * 属性变更
	 */
	attributeChange: (attributeName: string, oldValue: number, newValue: number, fromSign: string, isSyncData: boolean) => void;

	/**
	 * 属性值变更
	 */
	attributeChangeValue: () => void;

	/**
	 * 血量xiu
	 */
	hpChange: (d: number, loc: mw.Vector, isT: boolean, fromSign: string) => void;

	/**
	 * 单位死亡
	 */
	unitDeath: (entity: string, fromSign: string) => void;
};
export type IAttributeChanged = (newValue: number, oldValue: number) => void;

@component(10)
export class AttributeComponent extends Component<AttributeAgent, AttributeEvent> implements IAttributeSetOwner {
	tag: TagComponent;
	protected isSyncData: boolean = false;
	// 聚合器
	protected _aggregatorMap: Map<string, Aggregator> = new Map();

	protected _defaultAttributeSetName: string = "";
	protected _attributeDelegate: Map<string, mw.Action2<number, number>> = new Map();
	protected _defaultAttributeSet: ReadonlyAttrSet<AttributeSet>;

	public get defaultAttributeSet(): ReadonlyAttrSet<AttributeSet> {
		return this._defaultAttributeSet;
	}
	public set defaultAttributeSet(v: ReadonlyAttrSet<AttributeSet>) {
		v["owner"] = this;
		this._defaultAttributeSet = v;
	}
	private _changeSet: AttributeChangeRpc[] = [];
	private _deathFromSign: string;

	public get isChange(): boolean {
		return this._changeSet.length > 0;
	}

	private _owner: mw.GameObject;

	public get owner(): mw.GameObject {
		return this._owner;
	}

	private _script: AttrScript;

	private _isDeath: boolean = false;
	protected async onAttach(): Promise<void> {
		this.tag = ComponentSystem.getComponent(TagComponent, this.ownerSign);
		this.useUpdate = true;
		this._script = await AttrScriptMgr.getAttrScript();
		if (this._script) {
			this._script.sign = this.ownerSign;
		}
		this._owner = mw.GameObject.findGameObjectById(this.ownerSign);
	}

	protected onDetach(): void {
		this.clear();
		this.useUpdate = false;
		if (this._script) {
			AttrScriptMgr.recover(this._script);
			this._script = null;
		}
	}
	protected onUpdate(dt: number): void {
		if (!this.isChange) {
			if (this._isDeath) {
				this.sendMessage(AttributeEvent.unitDeath, this.ownerSign, this._deathFromSign);
				this._isDeath = false;
			}
			return;
		}
		// AttributeScript.instance.syncChangeEntities(this.entity.sign, this.getChangeAttr());
		if (this._script) {
			const { attributeName, currentValue, changeValue, fromSign } = this._changeSet.shift();
			this._script.change = [attributeName, currentValue, changeValue, fromSign];
		} else {
			this._changeSet.length = 0;
		}
	}
	/**
	 * getChangeAttr
	 */
	public getChangeAttr(array: AttributeChangeRpc[] = []): AttributeChangeRpc[] {
		if (this._isDeath) {
			this.sendMessage(AttributeEvent.unitDeath, this.ownerSign, this._deathFromSign);
		}
		if (this.isChange) {
			array.push(...this._changeSet);
			this._changeSet.length = 0;
			return array;
		}
		return null;
	}

	syncData(attrData: AttributeChangeRpc[]) {
		this.isSyncData = true;
		const selfSign = this.ownerSign;
		const myPlayerSign = myPlayerID.toString();
		const isMe = selfSign === myPlayerSign;
		for (const item of attrData) {
			const { attributeName, isBase, currentValue, changeValue, fromSign } = item;
			const set = this._defaultAttributeSet;
			isBase ? set.setBaseValue(currentValue, attributeName, fromSign) : set.setNumericValue(currentValue, attributeName, fromSign);
			if (!isMe && fromSign !== myPlayerSign) {
				continue;
			}
			if (attributeName === "hp" && !isBase) {
				const loc = this._owner?.worldTransform.position;
				if (!loc) {
					continue;
				}
				this.sendMessage(AttributeEvent.hpChange, changeValue, loc, false, fromSign);
			}
		}
		this.isSyncData = false;
	}
	public preAttributeBaseChange(attributeName: string, value: number) { }
	public postAttributeChange(attributeName: string, oldValue: number, newValue: number, fromSign: string) {
		this.sendMessage(AttributeEvent.attributeChange, attributeName, oldValue, newValue, fromSign, this.isSyncData);
		if (attributeName === "hp") {
			if (this._script && oldValue !== newValue) {
				this._changeSet.push(new AttributeChangeRpc(attributeName, newValue, newValue - oldValue, fromSign));
			}
			const loc = this._owner?.worldTransform.position;
			if (loc) {
				this.sendMessage(AttributeEvent.hpChange, newValue - oldValue, loc, false, fromSign);
			}
		}
		if (attributeName === "hp" && newValue <= 0) {
			this._isDeath = true;
			this._deathFromSign = fromSign;
		}
	}
	public postAttributeBaseChange(attributeName: string, oldValue: number, newValue: number, fromSign: string) { }
	public preAttributeChange(attributeName: string, value: number) { }

	public clear() {
		const values = this._attributeDelegate.values();

		for (const delegate of values) {
			delegate.clear();
		}
		// 聚合器
		for (const aggregator of this._aggregatorMap.values()) {
			aggregator.clear();
		}
		this._aggregatorMap.clear();
		this._attributeDelegate.clear();
		this._defaultAttributeSet.clear();
		// this._defaultAttributeSet = null;
	}

	/**
	 * 通过计算改变值
	 * @param modifier
	 */
	public changeValue(modifier: IModifiers, fromSign: string) {
		const newValue = Aggregator.staticExecute(modifier, this._defaultAttributeSet, fromSign);
		return newValue;
	}
	public setAttributeBaseValue(attributeName: string, newValue: number, fromSign: string) {
		const attributeSet = this._defaultAttributeSet;
		// 直接修改basevalue
		let oldBaseValue = 0;
		oldBaseValue = this.getAttributeBaseValue(attributeName);
		if (newValue === oldBaseValue) {
			return;
		}
		attributeSet.setBaseValue(newValue, attributeName, fromSign);
		const aggregator = this._aggregatorMap.get(`${attributeSet.setName}.${attributeName}`);
		if (aggregator) {
			// 如果这个属性被聚合器监管，那就让聚合器去计算currentvalue
			oldBaseValue = aggregator.getBaseValue();
			aggregator.setBaseValue(newValue);
		} else {
			// 没有聚合器，那么currentvalue就是basevalue
			oldBaseValue = attributeSet.getNumericValue(attributeName);
			this.internalUpdateNumericalAttr(attributeName, newValue, fromSign);
		}
	}
	/**
	 * 直接设置当前值
	 * @param attributeName
	 * @param newValue
	 * @param attributeSet
	 * @returns
	 */
	public setAttributeCurrentValue(attributeName: string, newValue: number, fromSign: string) {
		const attributeSet = this._defaultAttributeSet;
		// 直接修改currentValue
		const oldValue = this.getAttributeValue(attributeName);
		if (oldValue === newValue) {
			return;
		}
		attributeSet.setNumericValue(newValue, attributeName, fromSign);
	}
	/**
	 * 获取某个属性集合的属性baseValue
	 * @param attributeName
	 * @param attributeSet
	 * @returns
	 */
	public getAttributeBaseValue(attributeName: string) {
		return this._defaultAttributeSet.getBaseValue(attributeName);
	}

	/**
	 * 获取某个属性集合的属性currentValue
	 * @param attributeName 属性名
	 * @param attributeSet 属性集合
	 * @returns
	 */
	public getAttributeValue(attributeName: string) {
		return this._defaultAttributeSet.getNumericValue(attributeName);
	}

	/**
	 * 监听属性变更事件
	 * @param attributeName 监听变更的属性名
	 * @param handler 回调事件
	 * @param attributeSet 属性集合，传空使用默认的属性集合
	 *
	 */
	public registerAttrChangeEvent(attributeName: string, thisArg: unknown, callback: IAttributeChanged) {
		const attributeSet = this._defaultAttributeSet;
		const name = `${attributeSet.setName}.Attr${attributeName}Change`;
		this.getOrCreatedDelegate(name).add(callback, thisArg);
	}

	/**
	 * 取消监听属性变更时间
	 * @param attributeName 属性名
	 * @param handler 回调事件
	 * @param attributeSet 属性集合，传空使用默认的属性集合
	 */
	public unRegisterAttrChangeEvent(attributeName: string, thisArg: unknown, callback: IAttributeChanged) {
		const attributeSet = this._defaultAttributeSet;
		const name = `${attributeSet.setName}.Attr${attributeName}Change`;
		this.getOrCreatedDelegate(name).remove(callback, thisArg);
	}

	private setAttribute_Internal(attributeName: string, value: number, fromSign: string) {
		const attributeSet = this._defaultAttributeSet;
		value = attributeSet.setNumericValue(value, attributeName, fromSign);
		return value;
	}

	/**
	 * 仅供buff组件调用
	 * 修改属性值
	 * @param attributeName 修改的属性名
	 * @param attributeSet 修改的属性值
	 * @param newValue 新值
	 * @param isFromRecursiveCall 是否为递归调用
	 */
	private internalUpdateNumericalAttr(attributeName: string, newValue: number, fromSign: string, isFromRecursiveCall: boolean = false) {
		const oldValue = this.getAttributeValue(attributeName);
		this.setAttribute_Internal(attributeName, newValue, fromSign);

		if (!isFromRecursiveCall) {
			const attributeSet = this._defaultAttributeSet;
			/**
			 * 属性变更
			 */
			newValue !== oldValue && this.sendMessage(AttributeEvent.attributeChange, attributeName, newValue, oldValue, fromSign, this.isSyncData);
			const attrDelegate = this.getDelegate(`${attributeSet.setName}.Attr${attributeName}Change`);
			if (attrDelegate) {
				attrDelegate.call(newValue, oldValue);
			}
		}
	}

	/**
	 * 是否拥有属性
	 * @param attributeName
	 * @param attributeSetName
	 */
	public hasAttribute(attributeName: string) {
		const attribute = this._defaultAttributeSet.currentData;
		if (!attribute) {
			return false;
		}
		return attributeName in attribute;
	}

	/**
	 * 获取某个属性的聚合器
	 * @param attributeName
	 * @param attributeSetName
	 * @returns
	 */
	public getAttrAggregator(attributeName: string): Aggregator {
		const set = this._defaultAttributeSet;
		if (!set) {
			return null;
		}
		return this._aggregatorMap.get(`${set.setName}.${attributeName}`);
	}

	/**
	 * 获取某个属性的聚合器，当聚合器还未创建时，创建一个新的聚合器并返回
	 *
	 */
	public findOrCreateAttrAggregator<T extends Aggregator>(attributeName: string, aggregatorCls: mw.TypeName<T>, fromSign: string): T {
		const set = this._defaultAttributeSet;
		const listenName = `${set.setName}.${attributeName}`;
		if (!this.hasAttribute(attributeName)) {
			return null;
		}
		if (!this._aggregatorMap.has(listenName)) {
			const aggregator = new aggregatorCls(listenName, set, this.getAttributeBaseValue(attributeName), fromSign);
			aggregator.onDirty.add(this.onAggregatorDirty, this);
			aggregator.onDirtyRecursive.add(this.onAggregatorDirtyRecurse, this);
			this._aggregatorMap.set(listenName, aggregator);
		}
		return this._aggregatorMap.get(listenName) as T;
	}

	protected onAggregatorDirty(aggregator: Aggregator, isFromRecursiveCall = false) {
		const split = aggregator.listenName.split(".");
		const attributeSetName = split[0];
		const attributeName = split[1];

		const newValue = aggregator.evaluate();
		this.internalUpdateNumericalAttr(attributeName, newValue, aggregator.fromSign, isFromRecursiveCall);
	}

	protected onAggregatorDirtyRecurse(aggregator: Aggregator) {
		this.onAggregatorDirty(aggregator, true);
	}

	protected getOrCreatedDelegate(name: string) {
		if (!this._attributeDelegate.has(name)) {
			this._attributeDelegate.set(name, new mw.Action2<number, number>());
		}
		return this._attributeDelegate.get(name);
	}

	private getDelegate(name: string) {
		return this._attributeDelegate.get(name);
	}
}
