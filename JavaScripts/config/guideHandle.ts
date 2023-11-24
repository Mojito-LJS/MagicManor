import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","handleType","dialogText","pos","targetObj","lockRotation","camLen","camPosSpeed","camRotSpeed","AppearUI","NodePath","UIDiag"],["","","Language","","","","","","","","","Language"],[1,1,"Text_Text_257",null,null,null,0,0,0,null,null,null],[2,2,null,null,"D691CD6D",new mw.Vector(0,-15,180),300,3,3,null,null,null],[3,1,"Text_Text_259",null,null,null,0,0,0,null,null,null],[4,2,null,null,"A8077720",new mw.Vector(0,-45,0),300,1,1,null,null,null],[5,1,"Text_Text_261",null,null,null,0,0,0,null,null,null],[6,2,null,null,"59FCD83A",new mw.Vector(0,-15,90),300,3,3,null,null,null],[7,1,"Text_Text_263",null,null,null,0,0,0,null,null,null],[8,2,null,null,"84B25C1B",new mw.Vector(0,-15,90),300,3,3,null,null,null],[9,1,"Text_Text_265",null,null,null,0,0,0,null,null,null],[10,2,null,null,"D2D1C838",new mw.Vector(0,-15,90),300,3,3,null,null,null],[11,1,"Text_Text_267",null,null,null,0,0,0,null,null,null],[12,2,null,null,"A8F3B70B",new mw.Vector(0,-15,180),300,3,3,null,null,null],[13,1,"Text_Text_269",null,null,null,0,0,0,null,null,null],[14,2,null,null,"FBC601F5",new mw.Vector(0,-15,270),300,3,3,null,null,null],[15,3,null,null,null,null,0,0,0,null,null,null],[16,1,"Text_Text_256",null,null,null,0,0,0,null,null,null],[17,5,null,null,null,null,0,0,0,"CameraEnter","mButton_1","Text_Text_280"],[18,5,null,null,null,null,0,0,0,"CameraMain","mButton_Camera","Text_Text_279"],[19,5,null,null,null,null,0,0,0,"CameraMain","mButton_Close","Text_Text_281"],[20,1,"Text_Text_272",null,null,null,0,0,0,null,null,null],[21,4,null,new mw.Vector(-1138,-951,100),null,null,0,0,0,null,null,null],[22,1,"Text_Text_255",null,null,null,0,0,0,null,null,null],[23,1,"Text_Text_258",null,null,null,0,0,0,null,null,null],[24,5,null,null,null,null,0,0,0,"ScheduleOpenbtn","mBtn_1","Text_Text_274"],[25,5,null,null,null,null,0,0,0,"ScheduleInfo","mCanvas_guide","Text_Text_276"],[26,1,"Text_Text_278",null,null,null,0,0,0,"ScheduleInfo","mCanvas_guide","Text_Text_276"],[27,0,null,null,null,null,0,0,0,"ScheduleInfo","mCanvas_guide","Text_Text_276","飞行课程开启引导点击前往"],[28,5,null,null,null,null,0,0,0,"BagHub","guideBtn","Text_Text_602","飞行课程引导点击魔杖道具"],[29,5,null,null,null,null,0,0,0,"SkillUI","guideBtn","Text_Text_603","引导使用飞行技能"],[30,4,null,new mw.Vector(260.060,5481.770,2848.650),null,null,0,0,0,null,null,null,"打开引导专圈的UI界面"],[31,0,null,null,null,null,0,0,0,"ScheduleInfo","mCanvas_guide","Text_Text_276","造物课程开启引导点击前往"],[32,5,null,null,null,null,0,0,0,"BagHub","guideBtn","Text_Text_597","造物课程引导点击魔杖道具"],[33,5,null,null,null,null,0,0,0,"SkillUI","guideBtn","Text_Text_598","引导使用造物技能"],[34,5,null,null,null,null,0,0,0,"MakePropUI","guideButton","Text_Text_599","引导使用造物"],[35,5,null,null,null,null,0,0,0,"BagHub","mGuideBtn","Text_Text_600","造物课程引导点击汉堡道具"],[36,5,null,null,null,null,0,0,0,"SkillUI","guideBtn","Text_Text_601","使用造出汉堡技能"],[37,6,null,null,null,null,0,0,0,"BagHub",null,null],[38,0,null,null,null,null,0,0,0,"ScheduleInfo","mCanvas_guide","Text_Text_276","造物课程开启引导点击前往"],[39,5,null,null,null,null,0,0,0,"SkillUI","guideBtn","Text_Text_632","使用战斗技能"],[40,5,null,null,null,null,0,0,0,"NPCPanle","guideBtn","Text_Text_638","引导点击兑换物品"],[41,5,null,null,null,null,0,0,0,"GiftUI","buttonGet","Text_Text_639","引导点击领取礼物"],[42,5,null,null,null,null,0,0,0,"GetItem","mAccept","Text_Text_639","引导点击收下"],[43,5,null,null,null,null,0,0,0,"BagHub","guideBtn","Text_Text_640","引导点击使用道具栏"],[44,5,null,null,null,null,0,0,0,"SkillUI","guideBtn","Text_Text_641","引导使用技能"]];
export interface IguideHandleElement extends IElementBase{
 	/**id*/
	id:number
	/**操作类型*/
	handleType:number
	/**对话内容文本*/
	dialogText:string
	/**引导点*/
	pos:mw.Vector
	/**目标点绑定对象*/
	targetObj:string
	/**锁定目标时的方向*/
	lockRotation:mw.Vector
	/**相机弹簧臂长度*/
	camLen:number
	/**相机位移延迟速度*/
	camPosSpeed:number
	/**相机旋转延迟速度*/
	camRotSpeed:number
	/**出现界面*/
	AppearUI:string
	/**节点路径*/
	NodePath:string
	/**UI提示语*/
	UIDiag:string
 } 
export class guideHandleConfig extends ConfigBase<IguideHandleElement>{
	constructor(){
		super(EXCELDATA);
	}

}