import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Score"],["",""],[400101,1],[400102,1],[400103,1],[400104,1],[400105,1],[400106,1],[201101,21],[202101,22],[202201,23],[202301,24],[205101,25],[205201,26],[205301,27],[205401,28],[301101,1],[301102,2],[301103,3],[301104,4],[301105,5],[301106,6],[301107,7],[301108,8],[301109,9],[301110,10]];
export interface ISkillGetScoreElement extends IElementBase{
 	/**技能ID*/
	ID:number
	/**得分*/
	Score:number
 } 
export class SkillGetScoreConfig extends ConfigBase<ISkillGetScoreElement>{
	constructor(){
		super(EXCELDATA);
	}

}