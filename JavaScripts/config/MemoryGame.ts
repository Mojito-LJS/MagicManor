import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Increase","Grade","GameTime","FrontNum","Number","Btn","BtnTime","LightTime","RightTime","LightInterval","Scale","Transparent"],["","","","","","","","","","","","",""],[1,["5","10"],8,["10","15"],[3,5,8],10,[1,2,3,4,5],0.2,0.2,0.4,0.5,0.7,0.7,null,null,"音乐用"],[2,["5","10"],8,["10","15"],[3,5,8],10,[6,7,8,9,10],0.2,0.2,0.4,0.5,0.7,0.7,null,null,"舞蹈用"]];
export interface IMemoryGameElement extends IElementBase{
 	/**唯一ID*/
	ID:number
	/**难度梯度*/
	Increase:Array<string>
	/**答对一道题的分数*/
	Grade:number
	/**一道题的时间*/
	GameTime:Array<string>
	/**题目数量*/
	FrontNum:Array<number>
	/**总题目的数量*/
	Number:number
	/**按钮*/
	Btn:Array<number>
	/**按钮展示时间*/
	BtnTime:number
	/**按钮高亮时间*/
	LightTime:number
	/**正确按钮的高亮时间*/
	RightTime:number
	/**按钮闪烁之间间隙*/
	LightInterval:number
	/**按钮点击的缩放大小*/
	Scale:number
	/**透明度*/
	Transparent:number
 } 
export class MemoryGameConfig extends ConfigBase<IMemoryGameElement>{
	constructor(){
		super(EXCELDATA);
	}

}