import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","Guid","RefreshPosArr","unRefreshPosArr"],["","","",""],[1,"21003",null,[new mw.Vector(-866,2657,150),new mw.Vector(-3390,2950,150),new mw.Vector(-3564,-2301,150),new mw.Vector(-831,-2576,150),new mw.Vector(-831,-3906,150)],"金币"],[2,"20973",[new mw.Vector(3417,-58,80),new mw.Vector(5697,-58,-50),new mw.Vector(8496,-38,-50),new mw.Vector(7677,2702,-75),new mw.Vector(7882,-2538,-75),new mw.Vector(7882,-2538,-75),new mw.Vector(2967,-4368,130),new mw.Vector(1162,-6568,110),new mw.Vector(-1208,-7008,110),new mw.Vector(412,302,190),new mw.Vector(1187,-143,100),new mw.Vector(1837,2152,135),new mw.Vector(1517,4597,100),new mw.Vector(1007,6657,100),new mw.Vector(377,7137,65),new mw.Vector(2,-2783,100),new mw.Vector(10197,-2783,100),new mw.Vector(4332,-38,25),new mw.Vector(-4397,-1368,295),new mw.Vector(-800,-85,120),new mw.Vector(-1183,-353,215),new mw.Vector(-1183,-458,215),new mw.Vector(-1548,-33,215),new mw.Vector(4107,1537,145),new mw.Vector(3437,2707,85),new mw.Vector(2007,1392,335),new mw.Vector(3957,-5623,145),new mw.Vector(237,-3578,180),new mw.Vector(487,-978,235),new mw.Vector(-2413,-6758,180),new mw.Vector(3208,-583,109),new mw.Vector(3208,-583,109),new mw.Vector(3208,-2668,45)],null,"银币"]];
export interface ITreasureElement extends IElementBase{
 	/**qid*/
	id:number
	/**资源guid*/
	Guid:string
	/**可刷新的金币的点位集合*/
	RefreshPosArr:mw.Vector[]
	/**不可刷新的金币点位*/
	unRefreshPosArr:mw.Vector[]
 } 
export class TreasureConfig extends ConfigBase<ITreasureElement>{
	constructor(){
		super(EXCELDATA);
	}

}