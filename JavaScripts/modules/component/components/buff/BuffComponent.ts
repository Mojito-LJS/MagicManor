import Component from "../../base/Component";
import ComponentSystem, { component } from "../../base/ComponentSystem";
import { AttributeComponent, AttributeEvent } from "../attribute/AttributeComponent";
import { Aggregator } from "../attribute/aggregator/Aggregator";
import { IModifiers } from "../attribute/aggregator/Modifier";
import { TagComponent } from "../tag/TagComponent";
import { TagCountContainer } from "../tag/TagCountContainer";
import { TagEvent } from "../tag/core/TagEvents";
import { ActiveBuff } from "./base/ActiveBuff";
import { BuffAggregator } from "./base/BuffAggregator";
import { BuffDef } from "./base/BuffDef";
import { CreateBuffContext, createBuffInstanceWithName, getBuffDefWithName, recoverBuffInstance } from "./base/BuffRegister";
import { BuffConstant, BuffType, PeriodInhibitionPolicy, StackExpirationPolicy, StackRefreshPolicy } from "./base/BuffType";

const DEFAULT_AFFECT_CLS = "ActiveBuff";

const tempTickEffects: ActiveBuff[] = [];
export enum BuffEvent {
	/**
	 * buff被真正添加
	 * 满足执行条件了
	 * (owner:IEntity,buff:ActiveEffect)
	 */
	buffAdded = "buffAdded",

	/**
	 * buff被免疫
	 * (owner:IEntity,buff:ActiveEffect)
	 */
	buffImmunity = "buffImmunity",

	/**
	 * 添加buff
	 * buff被添加到自己 此时buff不一定被触发
	 * 注意不一定会回调effectSpec，比如instant类型的buff就不会创建实例
	 * (owner:IEntity,from:IEntity,effectDef:GameplayEffect,effectSpec:ActiveEffect|null)
	 */
	buffApplySelf = "buffApplySelf",

	/**
	 * buff成功施加给别人 此时buff不一定被触发
	 * 注意不一定会回调effectSpec，比如instant类型的buff就不会创建实例
	 * 注意不一定会回调effectSpec，比如instant类型的buff就不会创建实例
	 * (owner:IEntity,to:IEntity,effectDef:GameplayEffect,effectSpec:ActiveEffect|null)
	 */
	buffApplyToTarget = "buffApplyToTarget",

	/**
	 * buff持续时间被更改
	 * (effect:ActiveEffect)
	 */
	buffDurationChange = "buffDurationChange",

	/**
	 * buff堆栈层数修改
	 * (effect:ActiveEffect,oldValue:number,newValue:number)=>void
	 */
	buffStackChange = "buffStackChange",

	/**
	 * buff被移除
	 * (effect:ActiveEffect,isPrematureRemoval:boolean)
	 */
	buffRemoved = "buffRemoved",
}
export type BuffAgent = {
	buffApplySelf: (effectDef: BuffDef | string, level: number, createContext?: CreateBuffContext) => void;
	buffApplyToTarget: (effectDef: BuffDef | string, level: number, target: string, createContext?: CreateBuffContext) => void;
	buffDurationChange: (effect: ActiveBuff) => void;
	buffRemoved: (effect: ActiveBuff, isPrematureRemoval: boolean) => void;
	buffStackChange: (effect: ActiveBuff, oldStackCount: number, newStackCount: number) => void;
	/**
	 * buff被真正添加
	 * 满足执行条件了
	 * (owner:IEntity,buff:ActiveEffect)
	 */
	buffAdded: (entity: string, effect: ActiveBuff) => void;

	/**
	 * buff被免疫
	 * (owner:IEntity,buff:ActiveEffect)
	 */
	buffImmunity: (entity: string, def: BuffDef) => void;
};
@component(10)
export default class BuffComponent extends Component<BuffAgent, BuffEvent> {
	private _attrComponent: AttributeComponent;

	private _activeBuffs: Set<ActiveBuff> = new Set();

	private captureTags: TagCountContainer = new TagCountContainer();

	private effectDependencies: Map<string, Set<ActiveBuff>> = new Map();

	private periodBuffs: Map<ActiveBuff, number> = new Map();

