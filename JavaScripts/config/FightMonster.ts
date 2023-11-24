import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","name","attrId","headMaxD","headScaleFactor","posOffset","deadOffset","inform","time","tags"],["","Language","","","","","","","",""]];
export interface IFightMonsterElement extends IElementBase{
 	/**undefined*/
	id:number
	/**名字*/
	name:string
	/**属性id*/
	attrId:number
	/**头顶ui最大可视距离*/
	headMaxD:number
	/**头顶ui的缩放系数*/
	headScaleFactor:number
	/**偏移*/
	posOffset:mw.Vector
	/**死亡3dui的偏移*/
	deadOffset:mw.Vector
	/**怪物头顶播放文本*/
	inform:Array<number>
	/**多语言Id
（进入战斗/80%/50%/20%/死亡时）*/
	time:number
	/**文字停留时间，毫秒*/
	tags:Array<string>
 } 
export class FightMonsterConfig extends ConfigBase<IFightMonsterElement>{
	constructor(){
		super(EXCELDATA);
	}

}