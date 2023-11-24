import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","icon","CompareGame","MemoryGame","BasketGame","RaceGame","LanguageGame","ArtGame","CreateGame","FlyGame","FightGame","coinNum","Notice"],["","","","","","","","","","","","",""],[1,["128695","128755"],40,10,7,70,200,25,7,90,100,7,"a+"],[2,["128695"],35,9,6,60,192,20,6,80,90,6,"a"],[3,["128695","128736"],30,8,5,50,152,15,5,70,80,5,"a-"],[4,["128783","128755"],25,7,4,40,112,10,4,60,65,4,"b+"],[5,["128783"],20,6,3,30,72,5,3,50,50,3,"b"],[6,["128783","128736"],15,4,2,20,32,3,2,40,30,2,"b-"],[7,["128784","128755"],1,1,1,1,1,1,1,1,1,1,"c+"],[8,["128784"],0,0,0,0,0,0,0,0,0,0,"c"]];
export interface ICradeElement extends IElementBase{
 	/**唯一ID*/
	ID:number
	/**图片*/
	icon:Array<string>
	/**比较游戏*/
	CompareGame:number
	/**记忆游戏*/
	MemoryGame:number
	/**投篮游戏*/
	BasketGame:number
	/**赛跑*/
	RaceGame:number
	/**语言课游戏*/
	LanguageGame:number
	/**美术小游戏*/
	ArtGame:number
	/**造物课小游戏*/
	CreateGame:number
	/**飞行小游戏*/
	FlyGame:number
	/**战斗课程*/
	FightGame:number
	/**奖励金币数量*/
	coinNum:number
	/**备注*/
	Notice:string
 } 
export class CradeConfig extends ConfigBase<ICradeElement>{
	constructor(){
		super(EXCELDATA);
	}

}