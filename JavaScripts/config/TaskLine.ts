import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Name","NPC","TaskArray"],["","","",""],[1,"狸月线",1,[10101]],[2,"昆卡线",2,[20201]],[3,"小熊线",3,[30301]],[4,"神秘人线",4,[40401]],[5,"上帝线",5,[50501]]];
export interface ITaskLineElement extends IElementBase{
 	/**任务线ID*/
	ID:number
	/**任务线名称*/
	Name:string
	/**任务线NPC*/
	NPC:number
	/**任务数组*/
	TaskArray:Array<number>
 } 
export class TaskLineConfig extends ConfigBase<ITaskLineElement>{
	constructor(){
		super(EXCELDATA);
	}

}