	protected override onAttach(): void {
		const tagComponent = ComponentSystem.getComponent(TagComponent, this.ownerSign);
		this._attrComponent = ComponentSystem.getComponent(AttributeComponent, this.ownerSign);

		if (!tagComponent || !this._attrComponent) {
			throw new Error("缺少 TagComponent, AttributeComponent");
		}

		this.captureTags.bindChildContainer(tagComponent["tagContainer"]);

		this.captureTags.addListen(TagEvent.tagAdded, this, this.onOwnerTagChanged);
		this.captureTags.addListen(TagEvent.tagRemoved, this, this.onOwnerTagChanged);
		this._attrComponent.addListen(AttributeEvent.unitDeath, this, this.clearAllBuff);
		// EventMgr.on(GameEvents.GAME_RESUME, this, this.extendDurationAfterPause);
		this.useUpdate = true;
	}

	protected onDetach(): void {
		this.useUpdate = false;
		this.clearAllBuff();
		this._activeBuffs.clear();
		this.captureTags.offAllCaller(this);
		this.captureTags.clear();
		this._attrComponent = null;
		// EventMgr.off(GameEvents.GAME_RESUME, this, this.extendDurationAfterPause);
	}

	/**
	 * 给目标添加buff
	 * @param effectDef
	 * @return buff名
	 */
	public applyBuffToTarget(effectDef: BuffDef | string, level: number, target: string, createContext?: CreateBuffContext): string {
		if (typeof effectDef === "string") {
			effectDef = getBuffDefWithName(effectDef);
		}
		if (ComponentSystem.hasComponent(target, BuffComponent)) {
			return ComponentSystem.getComponent(BuffComponent, target).applyBuffToSelfInternal(effectDef, level, this.ownerSign, createContext);
		}
		return null;
	}

	/**
	 * 给自己添加buff
	 * @param effectDef
	 * @param level
	 */
	public applyBuffToSelf(effectDef: BuffDef | string, level: number, createContext?: CreateBuffContext) {
		if (typeof effectDef === "string") {
			effectDef = getBuffDefWithName(effectDef);
		}
		this.applyBuffToSelfInternal(effectDef, level, this.ownerSign, createContext);
		return effectDef.sign;
	}

	/**
	 * 移除已经激活的buff
	 * @param effectName buff名
	 * @param stackToRemove 如果有堆栈的话，移除的堆栈数量，当为-1时是移除整个堆栈
	 */
	public removeActiveBuff(effectName: string, stackToRemove = -1) {
		const effect = this.findActiveEffectWithName(effectName);
		if (!effect) {
			return false;
		}
		return this.internalRemoveActiveBuff(effect, stackToRemove, true);
	}

	public clearAllBuff() {
		for (const value of this._activeBuffs) {
			this.internalRemoveActiveBuff(value, -1, true);
		}
	}

	/**
	 * 返回当前拥有的buff数量
	 */
	public getEffectCount(): number {
		return this._activeBuffs.size;
	}

	/**
	 * 延长所有buff时间，一般在游戏被暂停恢复后调用
	 * @param pastedTime
	 */
	public extendDurationAfterPause(pastedTime: number) {
		for (const effect of this._activeBuffs) {
			if (effect.duration !== BuffConstant.INFINITE_DURATION) {
				effect.duration += pastedTime;
			}
			this.sendMessage(BuffEvent.buffDurationChange, effect);
		}
	}

	/**
	 * 获取激活buff的开始时间和持续时间
	 * @param effectName buff名
	 * @param result [开始时间,持续时间]
	 */
	public getBuffStartTimeAndDuration(effectName: string, result: [number, number]): [number, number] {
		const activeEffect = this.findActiveEffectWithName(effectName);
		if (activeEffect) {
			result[0] = activeEffect.startTime;
			result[1] = activeEffect.duration;
		}
		return result;
	}

	/**
	 * 设置buff的等级
	 * @param effectName buff名
	 * @param newLevel 新的等级
	 */
	public setActiveBuffLevel(effectName: string, newLevel: number) {
		const activeEffect = this.findActiveEffectWithName(effectName);
		if (activeEffect) {
			activeEffect.level = newLevel;
			this.updateAllAggregatorMod(activeEffect);
		}
	}

	/**
	 * buff的依赖项变更
	 * @param effect 依赖的buff
	 * @param changeAgg 变更的集合器
	 */
	public onMagnitudeDependencyChange(buff: ActiveBuff, changeAgg: Aggregator) {
		if (!this._activeBuffs.has(buff)) {
			return false;
		}
		if (buff) {
			const mustUpdateAttributeAggregators = !buff.isInhibited && buff.period <= BuffConstant.NO_PERIOD;
			const modifiersInfo = buff.def.modifiers;

			const waitUpdateAttribute: Set<string> = new Set();

			for (const modifier of modifiersInfo) {
				// 标记为脏数据?
				if (mustUpdateAttributeAggregators) {
					// waitUpdateAttribute.add(modifier.fullName);
				}
			}

			this.updateAggregatorMod([...waitUpdateAttribute], buff);
		}
		return true;
	}

