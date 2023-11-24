import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","maxHp","maxMp","atk","speed","criticalDamageRatio","criticalRatio","damageRatio","decreaseDamageRatio","defense","recoverHpRatio","recoverMpRatio"],["","","","","","","","","","","",""],[1,200,110,10,450,1.5,0,0,0,0,0.1,0.1],[2,50,-1,10,300,1.5,0,0,0,0,0.1,-1],[3,30,-1,10,300,1.5,0,0,0,0,5,-1],[4,600,-1,10,420,1.5,0,0,0,0,0.1,-1],[5,200,-1,10,420,1.5,0,0,0,0,0.1,-1]];
export interface IFightAttrElement extends IElementBase{
 	/**undefined*/
	id:number
	/**血量*/
	maxHp:number
	/**蓝量*/
	maxMp:number
	/**基础攻击力*/
	atk:number
	/**速度*/
	speed:number
	/**暴击伤害倍率*/
	criticalDamageRatio:number
	/**暴击概率*/
	criticalRatio:number
	/**伤害加成系数*/
	damageRatio:number
	/**伤害减免系数*/
	decreaseDamageRatio:number
	/**防御力*/
	defense:number
	/**额外生命恢复系数*/
	recoverHpRatio:number
	/**额外蓝量恢复系数*/
	recoverMpRatio:number
 } 
export class FightAttrConfig extends ConfigBase<IFightAttrElement>{
	constructor(){
		super(EXCELDATA);
	}

}