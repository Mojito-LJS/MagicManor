import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Name","EventID","Week"],["","","","language"],[1,"1",[6,2,11,16,13,15],"Text_Text_211"],[2,"2",[7,17,11,5,13,15],"Text_Text_212"],[3,"3",[16,1,11,6,13,15],"Text_Text_213"],[4,"4",[4,17,11,16,13,15],"Text_Text_214"],[5,"5",[6,7,11,3,13,15],"Text_Text_215"],[6,"6",[7,17,11,16,13,15],"Text_Text_216"],[7,"7",[10,6,11,17,13,15],"Text_Text_217"]];
export interface IScheduleElement extends IElementBase{
 	/**唯一ID*/
	ID:number
	/**名字*/
	Name:string
	/**事件表ID*/
	EventID:Array<number>
	/**星期*/
	Week:string
 } 
export class ScheduleConfig extends ConfigBase<IScheduleElement>{
	constructor(){
		super(EXCELDATA);
	}

}