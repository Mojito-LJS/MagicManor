import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Des1","Name","ICON","ICON2","TEXT","OverRewardText","TaskLine","TaskText","EffGuid","Pos","soundGuid","Scale","ActionGuid","Actiontime","stopTime","state","canvasSize","params"],["","","","","","","","","","","","","","","","","","",""],[1,"跟狸月对话","跟狸月对话","106328","106332",1,0,1,[1,4,5,6,7],null,null,null,0,null,0,2,1,[520,100],0],[2,"原来我这么优秀","原来我这么优秀","106328","106332",2,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[3,"我想知道！","我想知道！","106328","106332",3,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[4,"没问题","没问题","106328","106332",8,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[5,"给你","给你","106328","106332",9,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[6,"不","不","106328","106332",0,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[7,"跟昆卡对话","跟昆卡对话","106328","106332",10,0,2,[10,13,14,15,16],null,null,null,0,null,0,2,1,[520,100],0],[8,"我们见过！","我们见过！","106328","106332",11,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[9,"什么礼物？","什么礼物？","106328","106332",12,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[10,"没问题","没问题","106328","106332",17,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[11,"给你","给你","106328","106332",18,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[12,"不","不","106328","106332",0,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[13,"和小熊对话","和小熊对话","106328","106332",19,0,3,[19,22,23,24,25],null,null,null,0,null,0,2,1,[520,100],0],[14,"小熊怎么了？","小熊怎么了？","106328","106332",20,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[15,"蝴蝶在哪？","蝴蝶在哪？","106328","106332",21,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[16,"没问题","没问题","106328","106332",26,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[17,"给你","给你","106328","106332",27,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[18,"不","不","106328","106332",0,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[19,"和神秘人对话","和神秘人对话","106328","106332",28,0,4,[28,31,32,33,34],null,null,null,0,null,0,2,1,[520,100],0],[20,"不知道","不知道","106328","106332",29,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[21,"这老头在说啥？","这老头在说啥？","106328","106332",30,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[22,"那我去找找看。","那我去找找看。","106328","106332",35,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[23,"给你","给你","106328","106332",36,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[24,"不","不","106328","106332",0,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[25,"和上帝对话","和上帝对话","106328","106332",37,0,5,[37,40,41,42,43],null,null,null,0,null,0,2,1,[520,100],0],[26,"你是谁？在我庄园干嘛！","你是谁？在我庄园干嘛！","106328","106332",38,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[27,"你能为我补齐这一角？","你能为我补齐这一角？","106328","106332",39,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[28,"我这就去！","我这就去！","106328","106332",44,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[29,"给你","给你","106328","106332",45,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[30,"不","不","106328","106332",0,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[31,"重新建造","重新建造","106328","106332",46,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[32,"重新建造","重新建造","106328","106332",47,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[33,"重新建造","重新建造","106328","106332",48,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[34,"重新建造","重新建造","106328","106332",49,0,0,null,null,null,null,0,null,0,2,1,[520,100],0],[35,"重新建造","重新建造","106328","106332",50,0,0,null,null,null,null,0,null,0,2,1,[520,100],0]];
export interface ITalkEventElement extends IElementBase{
 	/**qid*/
	ID:number
	/**中文文本描述（不读）*/
	Des1:string
	/**事件名称(索引SquareLanguage表)文本，玩家说的话*/
	Name:string
	/**事件itemicon*/
	ICON:string
	/**事件icon2*/
	ICON2:string
	/**点击对话过后底部显示的对话文本NPC说的话*/
	TEXT:number
	/**奖励获得过后NPC的说话文本*/
	OverRewardText:number
	/**任务线ID*/
	TaskLine:number
	/**任务状态对话：可领取|进行中|可提交|已完成|有其他任务*/
	TaskText:Array<number>
	/**特效guid*/
	EffGuid:string
	/**特效偏移xyz*/
	Pos:mw.Vector
	/**音效guid*/
	soundGuid:string
	/**音效大小*/
	Scale:number
	/**动作guid*/
	ActionGuid:string
	/**动作时长*/
	Actiontime:number
	/**停留时间*/
	stopTime:number
	/**npc状态（动态，静态）填2的话会跟随玩家走*/
	state:number
	/**选择对话框的大小，有些长文字UI无法自适应，得手动调*/
	canvasSize:Array<number>
	/**额外参数*/
	params:number
 } 
export class TalkEventConfig extends ConfigBase<ITalkEventElement>{
	constructor(){
		super(EXCELDATA);
	}

}