	public findActiveEffectWithName(name: string): ActiveBuff {
		for (const effect of this._activeBuffs.values()) {
			if (effect.def.sign === name) {
				return effect;
			}
		}

		return null;
	}

	protected override onUpdate(dt: number): void {
		tempTickEffects.length = 0;
		tempTickEffects.push(...this._activeBuffs);

		for (const effect of tempTickEffects) {
			this.checkDurationExpired(effect);
		}

		for (const [effect, duration] of this.periodBuffs) {
			if (duration <= 0) {
				this.executePeriodBuff(effect);
			} else {
				this.periodBuffs.set(effect, duration - dt * 1000);
			}
		}
	}

	private checkDurationExpired(effect: ActiveBuff) {
		if (effect.isPendingRemove) {
			return;
		}

		if (effect.duration <= BuffConstant.INFINITE_DURATION) {
			return;
		}
		const currentTime = Date.now();
		if (currentTime - effect.startTime < effect.duration) {
			return;
		}

		let stackToRemove = -2;
		let refreshStartTime = false;
		let checkForFinalPeriodExe = false;

		switch (effect.def.stackExpirationPolicy) {
			case StackExpirationPolicy.ClearEntireStack: {
				stackToRemove = -1;
				checkForFinalPeriodExe = true;
				break;
			}
			case StackExpirationPolicy.RemoveSingleStack: {
				stackToRemove = 1;
				checkForFinalPeriodExe = effect.stackCount === 1;
				refreshStartTime = true;
				break;
			}
			case StackExpirationPolicy.RefreshDuration: {
				refreshStartTime = true;
				break;
			}
			default: {
				break;
			}
		}

		if (checkForFinalPeriodExe) {
			if (this.periodBuffs.has(effect) && this.periodBuffs.get(effect) <= 40) {
				// 如果在检查持续时间时，发现下一帧就要执行周期函数了，那这里提前执行
				this.executePeriodBuff(effect);

				if (effect.isPendingRemove) {
					return;
				}
			}

			this.periodBuffs.delete(effect);
		}

		if (stackToRemove >= -1) {
			// 持续时间到了，不属于特殊移除
			this.internalRemoveActiveBuff(effect, stackToRemove, false);
		}

		if (refreshStartTime) {
			this.restartActiveEffectDuration(effect);
		}
	}

	private onOwnerTagChanged(tagChange: string[]) {
		for (const changeTag of tagChange) {
			if (this.effectDependencies.has(changeTag)) {
				const dependEffects = [...this.effectDependencies.get(changeTag)];

				for (const effect of dependEffects) {
					if (this.captureTags.hasAll(effect.def.removalTag)) {
						this.internalRemoveActiveBuff(effect, -1, true);
					}

					if (this.captureTags.hasAll(effect.def.ongoingTag)) {
						this.checkOnGoingTagRequirements(effect);
					}
				}
			}
		}
	}

	private internalOnActiveBuffRemoved(effect: ActiveBuff) {
		// 解除依赖

		// 运行时依赖
		if (effect.def.ongoingTag) {
			for (const tag of effect.def.ongoingTag) {
				if (this.effectDependencies.get(tag)) {
					this.effectDependencies.get(tag).delete(effect);
				}
			}
		}

		// 移除时依赖
		if (effect.def.removalTag) {
			for (const tag of effect.def.removalTag) {
				if (this.effectDependencies.get(tag)) {
					this.effectDependencies.get(tag).delete(effect);
				}
			}
		}

		// 如果还在执行，把创建的modifier移除掉
		if (!effect.isInhibited) {
			this.removeActiveEffectGrantedTagsAndModifiers(effect);
		}
	}

