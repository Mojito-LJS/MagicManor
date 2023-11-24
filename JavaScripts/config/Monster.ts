import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Type","Guid","Speed","Scale","Rotation","Trigger","ShowTrigger","victorySound","hitSound","deathSound","deathAnimation","deathStance","killEffect","deathEffect","PathRadius","AttackRadius","Position","LineSpeed","time"],["","","","","","","","","","","","","","","","","","","",""],[1,0,null,0,null,null,null,null,0,0,0,null,null,null,0,0,0,null,null,0]];
export interface IMonsterElement extends IElementBase{
 	/**唯一id*/
	ID:number
	/**怪物类型*/
	Type:number
	/**资源GUID*/
	Guid:string
	/**移动速度*/
	Speed:number
	/**缩放*/
	Scale:mw.Vector
	/**旋转*/
	Rotation:mw.Vector
	/**追击触发器*/
	Trigger:string
	/**显示触发器*/
	ShowTrigger:string
	/**胜利音效*/
	victorySound:number
	/**受击音效*/
	hitSound:number
	/**死亡音效*/
	deathSound:number
	/**死亡动画*/
	deathAnimation:string
	/**死亡姿态*/
	deathStance:string
	/**击杀效果，光柱|头顶特效*/
	killEffect:Array<number>
	/**死亡特效*/
	deathEffect:number
	/**寻路检测半径*/
	PathRadius:number
	/**攻击检测半径*/
	AttackRadius:number
	/**待机位置*/
	Position:mw.Vector[]
	/**运动器移动速度*/
	LineSpeed:mw.Vector
	/**运动器单程时间*/
	time:number
 } 
export class MonsterConfig extends ConfigBase<IMonsterElement>{
	constructor(){
		super(EXCELDATA);
	}

}