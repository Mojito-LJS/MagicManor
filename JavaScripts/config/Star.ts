import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Position"],["",""],[1,new mw.Vector(345,-780,140)],[2,new mw.Vector(695,-2705,182)],[3,new mw.Vector(1510,-4310,55)],[4,new mw.Vector(2365,-6300,55)],[5,new mw.Vector(3850,-7815,60)],[6,new mw.Vector(5180,-8260,-124)],[7,new mw.Vector(8260,-7950,-124)],[8,new mw.Vector(-2295,-655,135)],[9,new mw.Vector(-2300,-2695,136)],[10,new mw.Vector(-2085,-6890,140)],[11,new mw.Vector(330,-8155,55)],[12,new mw.Vector(4090,-2140,130)],[13,new mw.Vector(5030,-4520,-130)],[14,new mw.Vector(1780,3735,55)],[15,new mw.Vector(4560,5300,235)],[16,new mw.Vector(2475,7370,55)],[17,new mw.Vector(9410,7150,-130)],[18,new mw.Vector(5670,-6645,260)],[19,new mw.Vector(7020,-6000,1250)],[20,new mw.Vector(7960,-4750,2260)],[21,new mw.Vector(7960,-6875,3760)],[22,new mw.Vector(-1055,60,6210)],[23,new mw.Vector(7620,-20,-130)],[24,new mw.Vector(4000,-70,60)]];
export interface IStarElement extends IElementBase{
 	/**id*/
	ID:number
	/**位置*/
	Position:mw.Vector
 } 
export class StarConfig extends ConfigBase<IStarElement>{
	constructor(){
		super(EXCELDATA);
	}

}