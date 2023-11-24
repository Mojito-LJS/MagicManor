
import { IModifiers, ModifierCal } from '../../attribute/aggregator/Modifier';
import { BuffType, PeriodInhibitionPolicy, StackRefreshPolicy, StackExpirationPolicy, GrantAbilityInfo } from './BuffType';




export interface CustomApplyRequirement {

    canApplyRequirement(): boolean
}


export interface BuffDef {
    /**
     * buff标识，唯一
     */
    sign: string;

    /**
     * buff类型
     */
    type: BuffType;

    /**
     * 概率
     */
    chanceToApply: number;


    //#region 周期相关

    /**
     * 被打断后的恢复
     */
    periodInhibitionPolicy: PeriodInhibitionPolicy;

    /**
     * 执行周期
     */
    period: number;

    /**
     * 添加时是否执行
     */
    executeOnApply: boolean;

    //#endregion

    duration: number

    //#region  叠加相关

    /**最大叠加层数 */
    stackLimit: number;

    /**
     * 被叠加时的持续时间刷新规则
     */
    stackDurationRefreshPolicy: StackRefreshPolicy


    /**
     * 被叠加时的周期刷新规则
     */
    stackPeriodRefreshPolicy: StackRefreshPolicy


    /**
     * 当一层叠加消失时的清理规则
     */
    stackExpirationPolicy: StackExpirationPolicy

    /**
     * 当叠加层数溢出时 添加的新buff名
     */
    readonly overflowEffects?: string[]

    /**
     * 溢出时是否阻止叠加栈的刷新
     */
    denyOverflowApply: boolean;

    /**
     * 溢出时是否清理叠加栈
     */
    clearStackOnOverflow: boolean;

    //#endregion 
    //#region 打断时的引用

    /**
     * 当前buff被中断时的添加的buff名
     */
    readonly prematureExpirationEffects?: string[]


    /**
     * 当buff被成功添加后继续添加的buff
     */
    readonly targetEffects?: string[]

    /**
     * 正常结束时再添加的effect
     */
    readonly routineExpirationEffects?: string[];


    /**
     * 阻碍tag
     * 当目标拥有所有下列tag时，该buff不会生效
     */
    readonly immunityTags?: string[]

    /**
     * buff生效时给目标添加的tag
     */
    readonly grantTag?: string[]

    /**
     * 只有拥有下列tag，buff才会执行execute
     */
    readonly ongoingTag?: string[]

    /**
     * 当目标拥有这些tag时 buff会被移除
     */
    readonly removalTag?: string[]

    /**
     * 当buff被成功apply时会从目标身上移除以下tag
     */
    readonly removalTagWhenApply?: string[]


    /**
     * 当buff被添加时必须要求拥有的tag
     */
    readonly applyRequireTags?: string[]


    /**
     * 事件相关
     */
    readonly dependentsEvents?: string[];


    readonly assetId: number;

    /**
     * 最大事件触发次数
     */
    eventApplyLimit: number


    /**
     * 修改方式
     */
    readonly modifiers?: IModifiers[]


    /**
     * 用哪个类去实例化这个buff，默认是ActiveEffect
     */
    className: string;


    /**
     * buff生效时授予的技能
     */
    readonly grantAbilities?: GrantAbilityInfo[]

    /**
     * 持续时间计算函数
     */
    readonly calculateDuration?: ModifierCal


    /**
     * 周期计算函数
     */
    readonly periodCalculate?: ModifierCal


    /**
     * 概率计算函数
     */
    readonly chanceToApplyCal?: (effect: BuffDef, level: number, from: any, to: any) => number


}