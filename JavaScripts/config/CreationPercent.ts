import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","name","dataW"],["","",""],[13101,"魔杖奖池",[[1,17],[2,17],[3,17],[4,17],[5,16],[6,16]]],[13102,"魔杖奖池",[[6,20],[7,20],[8,20],[9,20],[10,20]]],[13103,"魔杖奖池",[[11,20],[12,20],[13,20],[14,20],[15,20]]],[13104,"魔杖奖池",[[16,20],[17,20],[18,20],[19,20],[20,20]]],[13105,"魔杖奖池",[[1,20],[2,20],[3,20],[4,20],[5,20]]],[13106,"魔杖奖池",[[1,20],[2,20],[3,20],[4,20],[5,20]]],[13107,"魔杖奖池",[[1,20],[2,20],[3,20],[4,20],[5,20]]],[13108,"魔杖奖池",[[1,20],[2,20],[3,20],[4,20],[5,20]]],[13109,"魔杖奖池",[[1,20],[2,20],[3,20],[4,20],[5,20]]],[13110,"魔杖奖池",[[1,20],[2,20],[3,20],[4,20],[5,20]]]];
export interface ICreationPercentElement extends IElementBase{
 	/**魔杖ID*/
	ID:number
	/**奖池名字*/
	name:string
	/**造物表对应id权重*/
	dataW:Array<Array<number>>
 } 
export class CreationPercentConfig extends ConfigBase<ICreationPercentElement>{
	constructor(){
		super(EXCELDATA);
	}

}