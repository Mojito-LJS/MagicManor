import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","trigger","monsters","num","actor","restTime"],["","","","","",""],[1,"21316B11",[5,5],null,null,10],[2,"0BF226D3",[1,2],null,null,10],[3,"27E40765",[3,3],[2],null,10,"不动假人区域"],[4,"187C9CBE",[4,4],[2],null,10,"移动假人区域"],[5,"0191C882",null,null,null,0],[6,"3F02E17E",[4,4],[2],null,10,"高阶战斗区域"]];
export interface IFightAreaElement extends IElementBase{
 	/**undefined*/
	id:number
	/**战场范围的触发器guid*/
	trigger:string
	/**填了是PVE，不填是PVP*/
	monsters:Array<number>
	/**怪物数量，与怪物id一一对应，默认为1个*/
	num:Array<number>
	/**对应锚点guid，为空则为随机*/
	actor:Array<string>
	/**怪物刷新时间（秒）*/
	restTime:number
 } 
export class FightAreaConfig extends ConfigBase<IFightAreaElement>{
	constructor(){
		super(EXCELDATA);
	}

}