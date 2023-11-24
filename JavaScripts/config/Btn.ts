import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Icon","Action","Time","Effect","Music","MusicTime","FlashPic"],["","","","","","","",""],[1,"128704","121812",2,[34],"26",3,"128704","音乐课（贝斯）"],[2,"128710","122448",2,[34],"27",3,"128758","音乐课（萨克斯）"],[3,"128758","120850",2,[34],"28",3,"128710","音乐课（吹笛子）"],[4,"128716","122446",2,[34],"29",3,"128716","音乐课（打鼓）"],[5,"128718","35415",2,[34],"30",3,"128718","音乐课（吉他）"],[6,"120358","14641",1,[35],null,0,"128706","舞蹈课"],[7,"120358","14532",1,[35],null,0,"128699","舞蹈课"],[8,"120364","14737",1,[35],null,0,"128743","舞蹈课"],[9,"120364","123635",1,[35],null,0,"128780","舞蹈课"],[10,"120360","123633",1,[35],null,0,"128719","舞蹈课"]];
export interface IBtnElement extends IElementBase{
 	/**唯一ID*/
	ID:number
	/**图片*/
	Icon:string
	/**动作*/
	Action:string
	/**动作播放的时间*/
	Time:number
	/**特效（特效表）*/
	Effect:Array<number>
	/**配合动作音效的id*/
	Music:string
	/**音效播放的时间*/
	MusicTime:number
	/**闪烁图片*/
	FlashPic:string
 } 
export class BtnConfig extends ConfigBase<IBtnElement>{
	constructor(){
		super(EXCELDATA);
	}

}