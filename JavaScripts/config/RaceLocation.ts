import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Track","Location","Stage_Big","Stage_Small","Corner","Rotation"],["","","","","","",""],[1001,1,new mw.Vector(5245,-2590,-180),0,0,false,new mw.Vector(0,0,0)],[1002,2,new mw.Vector(5105,-2590,-180),0,0,false,new mw.Vector(0,0,0)],[1003,3,new mw.Vector(4965,-2590,-180),0,0,false,new mw.Vector(0,0,0)],[1004,4,new mw.Vector(4815,-2590,-180),0,0,false,new mw.Vector(0,0,0)],[1005,1,new mw.Vector(5245,430,-180),0,1,false,new mw.Vector(0,0,0)],[1006,2,new mw.Vector(5105,430,-180),0,1,false,new mw.Vector(0,0,0)],[1007,3,new mw.Vector(4965,430,-180),0,1,false,new mw.Vector(0,0,0)],[1008,4,new mw.Vector(4815,430,-180),0,1,false,new mw.Vector(0,0,0)],[1009,1,new mw.Vector(5105,-2590,-180),1,0,false,new mw.Vector(0,0,-40)],[1010,2,new mw.Vector(5665,3995,-180),1,0,false,new mw.Vector(0,0,-40)],[1011,3,new mw.Vector(5545,4070,-180),1,0,false,new mw.Vector(0,0,-40)],[1012,4,new mw.Vector(5430,4150,-180),1,0,false,new mw.Vector(0,0,-40)],[1013,1,new mw.Vector(9575,3820,-180),1,1,false,new mw.Vector(0,0,-140)],[1014,2,new mw.Vector(9685,3890,-180),1,1,false,new mw.Vector(0,0,-140)],[1015,3,new mw.Vector(9800,3975,-180),1,1,false,new mw.Vector(0,0,-140)],[1016,4,new mw.Vector(9920,4045,-180),1,1,false,new mw.Vector(0,0,-140)],[1017,1,new mw.Vector(10035,1595,-180),2,0,false,new mw.Vector(0,0,-180)],[1018,2,new mw.Vector(10180,1595,-180),2,0,false,new mw.Vector(0,0,-180)],[1019,3,new mw.Vector(10315,1595,-180),2,0,false,new mw.Vector(0,0,-180)],[1020,4,new mw.Vector(10460,-600,-180),2,0,false,new mw.Vector(0,0,-180)],[1021,1,new mw.Vector(10035,-600,-180),2,1,false,new mw.Vector(0,0,-180)],[1022,2,new mw.Vector(10180,-600,-180),2,1,false,new mw.Vector(0,0,-180)],[1023,3,new mw.Vector(10315,-600,-180),2,1,false,new mw.Vector(0,0,-180)],[1024,4,new mw.Vector(10460,-600,-180),2,1,false,new mw.Vector(0,0,-180)],[1025,1,new mw.Vector(9590,-4105,-180),3,0,false,new mw.Vector(0,0,150)],[1026,2,new mw.Vector(9715,-4170,-180),3,0,false,new mw.Vector(0,0,150)],[1027,3,new mw.Vector(9830,-4245,-180),3,0,false,new mw.Vector(0,0,150)],[1028,4,new mw.Vector(9955,-4320,-180),3,0,false,new mw.Vector(0,0,150)],[1029,1,new mw.Vector(5855,-4320,-180),3,1,false,new mw.Vector(0,0,40)],[1030,2,new mw.Vector(5765,-4425,-180),3,1,false,new mw.Vector(0,0,40)],[1031,3,new mw.Vector(5665,-4525,-180),3,1,false,new mw.Vector(0,0,40)],[1032,4,new mw.Vector(5098,-3247,-180),3,1,false,new mw.Vector(0,0,40)]];
export interface IRaceLocationElement extends IElementBase{
 	/**唯一id*/
	ID:number
	/**所属赛道*/
	Track:number
	/**坐标*/
	Location:mw.Vector
	/**所属大阶段（在哪两个触发器之间）*/
	Stage_Big:number
	/**所属小阶段（两个触发器之间的第几个）*/
	Stage_Small:number
	/**是不是角落*/
	Corner:boolean
	/**旋转*/
	Rotation:mw.Vector
 } 
export class RaceLocationConfig extends ConfigBase<IRaceLocationElement>{
	constructor(){
		super(EXCELDATA);
	}

}