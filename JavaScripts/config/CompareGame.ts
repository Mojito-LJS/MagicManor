import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Increase","Grade","GameTime","Range"],["","","","",""],[1,6,2,90,[0,10]]];
export interface ICompareGameElement extends IElementBase{
 	/**唯一ID*/
	ID:number
	/**难度出现的题目数*/
	Increase:number
	/**答对一道题的分数*/
	Grade:number
	/**比较大小的游戏时间*/
	GameTime:number
	/**数学计算级别范围范围*/
	Range:Array<number>
 } 
export class CompareGameConfig extends ConfigBase<ICompareGameElement>{
	constructor(){
		super(EXCELDATA);
	}

}