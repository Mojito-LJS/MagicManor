import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","NpcName","NameColour","NamePos","FUNS","taskLine","state","coordinate","stopTime","stopAni","leaveText","text","distance","attitude","action","time","aniRoundTime","cd"],["","","","","","","","","","","","","","","","","",""],[1,"狸月",[0.1,1,0.8],new mw.Vector(0,0,100),[1],1,1,null,null,null,"一会学校见",[143],300,null,["8352"],1,[5,10],15,"狸月"],[2,"昆卡",[0.1,1,0.8],new mw.Vector(0,0,100),[7],2,1,null,null,null,"谢谢你的鱼，记得来魔藤找我",[143],300,null,["8352"],1,[5,10],15,"昆卡"],[3,"小熊",[0.1,1,0.8],new mw.Vector(0,0,100),[13],3,1,null,null,null,"小熊先回家了，下次小熊再来找你玩！",[143],300,null,["8352"],1,[5,10],15,"小熊"],[4,"睿智的神秘人",[0.1,1,0.8],new mw.Vector(0,0,100),[19],4,1,null,null,null,"等你领悟了魔法之心，我会再来的！",[143],300,null,["8352"],1,[5,10],15,"睿智的神秘人"],[5,"上帝",[0.1,1,0.8],new mw.Vector(0,0,100),[25],5,1,null,null,null,"精修魔法，我们还会再见",[143],300,null,["8352"],1,[5,10],15,"上帝"],[6,"狸月",[0.1,1,0.8],new mw.Vector(0,0,100),[31],6,1,null,null,null,null,[143],300,null,["8352"],1,[5,10],15,"二阶段狸月"],[7,"昆卡",[0.1,1,0.8],new mw.Vector(0,0,100),[32],6,1,null,null,null,null,[143],300,null,["8352"],1,[5,10],15,"二阶段昆卡"],[8,"小熊",[0.1,1,0.8],new mw.Vector(0,0,100),[33],6,1,null,null,null,null,[143],300,null,["8352"],1,[5,10],15,"二阶段小熊"],[9,"睿智的神秘人",[0.1,1,0.8],new mw.Vector(0,0,100),[34],6,1,null,null,null,null,[143],300,null,["8352"],1,[5,10],15,"二阶段睿智的神秘人"],[10,"上帝",[0.1,1,0.8],new mw.Vector(0,0,100),[35],6,1,null,null,null,null,[143],300,null,["8352"],1,[5,10],15,"二阶段上帝"]];
export interface INPCConfigElement extends IElementBase{
 	/**id*/
	ID:number
	/**npc名称*/
	NpcName:string
	/**名称颜色*/
	NameColour:Array<number>
	/**名称相对位置*/
	NamePos:mw.Vector
	/**对应功能（索引TalkEVENT表的ID）*/
	FUNS:Array<number>
	/**任务线(任务型NPC)*/
	taskLine:number
	/**npc状态（动态，静态）*/
	state:number
	/**移动坐标*/
	coordinate:Array<Array<number>>
	/**到达路径点后停留的时间*/
	stopTime:Array<number>
	/**到达路径点后做的动作*/
	stopAni:Array<number>
	/**离开时触发的文本*/
	leaveText:string
	/**随机触发对话文本*/
	text:Array<number>
	/**触发距离（半径）*/
	distance:number
	/**姿态*/
	attitude:string
	/**动作*/
	action:Array<string>
	/**动画速率*/
	time:number
	/**动画播放间隔时间（区间随机）*/
	aniRoundTime:Array<number>
	/**冷却时间*/
	cd:number
 } 
export class NPCConfigConfig extends ConfigBase<INPCConfigElement>{
	constructor(){
		super(EXCELDATA);
	}

}