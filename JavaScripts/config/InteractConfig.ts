import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","IsServer","Name","Scripts","Tips","Params1","Params2","Params3","Params4"],["","","","","","","","",""],[1,false,"水",["Input_UI","GetItem"],"水",["0","0","1","200","110111","0/0/0","2"],["0","0","30001"],null,null],[2,false,"鱼",["Input_UI","GetItem"],"鱼",["0","0","1","200","110111","0/0/0","2"],["0","0","30002"],null,null],[3,false,"蝴蝶",["Input_UI","GetItem"],"蝴蝶",["0","0","1","200","110111","0/0/0","2"],["0","0","30003"],null,null],[4,false,"石头",["Input_UI","GetItem"],"石头",["0","0","1","200","110111","0/0/0","2"],["0","0","30004"],null,null],[5,false,"书",["Input_UI","GetItem"],"书",["0","0","1","200","110111","0/0/0","2"],["0","0","30005"],null,null],[6,true,"1",["Active_UI","Interactive"],"公园凳1",["0","1","1","150","110111","34423","0/0/0","1","0"],["0","0","4175","0","1"],null,null],[7,true,"2",["Active_UI","Interactive"],"公园凳1",["0","1","1","150","110111","34423","0/0/0","1","0"],["0","0","4175","0","1"],null,null],[8,true,"3",["Active_UI","Interactive"],"公园凳2",["0","1","1","150","110111","34423","0/0/0","1","0"],["0","0","4175","0","1"],null,null],[9,true,"4",["Active_UI","Interactive"],"公园凳2",["0","1","1","150","110111","34423","0/0/0","1","0"],["0","0","4175","0","1"],null,null],[10,true,"5",["Active_UI","PlayAni"],"床1",["0","1","1","230","120657","34423","0/0/0","1","0"],["0","0","14654","1","0","0/0/90","0/-30/0","0"],null,null],[11,true,"6",["Active_UI","PlayAni"],"床1",["0","1","1","230","120657","34423","0/0/0","1","0"],["0","0","86093","1","0","0/0/90","0/-30/0","0"],null,null],[12,true,"7",["Active_UI","PlayAni"],"洗漱台1",["0","1","1","120","110111","34423","0/0/0","1","0"],["0","0","86098","1","0","0/0/90","0/-30/0","0"],null,null],[13,true,"8",["Active_UI","PlayAni"],"洗漱台2",["0","1","1","120","110111","34423","0/0/0","1","0"],["0","0","86098","1","0","0/0/90","0/-30/0","0"],null,null],[14,false,"9",["Input_UI","GetItem"],"奶昔",["0","0","1","200","110111","0/0/0","2"],["0","0","33"],null,null],[15,false,"10",["Input_UI","GetItem"],"甜甜圈",["0","0","1","200","110111","0/0/0","2"],["0","0","35"],null,null],[16,false,"11",["Input_UI","GetItem"],"冰淇淋",["0","0","1","200","110111","0/0/0","2"],["0","0","34"],null,null]];
export interface IInteractConfigElement extends IElementBase{
 	/**交互物唯一ID*/
	ID:number
	/**是否是双端交互物*/
	IsServer:boolean
	/**交互物名字*/
	Name:string
	/**绑定脚本顺序*/
	Scripts:Array<string>
	/**备注*/
	Tips:string
	/**脚本参数1*/
	Params1:Array<string>
	/**脚本参数2*/
	Params2:Array<string>
	/**脚本参数3*/
	Params3:Array<string>
	/**脚本参数4*/
	Params4:Array<string>
 } 
export class InteractConfigConfig extends ConfigBase<IInteractConfigElement>{
	constructor(){
		super(EXCELDATA);
	}

}