import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","name","icon","parentTypeId"],["","","",""],[1,"地面",null,0],[2,null,null,0],[3,null,null,0],[4,"床类","167239",1],[5,"椅类","167271",1],[6,"柜类","167316",1],[7,"桌类","167259",1],[8,"玩偶类","167202",1],[9,"装饰类","167214",1],[10,"卫浴类","167260",1]];
export interface IHomeDressTypeElement extends IElementBase{
 	/**id*/
	id:number
	/**分类名称*/
	name:string
	/**分类图标guid*/
	icon:string
	/**父级分类id*/
	parentTypeId:number
 } 
export class HomeDressTypeConfig extends ConfigBase<IHomeDressTypeElement>{
	constructor(){
		super(EXCELDATA);
	}

}