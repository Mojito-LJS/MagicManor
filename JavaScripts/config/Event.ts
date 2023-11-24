import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Name","TriggerGUID","Loc","ICON","TPTime","EventTime","GradeTime","IFActive","ScoreName","PrefabGuid","PlayType","Params","GuideUIGame1","GuideUIGame2","FixID"],["","Language","","","","","","","","Language","","","","Language","Language","","1：2"],[1,"Text_Text_12","8138996C",new mw.Vector(-1630,4037,200),["128726","128725"],0,142,130,1,"Text_Text_296",null,2,1,"Text_Text_237","Text_Text_242","2","音乐课"],[2,"Text_Text_13","A6E6E591",new mw.Vector(-3103,-2885,200),["120387","128708"],0,142,130,1,"Text_Text_297",null,2,2,"Text_Text_238","Text_Text_243","1","舞蹈课"],[3,"Text_Text_14","FA7E8EE6",new mw.Vector(-1820,2531,200),["128721","128715"],0,142,130,1,"Text_Text_298",null,1,0,"Text_Text_239","Text_Text_244",null,"数学课"],[4,"Text_Text_15","1B569336",new mw.Vector(-1737,-2045,200),["128730","128763"],0,142,130,1,"Text_Text_299",null,6,0,"Text_Text_373","Text_Text_376",null,"美术课"],[5,"Text_Text_16","94B9734B",new mw.Vector(-1889,-4296,200),["120701","128714"],0,142,130,1,"Text_Text_300",null,5,0,"Text_Text_374","Text_Text_377",null,"语言课"],[6,"Text_Text_17","3D6A5AC0",new mw.Vector(-1547.980,52.740,200),["120641","128760"],0,142,130,1,"Text_Text_301",null,9,0,"Text_Text_240","Text_Text_245",null,"战斗魔法"],[7,"Text_Text_18","99C6C1DD",new mw.Vector(5027,-4366,-80),["128745","128752"],0,180,170,1,"Text_Text_302",null,4,0,"Text_Text_372","Text_Text_375",null,"体育课","体育课"],[9,"Text_Text_20","5D553984",new mw.Vector(-1404,-5043,200),["128703","128760"],0,142,130,2,"Text_Text_304",null,0,0,null,null,"3","自习课"],[10,"Text_Text_21","DA23E4C4",new mw.Vector(-3533,-4993,200),["128766","128774"],0,142,130,1,"Text_Text_305",null,0,0,null,null,null,"游泳课"],[11,"Text_Text_22","B93134C4",new mw.Vector(-3057,3470,200),["128765","128725"],0,60,40,2,"Text_Text_306",null,0,0,null,null,null,"午餐"],[12,"Text_Text_23","5DD3B81A",new mw.Vector(-1223,5492,150),["128768","128763"],0,142,130,2,"Text_Text_307",null,0,0,null,null,null,"剧场时间"],[13,"Text_Text_24","F979776F4B2E6622265F60A3AB9CC8E0",new mw.Vector(6794,392,-87),["128764","128774"],0,300,280,2,"Text_Text_308",null,0,0,null,null,null,"自由活动"],[14,"Text_Text_30","3CBD42DA",new mw.Vector(7451,-1162,-184.270),["128768","128763"],0,400,380,2,"Text_Text_275",null,0,0,null,null,null,"夜晚派对"],[15,"Text_Text_33","3CBD42DA",new mw.Vector(5027,-4366,-80),["128768","128763"],0,400,380,2,"Text_Text_534",null,0,0,null,null,null,"学院奇妙夜"],[16,"Text_Text_606","1290F58A",new mw.Vector(-3760,-830,121),["120679","128760"],0,180,170,1,"Text_Text_606",null,7,0,"Text_Text_607","Text_Text_608",null,"造物课"],[17,"Text_Text_605","0F6DEFC7",new mw.Vector(-1726,105,814),["120628","128760"],0,180,170,1,"Text_Text_605",null,8,0,"Text_Text_609","Text_Text_610",null,"飞行课程"]];
export interface IEventElement extends IElementBase{
 	/**唯一ID*/
	ID:number
	/**名字*/
	Name:string
	/**触发器GUID*/
	TriggerGUID:string
	/**传送点位置*/
	Loc:mw.Vector
	/**课程图片*/
	ICON:Array<string>
	/**传送提示时间*/
	TPTime:number
	/**日程持续时间*/
	EventTime:number
	/**结算时间*/
	GradeTime:number
	/**课程or休息*/
	IFActive:number
	/**成绩单名字*/
	ScoreName:string
	/**预制体*/
	PrefabGuid:string
	/**课程玩法代号*/
	PlayType:number
	/**课程玩法参数*/
	Params:number
	/**引导文本标题*/
	GuideUIGame1:string
	/**引导文本内容*/
	GuideUIGame2:string
	/**人物固定ID*/
	FixID:string
 } 
export class EventConfig extends ConfigBase<IEventElement>{
	constructor(){
		super(EXCELDATA);
	}

}