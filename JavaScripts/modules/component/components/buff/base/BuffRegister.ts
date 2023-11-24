
import { IFightBuffElement } from "../../../../../config/FightBuff";
import { FightPool } from "../../../base/Pool";
import { ModifierCal, IModifiers, ModifierOp } from "../../attribute/aggregator/Modifier";
import { BaseAttributeSet } from "../../attribute/AttributeSet";

import { ActiveBuff } from "./ActiveBuff";
import { BuffDef } from "./BuffDef";
import { GrantAbilityInfo } from "./BuffType";

interface ScriptBuff {
    periodCall: ModifierCal;

    durationCall: ModifierCal;

    chanceToApplyCall: (effect: BuffDef, level: number, from: string, to: string) => number;

    modifiers: IModifiers[];
}

export interface ScriptBuffObject extends Object {
    /**
     * 周期计算
     * @param this 
     * @param attributeSet 
     */
    calculatePeriod?(this: ActiveBuff, attributeSet: BaseAttributeSet);

    /**
     * 等待时间
     * @param this 
     * @param attributeSet 
     */
    calculateDuration?(this: ActiveBuff, attributeSet: BaseAttributeSet);

    /**
     * 概率计算
     * @param buff 
     * @param level 
     * @param from 
     * @param to 
     */
    calculateChanceApply?(buff: BuffDef, level: number, from: string, to: string): number;
}

const buffMap: Map<string, mw.TypeName<ActiveBuff>> = new Map();

const aliasMap: Map<string, string> = new Map();

const poolBuffPrefix = "poolBuff";

const scriptBuffs: Record<string, ScriptBuff> = {};

const buffDefRecord: Record<string, BuffDef> = {};

/**
 * 注册一个buff的属性修改器
 * @param modifierOp
 * @returns
 */
export function regEffectMod(modifierOp: ModifierOp, attr: string, ...dependents: string[]) {
    return function <T extends ModifierCal>(target: ScriptBuffObject, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) {
        const effectName = (target.constructor as any).effectName;
        if (!scriptBuffs[effectName]) {
            scriptBuffs[effectName] = {
                periodCall: target.calculatePeriod,
                durationCall: target.calculateDuration,
                chanceToApplyCall: target.calculateChanceApply,
                modifiers: [],
            };
        }
        const cache = scriptBuffs[effectName].modifiers;
        const split = attr.split(".");
        const attributeName = split.length > 1 ? split[1] : split[0];
        const attributeSetName = split.length > 1 ? split[0] : undefined;
        cache.push({
            // fullName: attr,
            attributeName: attributeName,
            // attributeSetName: attributeSetName,
            modifierOp: modifierOp,
            depends: dependents,
            calculate: target[propertyKey],
        });
    } as MethodDecorator;
}
/**
 * 注册一个buff
 * @param alias 别名
 * @param effectName 
 * @returns 
 */
export function regBuff(alias: string | number, effectName?: string) {
    return function <T extends ActiveBuff>(constructor: mw.TypeName<T>) {
        effectName = effectName || constructor.name
        alias = alias.toString();
        aliasMap.set(effectName, alias);
        buffMap.set(alias, constructor);
    };
}

export function regBuffDef(defName: string) {
    return function <T extends BuffDef>(constructor: mw.TypeName<T>) {
        buffDefRecord[defName] = new constructor();
    };
}


export interface CreateBuffContext {
    /**
     * buff创建源，技能?还是
     */
    source?: unknown;

    /**
     * 传递的参数
     */
    setByCaller?: { [key: string]: string | number };
}
interface ConfigModifierInfo {
    name: string;

    op: ModifierOp;

    value: number;
}

/**
 * 通过buff名创建buff实例
 * @param buffName buff名
 * @param buffDef buff的定义
 * @param effectLevel buff等级
 * @returns
 */
export function createBuffInstanceWithName(
    buffName: string,
    buffDef: BuffDef,
    level: number,
    from: string,
    target: string,
    createBuffContext: CreateBuffContext
) {
    const alias = aliasMap.get(buffName);
    const cls = buffMap.get(alias);

    const instance: ActiveBuff = FightPool.getItemByCreateFun(`${poolBuffPrefix}_${buffDef.sign}`, () => {
        return new cls(buffDef, -1);
    }) as ActiveBuff;

    instance["_level"] = -1;

    (instance as any).def = buffDef;
    instance.contextInfo = {
        from: from,
        to: target,
    };
    if (createBuffContext) {
        if (createBuffContext.setByCaller) {
            instance["_setByCallerMagnitude"] = createBuffContext.setByCaller;
        }

        if (createBuffContext.source) {
            instance.contextInfo.source = createBuffContext.source;
        }
    }
    instance.isPendingRemove = false;
    instance.stackCount = 1;
    instance.executeEventTime = 1;
    instance.level = level;
    return instance;
}

export function recoverBuffInstance(effect: ActiveBuff) {
    effect.clear()
    FightPool.recover(`${poolBuffPrefix}_${effect.def.sign}`, effect);
}

/**
 * 通过buff名字获取buff配置
 * @param effectName
 * @returns
 */
export function getBuffDefWithName(effectName: string): BuffDef {
    return buffDefRecord[effectName];
}

/**
 * 预创建buff定义实例
 * @param configs
 */
export function buildBuffDefWithConfig(configs: IFightBuffElement[]) {
    for (const config of configs) {
        if (config.buffName in buffDefRecord) {
            throw new Error("duplicated register effect which name " + config.buffName);
        }

        const modifiers: IModifiers[] = [];

        let cacheModifierInfo = scriptBuffs[config.buffName];
        if (cacheModifierInfo) {
            modifiers.push(...cacheModifierInfo.modifiers);
        }

        if (config.modifierName) {
            if (config.modifierName.length !== config.modifierOp.length && config.modifierOp.length !== config.modifierValue.length) {
                throw new Error(config.buffName + "buff表配置的修改项长度不统一");
            }

            for (let i = 0; i < config.modifierName.length; i++) {
                modifiers.push({
                    // fullName: config.modifierName[i],
                    attributeName: config.modifierName[i],
                    depends: [],
                    calculate: () => {
                        return config.modifierValue[i];
                    },
                    // attributeSetName: undefined,
                    modifierOp: config.modifierOp[i],
                });
            }
        }

        if (!cacheModifierInfo) {
            cacheModifierInfo = Object.create(null);
        }

        const grantAbilities: GrantAbilityInfo[] = config.grantAbilitiesInfo ? JSON.parse(config.grantAbilitiesInfo) : null;

        const def: Required<BuffDef> = {
            ...config,
            sign: config.buffName,
            modifiers: modifiers,
            grantAbilities: grantAbilities ? grantAbilities : [],
            calculateDuration: cacheModifierInfo.durationCall,
            periodCalculate: cacheModifierInfo.periodCall,
            chanceToApplyCal: cacheModifierInfo.chanceToApplyCall,
        };
        buffDefRecord[config.buffName] = def;
    }
}
