import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Name","Type","Need","Icon","Items","SilverCoin","GoldCoin","MoonCoin"],["","Language","","","","","","",""],[1001,"GiftName_1",1,4,"127393",[[70003,1]],50,3,0],[1002,"GiftName_2",1,9,"127406",[[14101,1]],110,5,0],[1003,"GiftName_3",1,15,"127388",[[302,1]],180,7,0],[1004,"GiftName_4",1,24,"127402",[[114,1],[70004,1],[80004,1]],260,9,0]];
export interface IGiftElement extends IElementBase{
 	/**id*/
	ID:number
	/**礼包名称*/
	Name:string
	/**礼包兑换类型:1星星、*/
	Type:number
	/**领取所需数量*/
	Need:number
	/**礼包图标*/
	Icon:string
	/**获取道具ID及数量 例：1001|1||1002|1*/
	Items:Array<Array<number>>
	/**银币数量*/
	SilverCoin:number
	/**金币数量*/
	GoldCoin:number
	/**月亮币数量*/
	MoonCoin:number
 } 
export class GiftConfig extends ConfigBase<IGiftElement>{
	constructor(){
		super(EXCELDATA);
	}

}