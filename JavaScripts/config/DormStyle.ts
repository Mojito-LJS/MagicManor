import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Guid","Capacity","Cost","HasBalcony"],["","","","",""],[1,"27BCFD544CA3A43A94847E8CF585A810",2,0,1],[2,"1CD6013B40A0A0A6E00F53838AB0BB93",1,0,1],[3,"5996CB2D444746D8AB8F4A9EFEB3294A",1,0,1],[4,"94F47E8847A51E0A04D4EBA2E864102C",2,0,1],[5,"FCDE77B64CF314634341E1B384E1D75E",2,5,1],[6,"882AD21D434C9BF9216D428FB2F9A207",2,0,1],[7,"63877B074610F800CEDDB4B3A78BF25F",1,10,1],[8,"0D2A3F934CBAEE5B487E6FB38C5B0487",2,20,1],[9,"14AC427546771C3BCAD50ABDAC3A13BF",2,30,1],[10,"BF696FC3463BFEB581489E977FF855E6",1,0,0]];
export interface IDormStyleElement extends IElementBase{
 	/**唯一id*/
	ID:number
	/**样式guid*/
	Guid:string
	/**容纳人数*/
	Capacity:number
	/**所需费用*/
	Cost:number
	/**是否有阳台*/
	HasBalcony:number
 } 
export class DormStyleConfig extends ConfigBase<IDormStyleElement>{
	constructor(){
		super(EXCELDATA);
	}

}