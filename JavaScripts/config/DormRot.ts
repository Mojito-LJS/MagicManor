import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","RoomRot"],["",""],[1,[0,0,-90]],[2,[0,0,-90]],[3,[0,0,-90]],[4,[0,0,-90]],[5,[0,0,-90]],[6,[0,0,180]],[7,[0,0,180]],[8,[0,0,-90]],[9,[0,0,-90]],[10,[0,0,-90]],[11,[0,0,-90]],[12,[0,0,-90]]];
export interface IDormRotElement extends IElementBase{
 	/**唯一id*/
	ID:number
	/**房间旋转*/
	RoomRot:Array<number>
 } 
export class DormRotConfig extends ConfigBase<IDormRotElement>{
	constructor(){
		super(EXCELDATA);
	}

}