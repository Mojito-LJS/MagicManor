import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","MinScore","Level"],["","","Language"],[1,30,"Text_Text_197"],[2,25,"Text_Text_198"],[3,20,"Text_Text_199"],[4,15,"Text_Text_200"],[5,10,"Text_Text_201"],[6,5,"Text_Text_202"],[7,0,"Text_Text_203"]];
export interface IScoreElement extends IElementBase{
 	/**唯一id*/
	ID:number
	/**最低分数*/
	MinScore:number
	/**对应等级*/
	Level:string
 } 
export class ScoreConfig extends ConfigBase<IScoreElement>{
	constructor(){
		super(EXCELDATA);
	}

}