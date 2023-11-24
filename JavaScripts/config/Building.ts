import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Name","Icon","SlotType","Guid","Location","Effect","EffectScale"],["","","","","","","",""],[1,"风车","176377",1,"C3FD66FC4A2D4EC44A0F4986A167CDD9",new mw.Vector(-1000,2500,6300),"144090",new mw.Vector(8,8,8)],[2,"坐望台","176372",2,"65C9744C4EFA1930D5758B9081DC1040",new mw.Vector(-1000,0,6300),"144090",new mw.Vector(8,8,8)],[3,"揽月亭","176369",3,"3D98E0FB4B1ACBCFC00F29A2C028A73B",new mw.Vector(-1000,-2000,6300),"144090",new mw.Vector(8,8,8)],[4,"门廊","176378",4,"27DF2FF94E63B722E69AE29484E5E24A",new mw.Vector(1000,2500,6300),"144090",new mw.Vector(8,8,8)],[5,"鹊桥","176368",5,"E28E023B4FD1D5B4CE7161A5E13A53EB",new mw.Vector(1000,-1000,6300),"144090",new mw.Vector(8,8,8)],[6,"藏经阁","176367",1,"2317F52A4EEE68A64447C0B1716FE467",new mw.Vector(-1000,2500,6300),"144090",new mw.Vector(8,8,8)],[7,"起居室","176374",2,"2BB0CB43470EB3F0DC1F94B8B21B6938",new mw.Vector(-1000,0,6300),"144090",new mw.Vector(8,8,8)],[8,"练功房","176375",3,"77DF5EC84E99DA352BED0986DC3EF31A",new mw.Vector(-1000,-2000,6300),"144090",new mw.Vector(8,8,8)],[9,"鸟居","176371",4,"E2A733B847CBD1728FC06FB1C484CF92",new mw.Vector(1000,2500,6300),"144090",new mw.Vector(8,8,8)],[10,"樱花桥","176364",5,"8EE16F8F4672125F0DEA7EB3EA37903D",new mw.Vector(1000,-1000,6300),"144090",new mw.Vector(8,8,8)],[11,"神坛","176370",1,"514B95DE4EDDDB84A33D7D8263283E1C",new mw.Vector(-1000,2500,6300),"144090",new mw.Vector(8,8,8)],[12,"部落群","176366",2,"FE3CCC5248809DADB59A1799D8E537F2",new mw.Vector(-1000,0,6300),"144090",new mw.Vector(8,8,8)],[13,"瞭望台","176376",3,"F380AA0345D2F193CE39FE8B7849AAE4",new mw.Vector(-1000,-2000,6300),"144090",new mw.Vector(8,8,8)],[14,"秘境入口","176373",4,"8F6E30364EC862F26FD673B0533AC05C",new mw.Vector(1000,2500,6300),"144090",new mw.Vector(8,8,8)],[15,"精灵之路","176365",5,"BAD498534201187B04C63D997B35F44E",new mw.Vector(1000,-1000,6300),"144090",new mw.Vector(8,8,8)]];
export interface IBuildingElement extends IElementBase{
 	/**建筑ID*/
	ID:number
	/**建筑名称*/
	Name:string
	/**建筑图标*/
	Icon:string
	/**槽点类型*/
	SlotType:number
	/**预制体guid*/
	Guid:string
	/**摆放位置*/
	Location:mw.Vector
	/**特效*/
	Effect:string
	/**特效缩放*/
	EffectScale:mw.Vector
 } 
export class BuildingConfig extends ConfigBase<IBuildingElement>{
	constructor(){
		super(EXCELDATA);
	}

}