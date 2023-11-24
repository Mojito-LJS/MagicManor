import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","parallelHandles","nextGuideId"],["","",""],[1,[1,2],2],[2,[3,4],3],[3,[5,6],4],[4,[7,8],5],[5,[9,10],6],[6,[11,12],8],[7,[13,14],8],[8,[15],10],[9,[20,21],10],[10,[22,23],11],[11,[24,25],12],[12,[26],0],[13,[27],0],[14,[28,29],15],[15,[30],0],[16,[31],0],[17,[32,33,34,37,35,36],0],[18,[38],0],[19,[39],0],[20,[40],21],[21,[41],22],[22,[42],23],[23,[43,44],0]];
export interface IguideElement extends IElementBase{
 	/**id*/
	id:number
	/**并行引导操作数组*/
	parallelHandles:Array<number>
	/**下一个引导id*/
	nextGuideId:number
 } 
export class guideConfig extends ConfigBase<IguideElement>{
	constructor(){
		super(EXCELDATA);
	}

}