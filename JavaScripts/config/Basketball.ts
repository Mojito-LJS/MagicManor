import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Gametime","Effect","Guid","Pose","Action","BasketGuid","Speed","Distance","Gravity","BounceTimes","CamerTime","SoundEffect","BasketScore"],["","","","","","","","","","","","","",""],[1,150,"73404",["55BB3450","E9666737"],["35436"],"35436","84133",700,50,0.3,3,1,"120849",1]];
export interface IBasketballElement extends IElementBase{
 	/**唯一ID*/
	ID:number
	/**游戏时间*/
	Gametime:number
	/**进球特效*/
	Effect:string
	/**篮板触发器的guid*/
	Guid:Array<string>
	/**动作姿态*/
	Pose:Array<string>
	/**动作guid*/
	Action:string
	/**篮球模型guid动态生成*/
	BasketGuid:string
	/**投掷的初始速度*/
	Speed:number
	/**投掷物的飞行距离*/
	Distance:number
	/**投掷物重力缩放值*/
	Gravity:number
	/**投掷物弹跳次数*/
	BounceTimes:number
	/**延迟恢复相机时间*/
	CamerTime:number
	/**篮球进球音效*/
	SoundEffect:string
	/**篮球进行分数*/
	BasketScore:number
 } 
export class BasketballConfig extends ConfigBase<IBasketballElement>{
	constructor(){
		super(EXCELDATA);
	}

}