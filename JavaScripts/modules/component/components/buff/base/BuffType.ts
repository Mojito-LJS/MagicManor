
const INFINITE_DURATION = 0;

const INSTANT_APPLICATION = 0;

const NO_PERIOD = 0;

const INVALID_LEVEL = -1;

export const BuffConstant = {
    INFINITE_DURATION,
    INSTANT_APPLICATION,
    NO_PERIOD,
    INVALID_LEVEL
}

export enum BuffType {

    /**
     * 即刻 执行一次后就销毁
     */
    Instant = 0,

    /**
     * 持续 在一定时间内存在 
     */
    Duration,

    /**
     * 无限 一直存在
     */
    Infinite,

    /**
     * 占位符
     */
    Max
}

export enum PeriodInhibitionPolicy {

    /**
     * 从被打断时的位置开始计算周期，相当于暂停再播放。
     */
    NeverReset,

    /**
     * 从0开始计算周期。
     */
    ResetPeriod,

    /**
     * 打断时立即执行一次，下次从0开始计算周期。
     */
    ExecuteAndPeriod,

    Max
}



/**
 * 周期buff的持续时间在被叠加时的刷新规则
 */
export enum StackRefreshPolicy {

    /**被叠加时刷新 */
    RefreshOnApply,

    /**不刷新 */
    NeverRefresh,

    /** 占位符 */
    Max
}


/**
 * 叠加过期时的清理规则
 */
export enum StackExpirationPolicy {
    /**
     * 清理整个叠加栈
     * 类似LOL征服者，没续上就没了
     */
    ClearEntireStack,

    /**
     * 清除一层
     * 类似LOL致命节奏，一层层的掉
     */
    RemoveSingleStack,

    /**
     * 只刷新持续时间，不清空
     */
    RefreshDuration
}



export enum GrantAbilityRemovalPolicy {

    /**buff结束时，立即解绑技能，如果技能在执行中也立即取消掉 */
    CancelAbilityImmediately,

    /**buff 结束时，立即解绑技能，当技能执行完成后移除掉*/
    RemoveAbilityOnEnd,

    DoNothing

}



export interface GrantAbilityInfo {

    /** 技能名 */
    abilityName: string;

    /**技能移除方案 */
    removalPolicy: GrantAbilityRemovalPolicy
}