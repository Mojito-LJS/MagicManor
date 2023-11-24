import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","name","name_cn","type","viewGuid","roomGuid","roomDress","price","party","SelectItemUIBackGuid","SelectItemIconGuid","MartialIndex","floorMartials","ceilingMaritals","metopeMartials"],["","Language","","","","","","","","","","","","",""],[1,"初级房屋","初级庭院",0,"0146B3841D0167E1","34368CD249AD827CD428A9A87D4B97CC",[1],2000,0,"159467","121621",[3,5,6],["7C7B6AA043D85A54EF0F3CB6044A1A3F","9284360947ECB0F7F9CAEF93AC364812","D81444A84A6802AD164A3D83970B6447"],["2218F98C42050454C060149014F9C423","C2770BAE47C7631B78E631A15CF0E1DB","0AE818B245B22DB395551D8447D80A30"],["76B868B84A564E16E3C408B6066487D9","424851924C5ECE424B86ECA7BEF8B926","3ACFDDE44FB8E1102049F78A8A14F55B","9BCA51DA4BC95E26DE3444A388B2E801"]],[2,"中级房屋","中级庭院",0,"0146B3840E9CA979","565B504D445E6D9017928697934596D8",[1],5000,1,"159467","120692",[3,5,6],["7C7B6AA043D85A54EF0F3CB6044A1A3F","9284360947ECB0F7F9CAEF93AC364812","D81444A84A6802AD164A3D83970B6447"],["2218F98C42050454C060149014F9C423","C2770BAE47C7631B78E631A15CF0E1DB","0AE818B245B22DB395551D8447D80A30"],["76B868B84A564E16E3C408B6066487D9","424851924C5ECE424B86ECA7BEF8B926","3ACFDDE44FB8E1102049F78A8A14F55B","9BCA51DA4BC95E26DE3444A388B2E801"]]];
export interface IHomeConfigElement extends IElementBase{
 	/**id*/
	id:number
	/**名称*/
	name:string
	/**中文名*/
	name_cn:string
	/**建筑类型*/
	type:number
	/**外观guid*/
	viewGuid:string
	/**室内guid*/
	roomGuid:string
	/**房屋装饰列表*/
	roomDress:Array<number>
	/**价格*/
	price:number
	/**是否可以举办派对*/
	party:number
	/**选择房屋Item背景UIGuid*/
	SelectItemUIBackGuid:string
	/**选择房屋ItemGuid*/
	SelectItemIconGuid:string
	/**换色材质索引*/
	MartialIndex:Array<number>
	/**地板默认材质*/
	floorMartials:Array<string>
	/**天花板默认材质*/
	ceilingMaritals:Array<string>
	/**墙板默认材质*/
	metopeMartials:Array<string>
 } 
export class HomeConfigConfig extends ConfigBase<IHomeConfigElement>{
	constructor(){
		super(EXCELDATA);
	}

}