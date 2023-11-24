import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Type","Corner","Guid","Offset","Scale","TriggerLoc","TiggerScale","MusicID","Parameter","Effect","EffectScale","EffectRotation"],["","","","","","","","","","","","",""],[1001,0,true,"50870",new mw.Vector(0,0,0),new mw.Vector(1,1,1),null,null,null,[100,5],null,null,new mw.Vector(0,0,-160)],[1002,1,false,"21622",new mw.Vector(0,0,0),new mw.Vector(0.85,0.85,0.85),new mw.Vector(0,0,0),new mw.Vector(1,1,1),"32",[800,5],"99035",new mw.Vector(1,1,1),new mw.Vector(0,0,-90)],[1003,2,true,"13724",new mw.Vector(0,0,100),new mw.Vector(1.2,1.2,1.4),new mw.Vector(0,0,0),new mw.Vector(1,1,1),"32",[2],null,null,null],[1004,1,false,"141634",new mw.Vector(0,0,0),new mw.Vector(4,4,4),new mw.Vector(0,0,0),new mw.Vector(1,1,1),"32",[-150,5],"21646",new mw.Vector(1,0.3,0.3),new mw.Vector(0,90,0)],[1005,0,true,"43460",new mw.Vector(0,0,0),new mw.Vector(1,1,1),null,null,null,[100,5],null,null,new mw.Vector(0,0,0)],[1006,0,true,"26836",new mw.Vector(0,0,0),new mw.Vector(1,1,1),null,null,null,[100,5],null,null,new mw.Vector(0,0,45)],[1007,0,true,"22913",new mw.Vector(0,0,0),new mw.Vector(2,1,1),null,null,null,[100,5],null,null,new mw.Vector(0,0,-180)],[1008,1,false,"21622",new mw.Vector(0,0,0),new mw.Vector(0.85,0.85,0.85),new mw.Vector(0,0,0),new mw.Vector(1,1,1),"32",[800,5],"99035",new mw.Vector(1,1,1),new mw.Vector(0,0,-90)],[1009,1,false,"141634",new mw.Vector(0,0,0),new mw.Vector(4,4,4),new mw.Vector(0,0,0),new mw.Vector(1,1,1),"32",[-150,5],"21646",new mw.Vector(1,0.3,0.3),new mw.Vector(0,90,0)],[1010,2,true,"13724",new mw.Vector(0,0,100),new mw.Vector(1.2,1.2,1.4),new mw.Vector(0,0,0),new mw.Vector(1,1,1),"32",[2],null,null,null]];
export interface IRacePropElement extends IElementBase{
 	/**唯一id*/
	ID:number
	/**道具类型*/
	Type:number
	/**是否可以出现在角落*/
	Corner:boolean
	/**资源GUID*/
	Guid:string
	/**坐标偏移*/
	Offset:mw.Vector
	/**缩放*/
	Scale:mw.Vector
	/**触发器相对坐标*/
	TriggerLoc:mw.Vector
	/**触发器缩放*/
	TiggerScale:mw.Vector
	/**出发时播放的音效的ID*/
	MusicID:string
	/**参数*/
	Parameter:Array<number>
	/**出现在玩家身上的特效*/
	Effect:string
	/**特效缩放*/
	EffectScale:mw.Vector
	/**特效旋转*/
	EffectRotation:mw.Vector
 } 
export class RacePropConfig extends ConfigBase<IRacePropElement>{
	constructor(){
		super(EXCELDATA);
	}

}