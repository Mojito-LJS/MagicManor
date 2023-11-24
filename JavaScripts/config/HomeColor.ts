import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","colorHex"],["",""],[1,"#F36161FF"],[2,"#F2A85FFF"],[3,"#F2EF60FF"],[4,"#A9F161FF"],[5,"#61F062FF"],[6,"#62F2AAFF"],[7,"#61F2EFFF"],[8,"#61A9F1FF"],[9,"#6061EFFF"],[10,"#AA63F1FF"],[11,"#F061F1FF"],[12,"#F161A7FF"],[13,"#594A1FFF"],[14,"#1F5A2EFF"],[15,"#1F2E59FF"],[16,"#591E4CFF"],[17,"#F1F1EFFF"],[18,"#404040FF"]];
export interface IHomeColorElement extends IElementBase{
 	/**id*/
	id:number
	/**颜色*/
	colorHex:string
 } 
export class HomeColorConfig extends ConfigBase<IHomeColorElement>{
	constructor(){
		super(EXCELDATA);
	}

}