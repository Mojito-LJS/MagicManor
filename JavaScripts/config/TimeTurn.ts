import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Time","NUM1","NUM2","NUM3","NUM4","NUM5","NUM6","NUM7","NUM8","NUM9","NUM10","NUM11","NUM12","NUM13","NUM14","NUM15","NUM16","NUM17","NUM18","NUM19","NUM20","NUM21"],["","","","","","","","","","","","","","","","","","","","","","",""],[1,0,1,1,"FFFFFFFF","6A89FFFF","99B3EBFF","A4BBEBFF",3.8,"FFE2B6FF",1,"E4EAFFFF",2,"E9EBFF00",-150,-30,6,"FFFFFF00",2000,4500,0,0,0],[2,700,2,1.3,"ACFDFD","006695FF","E15841FF","FFC071FF",3.2,null,0.625,"CE4A3BFF",1.2,"FFE0B900",-165,-15,9,"FFE8EA00",4000,3500,0,0,0],[3,860,4,1,"FFFFFFFF","270029FF","130220FF","0C0020FF",3,null,0.05,"353832FF",0.8,"C6CAF300",-90,-25,3,"FFFFFF00",2000,9000,0.7,11,60]];
export interface ITimeTurnElement extends IElementBase{
 	/**唯一ID*/
	ID:number
	/**时间点*/
	Time:number
	/**天空球预设*/
	NUM1:number
	/**天空球亮度*/
	NUM2:number
	/**天空球整体颜色*/
	NUM3:string
	/**天空球顶层颜色*/
	NUM4:string
	/**天空球上层颜色*/
	NUM5:string
	/**天空球下层颜色*/
	NUM6:string
	/**地平线渐出*/
	NUM7:number
	/**太阳颜色*/
	NUM8:string
	/**云透明度*/
	NUM9:number
	/**云颜色*/
	NUM10:string
	/**光强度*/
	NUM11:number
	/**光颜色*/
	NUM12:string
	/**朝向角度*/
	NUM13:number
	/**俯仰角度*/
	NUM14:number
	/**强度*/
	NUM15:number
	/**光颜色*/
	NUM16:string
	/**阴影距离*/
	NUM17:number
	/**色温*/
	NUM18:number
	/**星星亮度*/
	NUM19:number
	/**星星密度*/
	NUM20:number
	/**月亮大小*/
	NUM21:number
 } 
export class TimeTurnConfig extends ConfigBase<ITimeTurnElement>{
	constructor(){
		super(EXCELDATA);
	}

}