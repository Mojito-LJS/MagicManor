import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","PropGroups"],["",""],[1,null,"双人动作发起者"],[2,[29,79,80,81,82,83,84,85,86,87,88,89,90],"交互物"],[3,[29,79,80,81,82,83,84,85,86,87,88,89,90],"双人动作接受者"]];
export interface IItemPropGroupElement extends IElementBase{
 	/**ID*/
	ID:number
	/**互斥道具组*/
	PropGroups:Array<number>
 } 
export class ItemPropGroupConfig extends ConfigBase<IItemPropGroupElement>{
	constructor(){
		super(EXCELDATA);
	}

}