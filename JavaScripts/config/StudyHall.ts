import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["time","text1","text2"],["","Language","Language"],[300,"Study_16","Study_21"],[900,"Study_17","Study_22"],[1800,"Study_18","Study_23"],[3600,"Study_19","Study_24"],[18001,"Study_20","Study_25"]];
export interface IStudyHallElement extends IElementBase{
 	/**时间*/
	time:number
	/**文本1*/
	text1:string
	/**文本2*/
	text2:string
 } 
export class StudyHallConfig extends ConfigBase<IStudyHallElement>{
	constructor(){
		super(EXCELDATA);
	}

}