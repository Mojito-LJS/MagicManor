/** 
 * @Author       : 陆江帅
 * @Date         : 2023-05-25 16:40:46
 * @LastEditors  : 陆江帅
 * @LastEditTime : 2023-06-12 18:14:11
 * @FilePath     : \magicmanor\JavaScripts\const\GameEnum.ts
 * @Description  : 
 */
// 轴类型
export enum Axis {
	X = 0,
	Y,
	Z,
}




export enum EventsName {
	/**使用造物技能 */
	CreationSkills = "CreationSkills",
	/**战斗对象复活 */
	EntityRevival = "MonsterRevival",
	/**添加道具 */
	AddItem = "AddItem",
	/**装备道具 */
	EquipProp = "EquipProp",
	/**加载道具 */
	LoadProp = "LoadProp",
	/**卸载道具 */
	UnloadProp = "UnloadProp",
	/**使用技能 */
	UseSkill = "UseSkill",
	/**属性变化 */
	HpChangeShowFly = "HpChangeShowFly",
	MyPlayerAttributeChange = "MyPlayerAttributeChange",
	/**战斗课程 */
	FightCourse = "FightCourse",
	/**开始舞会 */
	StartParty = "StartParty",
	/**取消玩家交互 */
	CancelActive = "CancelActive",
	/**埋点事件 */
	NetMsg_MGSMsg_Send = "NET_MSG_SEND_MGS",
	/**打开背包 */
	OpenBagPanel = "OpenBagPanel",
	/** 玩家跳跃 */
	PLAYER_JUMP = "PLAYER_JUMP",
	FreshLocation = "FreshLocation",
	/**重置服装 */
	PlayerResetCloth = "PlayerResetCloth",
	/**玩家进入推出飞行姿态 */
	PLAYER_FLY = "PLAYER_FLY",
	/**玩家设置状态 */
	PLAYER_STATE = "PLAYER_STATE",
	/**怪物死亡 */
	MonsterDead = "MonsterDead",
	/**移除实列对象 */
	RemoveEntity = "RemoveEntity",
	/**夜晚银币 */
	SilverCoinAtNight = "SilverCoinAtNight",
	/**连击 */
	ComboChange = "ComboChange",
	/**移除夜晚怪物 */
	RemoveNightEntity = "RemoveNightEntity",
	/**庄园改变 */
	ManorChange = "ManorChange",
	/**出入建筑 */
	EnterBuilding = "EnterBuilding",
}
/**
 * 角色状态
 */
export enum PlayerStateType {
	Interaction = 1,//和交互物交互
	DoublePeopleAction = 2,//双人动作
	Fly,//飞行
}

export enum TriggerType {
	None = "0",
	Distance = "1",

	BoxTrigger = "2",

	SphereTrigger = "3",
}


export enum SkillState {
	Disable = -2,
	Hide = -1,
	Enable = 0,
	State1 = 1,
	State2 = 2,
	Creation = 15,
	Relation = 16,
	Designation = 17,
	Using = 20,
}