	private internalRemoveActiveBuff(effect: ActiveBuff, stackToRemove: number, isPrematureRemoval: boolean) {
		if (stackToRemove > 0 && effect.stackCount > stackToRemove) {
			// 只是移除堆栈
			const startingStackCount = effect.stackCount;
			effect.stackCount -= stackToRemove;
			this.onStackCountChanged(effect, startingStackCount, effect.stackCount);
			return false;
		}
		if (effect.isPendingRemove) {
			return;
		}
		effect.isPendingRemove = true;
		this.internalOnActiveBuffRemoved(effect);

		effect.remove();

		this.periodBuffs.delete(effect);
		this._activeBuffs.delete(effect);

		this.sendMessage(BuffEvent.buffRemoved, effect, isPrematureRemoval);

		// 链式
		const expiryEffects = isPrematureRemoval ? effect.def.prematureExpirationEffects : effect.def.routineExpirationEffects;

		if (expiryEffects) {
			for (const waitAdded of expiryEffects) {
				this.applyBuffToSelfInternal(getBuffDefWithName(waitAdded), effect.level, effect.contextInfo.from, {
					source: effect.contextInfo.source,
					setByCaller: effect.getSetCaller(),
				});
			}
		}

		// 最后回收掉
		this.recoverBuffInstance(effect);
	}

	private applyBuffToSelfInternal(def: BuffDef, level: number, from: string, createContext?: CreateBuffContext) {
		if (!def) {
			return null;
		}
		if (!this.ownerSign) {
			return;
		}

		// 判断免疫tag
		if (def.immunityTags && this.captureTags.hasAll(def.immunityTags)) {
			this.sendMessage(BuffEvent.buffImmunity, this.ownerSign, def);
			return null;
		}

		// 添加条件判断
		if (def.applyRequireTags && !this.captureTags.hasAll(def.applyRequireTags)) {
			return null;
		}

		// 移除条件判断
		if (def.removalTag && def.removalTag.length) {
			if (this.captureTags.hasAll(def.removalTag)) {
				// 添加的时候移除条件已经满足了，就不用添加了
				return null;
			}
		}

		let chanceToApply = def.chanceToApply;

		if (def.chanceToApplyCal) {
			chanceToApply = def.chanceToApplyCal(def, level, from, this.ownerSign);
		}

		if (chanceToApply <= 0 || Math.random() > chanceToApply) {
			return null;
		}

		let activeEffect: ActiveBuff = null;
		if (def.type !== BuffType.Instant) {
			activeEffect = this.applyEffectSpec(def, level, from, createContext);
			if (!activeEffect) {
				return null;
			}
		} else if (def.type === BuffType.Instant) {
			// instant buff
			const tempInstance = this.buildBuffInstance(def, level, from, this.ownerSign, createContext);
			this.executeBuff(tempInstance);
			// 回收
			this.recoverBuffInstance(tempInstance);
		}

		if (def.targetEffects) {
			// 链式调用
			for (const targetEffect of def.targetEffects) {
				this.applyBuffToSelf(targetEffect, level);
			}
		}

		this.sendMessage(BuffEvent.buffApplySelf, def, level, createContext);
		ComponentSystem.getComponent(BuffComponent, from)?.sendMessage(BuffEvent.buffApplyToTarget, def, level, this.ownerSign, createContext);
		return def.sign;
	}

	private applyEffectSpec(def: BuffDef, level: number, from: string, createContext: CreateBuffContext) {
		// 两种可能，一种是已经有了这个buff
		// 走叠加逻辑，否则走新建逻辑

		let isFoundStack: boolean = false;
		let newStackCount = 0,
			startingStackCount = 0;
		let setDuration = true,
			setPeriod = true;
		let applyEffect: ActiveBuff = null;
		const stackEffect = this.findStackAbleEffect(def.sign);

		if (stackEffect) {
			isFoundStack = true;
			// 堆栈
			startingStackCount = stackEffect.stackCount;

			if (stackEffect.stackCount === def.stackLimit) {
				if (!this.handleEffectStackOverflow(stackEffect)) {
					return null;
				}
			}

			newStackCount = stackEffect.stackCount + 1;

			if (stackEffect.def.stackLimit > 0) {
				newStackCount = Math.min(newStackCount, stackEffect.def.stackLimit);
			}
			stackEffect.stackCount = newStackCount;
			applyEffect = stackEffect;

			if (stackEffect.def.stackPeriodRefreshPolicy === StackRefreshPolicy.NeverRefresh) {
				setDuration = false;
			} else {
				this.restartActiveEffectDuration(stackEffect);
			}

			if (stackEffect.def.stackPeriodRefreshPolicy === StackRefreshPolicy.NeverRefresh) {
				setPeriod = false;
			}
		} else {
			// 创建新的实例
			applyEffect = this.buildBuffInstance(def, level, from, this.ownerSign, createContext);
			this._activeBuffs.add(applyEffect);
			applyEffect.startTime = Date.now();
			applyEffect.start();
		}

		const baseDuration = applyEffect.def.duration;

		if (baseDuration > 0) {
			let finalDuration = baseDuration;

			if (applyEffect.def.calculateDuration) {
				finalDuration = applyEffect.def.calculateDuration.call(applyEffect);

				if (finalDuration <= 0) {
					// 如果持续时间小于0秒,设置到100毫秒
					finalDuration = 100;
				}
			}

			if (setDuration) {
				// 设置持续时间
				applyEffect.duration = finalDuration;
			}
		}

		if (setPeriod && applyEffect.period > BuffConstant.NO_PERIOD) {
			this.periodBuffs.set(applyEffect, applyEffect.period);

			if (applyEffect.def.executeOnApply) {
				setTimeout(() => {
					this.executePeriodBuff(applyEffect);
				}, 2);
			}
		}

		if (isFoundStack) {
			this.onStackCountChanged(applyEffect, startingStackCount, newStackCount);
		} else {
			this.internalOnActiveEffectAdded(applyEffect);
		}

		return applyEffect;
	}

