import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","ModelGuid","ModelPoint","ModelLocation","ModelLarge","ModelRotate","Notice"],["","","","","","",""],[1,"21285",15,new mw.Vector(0,0,0),new mw.Vector(1,1,1),new mw.Vector(0,0,0),"左手手持法杖"],[2,"23547",15,new mw.Vector(0,0,0),new mw.Vector(1,1,1),new mw.Vector(0,0,0),"左手手持篮球"],[3,"27087",20,new mw.Vector(-1,0,-12),new mw.Vector(1,1,1),new mw.Vector(0,0,0),"皇冠"],[4,"27083",16,new mw.Vector(0,0,-25),new mw.Vector(1,1,1),new mw.Vector(0,0,0),"右手毛笔"],[5,"27083",16,new mw.Vector(0,0,-15),new mw.Vector(0.1,0.1,0.1),new mw.Vector(0,0,0),"右手拿海盗旗"],[6,"27107",16,new mw.Vector(0,0,0),new mw.Vector(1,1,1),new mw.Vector(90,0,0),"右手拿铅笔"],[7,"27108",16,new mw.Vector(0,0,0),new mw.Vector(1,1,1),new mw.Vector(90,0,0),"右手拿圆珠笔"],[8,"54808",1,new mw.Vector(0,-4,4),new mw.Vector(0.8,1,1),new mw.Vector(0,0,0),"女性眼镜"],[9,"54814",1,new mw.Vector(0,-4,4.5),new mw.Vector(0.8,1,1),new mw.Vector(0,0,0),"男性眼镜"],[10,"54824",1,new mw.Vector(0,10,0),new mw.Vector(0.5,0.5,0.5),new mw.Vector(0,0,0),"胡子"],[11,"54836",1,new mw.Vector(0,-4,4),new mw.Vector(0.8,1,1),new mw.Vector(0,0,0),"太阳镜1"],[12,"54838",1,new mw.Vector(0,-4,4),new mw.Vector(0.8,1,1),new mw.Vector(0,0,0),"太阳镜2"],[13,"32606",12,new mw.Vector(3,-2,-20),new mw.Vector(0.8,0.8,0.8),new mw.Vector(-90,0,90),"背部装饰狗1"],[14,"32612",12,new mw.Vector(3,-2,-20),new mw.Vector(0.8,0.8,0.8),new mw.Vector(-90,0,90),"背部装饰狗2"],[15,"32608",0,new mw.Vector(0,0,22),new mw.Vector(1,1,1),new mw.Vector(0,0,0),"头顶鼠鼠"],[16,"68390",1,new mw.Vector(0,0,4),new mw.Vector(0.8,1,0.8),new mw.Vector(0,0,0),"彩色眼镜"],[17,"68410",0,new mw.Vector(0,5,6),new mw.Vector(0.6,0.8,0.8),new mw.Vector(0,0,0),"兔耳朵"],[18,"68449",0,new mw.Vector(0,0,3),new mw.Vector(0.9,1,1),new mw.Vector(0,0,0),"章鱼帽"],[19,"68447",0,new mw.Vector(0,0,3),new mw.Vector(1.1,1.,1.1),new mw.Vector(0,0,0),"鲨鱼帽"],[20,"68462",0,new mw.Vector(0,0,5),new mw.Vector(1,1,1),new mw.Vector(0,0,0),"独角兽帽子"],[21,"92037",0,new mw.Vector(0,0,-5),new mw.Vector(1.2,1.2,1.2),new mw.Vector(0,0,0),"波比头"],[22,"92715",0,new mw.Vector(0,0,22),new mw.Vector(1,1,1),new mw.Vector(0,0,0),"头顶鸭子"],[23,"110948",1,new mw.Vector(0,0,-4),new mw.Vector(0.6,0.6,0.6),new mw.Vector(0,0,0),"南瓜头"],[24,"32618",0,new mw.Vector(0,0,22),new mw.Vector(0.5,0.5,0.5),new mw.Vector(0,0,0),"头顶猫猫1"],[25,"32622",0,new mw.Vector(0,0,22),new mw.Vector(0.5,0.5,0.5),new mw.Vector(0,0,0),"头顶猫猫2"],[26,"32624",0,new mw.Vector(0,0,22),new mw.Vector(0.5,0.5,0.5),new mw.Vector(0,0,0),"头顶猫猫3"],[27,"32626",0,new mw.Vector(0,0,22),new mw.Vector(0.8,0.8,0.8),new mw.Vector(0,0,0),"头顶猫猫4"],[28,"87017",23,new mw.Vector(0,0,2),new mw.Vector(1,1,0.6),new mw.Vector(0,0,0),"滑板"]];
export interface IModelElement extends IElementBase{
 	/**唯一ID*/
	ID:number
	/**模型id*/
	ModelGuid:string
	/**模型挂点*/
	ModelPoint:number
	/**模型偏移*/
	ModelLocation:mw.Vector
	/**模型缩放*/
	ModelLarge:mw.Vector
	/**模型旋转*/
	ModelRotate:mw.Vector
	/**备注*/
	Notice:string
 } 
export class ModelConfig extends ConfigBase<IModelElement>{
	constructor(){
		super(EXCELDATA);
	}

}