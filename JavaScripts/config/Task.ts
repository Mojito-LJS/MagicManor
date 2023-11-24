import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","TaskLine","NPC","Name","Describe","TaskType","TaskTarget","TaskTargetCount","GuidePoint","CommitPoint","Building","Money"],["","","","","","","","","","","",""],[10101,1,1,"狸月口渴了","水",1,30001,1,new mw.Vector(4805,-770,6400),new mw.Vector(2197,1981,6400),[4,9,14],null],[20201,2,2,"想吃鱼了","鱼",1,30002,1,new mw.Vector(3673,3662,6064),new mw.Vector(2187,-1007.4,6460.55),[5,10,15],null],[30301,3,3,"蝴蝶，蝴蝶","蝴蝶",1,30003,1,new mw.Vector(0,4084,6400),new mw.Vector(-143,1566,6420),[1,6,11],null],[40401,4,4,"魔法之心","绿色魔法石",1,30004,1,new mw.Vector(5358,6194,6328),new mw.Vector(-223,1179,6432),[2,7,12],null],[50501,5,5,"飞翔吧，魔法师！","雨棚上的魔法书",1,30005,1,new mw.Vector(5830,-104,6629),new mw.Vector(-926,-1270,6464),[3,8,13],null]];
export interface ITaskElement extends IElementBase{
 	/**任务ID*/
	ID:number
	/**任务线ID*/
	TaskLine:number
	/**任务NPC*/
	NPC:number
	/**任务名称*/
	Name:string
	/**任务描述*/
	Describe:string
	/**任务类型*/
	TaskType:number
	/**任务目标*/
	TaskTarget:number
	/**任务目标类数量*/
	TaskTargetCount:number
	/**任务引导点*/
	GuidePoint:mw.Vector
	/**任务提交点*/
	CommitPoint:mw.Vector
	/**建筑奖励*/
	Building:Array<number>
	/**货币奖励*/
	Money:Array<number>
 } 
export class TaskConfig extends ConfigBase<ITaskElement>{
	constructor(){
		super(EXCELDATA);
	}

}