	private executePeriodBuff(effect: ActiveBuff) {
		if (effect.isInhibited) {
			return;
		}
		this.executeBuff(effect);

		this.periodBuffs.set(effect, effect.period);
		//触发事件
	}

	private executeEventBuff(effect: ActiveBuff) {
		if (effect.isInhibited) {
			return;
		}
		effect.executeEventTime += 1;

		this.executeBuff(effect);

		if (effect.executeEventTime >= effect.def.eventApplyLimit) {
			// 等待下次回收
			effect.duration = 1;
		}
	}

	private restartActiveEffectDuration(effect: ActiveBuff) {
		effect.startTime = Date.now();
		this.sendMessage(BuffEvent.buffDurationChange, effect);
	}

	private findStackAbleEffect(effectName: string): ActiveBuff {
		// 暂时不做叠加栈在对方身上，只考虑自己
		return this.findActiveEffectWithName(effectName);
	}

	private handleEffectStackOverflow(stackEffect: ActiveBuff): boolean {
		const shouldAllowOverflowApply = !stackEffect.def.denyOverflowApply;

		if (stackEffect.def.overflowEffects) {
			for (const overflowEffect of stackEffect.def.overflowEffects) {
				this.applyBuffToSelf(overflowEffect, stackEffect.level);
			}
		}

		if (!shouldAllowOverflowApply && stackEffect.def.clearStackOnOverflow) {
			this.removeActiveBuff(stackEffect.def.sign);
		}

		return shouldAllowOverflowApply;
	}

	/** 当有buff被添加到component的时候要调用该函数
	 *  注意这里指的是buff '被添加' 此时buff不一定会生效
	 * */
	private internalOnActiveEffectAdded(effect: ActiveBuff) {
		// 把依赖绑定上

		// 运行时依赖
		if (effect.def.ongoingTag) {
			for (const tag of effect.def.ongoingTag) {
				this.findOrAddedDependency(tag).add(effect);
			}
		}

		if (effect.def.removalTag) {
			// 移除时依赖
			for (const tag of effect.def.removalTag) {
				this.findOrAddedDependency(tag).add(effect);
			}
		}

		// 监听事件

		// 默认不启用
		effect.isInhibited = true;
		this.checkOnGoingTagRequirements(effect);
	}

	/** 检查某个buff的启动条件是否满足 */
	private checkOnGoingTagRequirements(effect: ActiveBuff) {
		if (effect.isPendingRemove) {
			return;
		}
		const shouldBeInhibited = !this.captureTags.hasAll(effect.def.ongoingTag);

		if (shouldBeInhibited) {
			this.removeActiveEffectGrantedTagsAndModifiers(effect);
		} else {
			this.addActiveEffectGrantedTagsAndModifiers(effect);
		}
	}

	/** 真正把buff对应的tag和修改器添加上，一般是buff实际生效时 */
	private addActiveEffectGrantedTagsAndModifiers(effect: ActiveBuff) {
		effect.isInhibited = false;
		if (effect.period <= BuffConstant.NO_PERIOD) {
			// 没有周期 才创建属性修改器
			for (const modifierOption of effect.def.modifiers) {
				if (!this._attrComponent || !this._attrComponent.hasAttribute(modifierOption.attributeName)) {
					// 没有该buff监听的属性
					continue;
				}
				const aggregator = this.findOrCreateAttrAggregator(modifierOption.attributeName, effect);
				if (aggregator) {
					aggregator.addAggregatorMod(modifierOption.modifierOp, modifierOption.calculate, effect);
				}
			}
		} else {
			if (effect.def.periodInhibitionPolicy !== PeriodInhibitionPolicy.NeverReset) {
				// 注册进周期buff
				this.periodBuffs.set(effect, effect.period);
			}
		}

		if (effect.def.grantTag) {
			// 授予生效时的tag
			this.captureTags.add(effect.def.grantTag, false);
		}

		this.sendMessage(BuffEvent.buffAdded, this.ownerSign, effect);
	}

