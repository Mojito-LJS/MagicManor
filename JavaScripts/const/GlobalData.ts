/** 
 * @Author       : 陆江帅
 * @Date         : 2023-04-03 14:24:28
 * @LastEditors  : 陆江帅
 * @LastEditTime : 2023-06-25 10:18:30
 * @FilePath     : \magicmanor\JavaScripts\const\GlobalData.ts
 * @Description  : 
 */
export type Class<T> = { new(...args): T; };

export function MyBoolean(bool: any): boolean {
    if (typeof bool === "boolean") {
        return bool
    }
    if (typeof bool === "string") {
        if (["1", "true", "True"].includes(bool.toString())) {
            return true
        } else {
            return false
        }
    }
    if (typeof bool === "number") {
        if (bool == 0) return false
        else return true
    }
    return false
}
export class GlobalData {
    /**游戏可游玩时间(秒) */
    public static gamePlayTime: number = 8 * 60;
    /**出生点位置 */
    public static globalPos: mw.Vector = null;
    /**是否本地背包 */
    public static isLocalBag: boolean = false;
    /**是否打开GM */
    public static isOpenGM: boolean = false;
    /**现实1s，游戏内多少秒 */
    public static timeScale: number = 0;
    /**开始显示时间，小时 */
    public static dayBeginShow: number = 0;
    /**当前衣服id */
    public static clothConfigID: number = -1;
    /**是否可操作快捷栏 */
    public static isChangeBar: boolean = true;
    /** 快捷栏最大数量 */
    public static maxShortcutBar = 5;
    /**空插槽图片 */
    public static blankSlotBg = "115575";
    /**道具给予距离 */
    public static giveDis = 500;
    /**交互物父节点 */
    public static interactorParent: string = "16A1711E";
    /**技能内置CD */
    public static skillCD: number = 0
    /**默认内置CD */
    public static defaultCD: number = 0.5
    /**造物时动作 */
    public static creationAnim: string = "156436"
    /**飞行准备动作 */
    public static flyStandbyAnim: string = "157058"
    /**飞行动作 */
    public static flyAnim: string = "157056"
    /**飞行结束动作 */
    public static flyOverAnim: string = "157057"
    /** 使用技能时的下落速度 */
    public static glideFallingSpeed: number = 500;
    /** 下落控制 0 - 1 */
    public static glideAirControl: number = 1;
    /** 滑翔伞特效 */
    public static glideEffectGuid: string = "155683";
    /** 下落控制提升速率阈值 */
    public static glideAirControlBoostVelocityThreshold: number = 40000;
    /**契约之戒一阶段id */
    public static ringFirst: number = 70007;
    /**契约之戒二阶段id */
    public static ringSecond: number = 70008;
    /**战斗课怪物出生特效 */
    public static fightResurgenceEffect: string = "1864B983";
    /** 新玩家ID(用于夜晚怪物) */
    public static NEW_PLAYERID: number[] = [];
    /**进入游戏列车CG动画 */
    public static trainCG = "{\"_frameInfos\":[{\"_time\":0,\"_location\":{\"x\":6900,\"y\":-1360,\"z\":7825},\"_rotation\":{\"x\":0,\"y\":-8.82,\"z\":174.67},\"_fov\":90},{\"_time\":0.96,\"_location\":{\"x\":6900,\"y\":1371.73,\"z\":7845},\"_rotation\":{\"x\":0,\"y\":-2.53,\"z\":177.15},\"_fov\":90},{\"_time\":2.31,\"_location\":{\"x\":6900,\"y\":3250,\"z\":7825},\"_rotation\":{\"x\":0,\"y\":1.79,\"z\":178.85},\"_fov\":90},{\"_time\":3.56,\"_location\":{\"x\":6900,\"y\":3250,\"z\":7825},\"_rotation\":{\"x\":0,\"y\":1.79,\"z\":178.85},\"_fov\":90},{\"_time\":4.95,\"_location\":{\"x\":5631.86,\"y\":3091.25,\"z\":7865.18},\"_rotation\":{\"x\":0,\"y\":-11.93,\"z\":195},\"_fov\":90},{\"_time\":6.7,\"_location\":{\"x\":4086.22,\"y\":1981.46,\"z\":6910.6},\"_rotation\":{\"x\":0,\"y\":-10.13,\"z\":180},\"_fov\":90},{\"_time\":8.09,\"_location\":{\"x\":3292.55,\"y\":2007.6,\"z\":6809.9},\"_rotation\":{\"x\":0,\"y\":-12.99,\"z\":180},\"_fov\":90},{\"_time\":9.39,\"_location\":{\"x\":3154.59,\"y\":1990.8,\"z\":6793.06},\"_rotation\":{\"x\":0,\"y\":-31.66,\"z\":180},\"_fov\":90}]}";
    /**生成建筑时CG动画 */
    public static buildingCG = "{\"_frameInfos\":[{\"_time\":0,\"_location\":{\"x\":1989.86,\"y\":20.75,\"z\":6834.88},\"_rotation\":{\"x\":0,\"y\":-2.68,\"z\":178.43},\"_fov\":90},{\"_time\":1.2,\"_location\":{\"x\":3361.03,\"y\":56.09,\"z\":9257.06},\"_rotation\":{\"x\":0,\"y\":-43.67,\"z\":179.5},\"_fov\":90}]}"
    /**1号地块 */
    public static GroundOne = "2EBDD86F";
    /**2号地块 */
    public static GroundTwo = "27C67807";
    /**3号地块 */
    public static GroundThree = "03FB7021";
    /**4号地块 */
    public static GroundFour = "15682563";
    /**5号地块 */
    public static GroundFive = "1E2F5D51";
    /**庄园状态 */
    public static ManorState = 1;
}