	private removeActiveEffectGrantedTagsAndModifiers(effect: ActiveBuff) {
		effect.isInhibited = true;
		const attrComponent = this._attrComponent;
		if (effect.period <= BuffConstant.NO_PERIOD) {
			for (const modifierInfo of effect.def.modifiers) {
				if (attrComponent.hasAttribute(modifierInfo.attributeName)) {
					const aggregator = attrComponent.getAttrAggregator(modifierInfo.attributeName) as BuffAggregator;
					if (aggregator) {
						aggregator.removeAggregatorMod(effect);
					}
				}
			}
		}
		if (effect.def.grantTag) {
			this.captureTags.remove(effect.def.grantTag);
		}
	}

	private findOrAddedDependency(tag: string): Set<ActiveBuff> {
		if (!this.effectDependencies.has(tag)) {
			this.effectDependencies.set(tag, new Set());
		}
		return this.effectDependencies.get(tag);
	}

	/**
	 * 计算buff
	 * @param buff
	 */
	private executeBuff(buff: ActiveBuff) {
		const modifiers = buff.def.modifiers;
		for (const modifier of modifiers) {
			this.internalExecuteMod(modifier, buff);
		}
	}

	private internalExecuteMod(modifier: IModifiers, effect: ActiveBuff) {
		const set = this._attrComponent.defaultAttributeSet;
		const currentBase = this._attrComponent.getAttributeBaseValue(modifier.attributeName);
		const newBaseValue = Aggregator.buffExecute(currentBase, effect, modifier, set);
		this._attrComponent.setAttributeBaseValue(modifier.attributeName, newBaseValue, effect.contextInfo.from);
		if (!set.preBuffExecute(effect, modifier.attributeName, set.getNumericValue(modifier.attributeName))) {
			// 把值清空
			this._attrComponent.setAttributeCurrentValue(modifier.attributeName, currentBase, effect.contextInfo.from);
			return;
		}
	}

	private onStackCountChanged(effect: ActiveBuff, oldStackCount: number, newStackCount: number) {
		if (oldStackCount !== newStackCount) {
			this.updateAllAggregatorMod(effect);
		}

		this.sendMessage(BuffEvent.buffStackChange, effect, oldStackCount, newStackCount);
	}

	/** 刷一遍buff，重新计算属性 */
	private updateAllAggregatorMod(effect: ActiveBuff) {
		// 周期buff的修改不关联收集器
		if (effect.period > BuffConstant.NO_PERIOD) {
			return;
		}

		// buff被暂停
		if (effect.isInhibited) {
			return;
		}

		const modifiersInfo = effect.def.modifiers;

		const waitUpdateAttribute: Set<string> = new Set();

		for (const modifier of modifiersInfo) {
			// waitUpdateAttribute.add(modifier.fullName);
		}

		this.updateAggregatorMod([...waitUpdateAttribute], effect);
	}

	private updateAggregatorMod(attributeFullName: string[], from: ActiveBuff) {
		for (const fullName of attributeFullName) {
			const split = fullName.split(".");
			// const attributeSetName = split[0];
			const attributeName = split[0];
			const aggregator = this.findOrCreateAttrAggregator(attributeName, from);
			aggregator.broadcastOnDirty();
		}
	}

	private buildBuffInstance(buffDef: BuffDef, level: number, from: string, target: string, createContext: CreateBuffContext) {
		const className = buffDef.className ? buffDef.className : DEFAULT_AFFECT_CLS;

		const instance: ActiveBuff = createBuffInstanceWithName(className, buffDef, level, from, target, createContext);

		if (!instance) {
			return null;
		}

		return instance;
	}

	private recoverBuffInstance(effect: ActiveBuff) {
		recoverBuffInstance(effect);
	}

	private findOrCreateAttrAggregator(attributeName: string, from: ActiveBuff) {
		return this._attrComponent.findOrCreateAttrAggregator(attributeName, BuffAggregator, from.contextInfo.from);
	}
}
