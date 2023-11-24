import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","CanMove","MpUse","SkillCD","MaxCharge","Damage","SkillType","BuffName","RunTime","TrrigerConfig","Param1"],["","","","","","","","","","",""],[101101,true,0,2,1,[2],2,["DamageEffect"],null,"BoxBulletTrriger:movex=0,movey=0,movez=0,x=2.5,y=2.5,z=2.5,type=1,interval=0,effect=43,music=54",null,"1级风系技能1"],[101201,true,0,5,1,[3],1,["DamageEffect"],null,"BoxBulletTrriger:movex=0,movey=0,movez=-100,x=4,y=6,z=6,type=2,interval=0,effect=38,music=57",null,"1级风系技能2"],[101301,true,0,3,1,[1.5],2,null,null,"BoxBulletTrriger:movex=0,movey=0,movez=0,x=2.5,y=2.5,z=2.5,type=1,interval=0,effect=37,music=54","500101","1级风系技能3"],[101401,false,0,12,1,[0.2],1,["DamageEffect"],null,"BoxBulletTrriger:movex=0,movey=0,movez=0,x=2.2,y=15,z=4,type=3,interval=0,effect=37,music=54",null,"1级风系技能4"],[201101,false,0,3,1,null,0,null,[9999],null,null,"1级魔法扫帚"],[201201,true,0,1,1,null,0,null,[9999],null,null,"星之力"],[202101,true,0,10,1,null,0,null,null,null,null,"雪球魔杖"],[203101,true,0,1,1,null,0,null,[9999],null,null,"滑板"],[204101,true,0,5,1,null,0,null,[9999],null,"1","宠物召唤1"],[204102,true,0,5,1,null,0,null,[9999],null,"2","宠物召唤2"],[204103,true,0,5,1,null,0,null,[9999],null,"3","宠物召唤3"],[206101,true,0,0,1,null,0,null,[9999],null,null,"1级滑翔术"],[207101,true,0,0,1,null,0,null,null,null,null],[207201,true,0,0,2,null,0,null,null,null,null],[208101,false,0,0,1,null,0,null,null,null,null,"契约之戒签约"],[208201,false,0,0,1,null,0,null,null,null,null,"契约之戒展示"],[301101,true,0,5,1,null,0,null,null,null,null,"1级造物魔杖"],[302101,true,0,10,1,null,0,null,null,null,"13|12","换装1"],[302102,true,0,10,1,null,0,null,null,null,"19|20","换装2"],[302103,true,0,10,1,null,0,null,null,null,"21|18","换装3"],[302104,true,0,10,1,null,0,null,null,null,"11|10","换装4"],[302105,true,0,10,1,null,0,null,null,null,"7|6","换装5"],[400101,true,0,5,1,null,0,null,null,null,"1","车轮滚滚"],[400102,true,0,2,1,null,0,null,null,null,"2","台阶"],[400103,true,0,5,1,null,0,null,null,null,"3","炸弹"],[400104,true,0,5,1,null,0,null,null,null,"4","爱心特效"],[400105,true,0,5,1,null,0,null,null,null,"5","扮鬼头套"],[400106,true,0,15,1,null,0,null,null,null,"6","烟花"],[500101,true,0,0,0,[1],1,["DamageEffect"],null,"CircularBulletTrriger:movex=0,movey=0,movez=0,r=3,type=2,interval=0,effect=37,music=58",null,"风a3命中后"],[500201,true,0,0,0,[1],1,["DamageEffect"],null,"CircularBulletTrriger:movex=0,movey=0,movez=0,r=0.6,type=2,interval=0,effect=37,music=54",null,"暗a4命中后"],[600101,true,0,0,1,[1],1,["HitShark"],null,"BoxBulletTrriger:movex=0,movey=0,movez=0,x=1,y=1,z=1,type=2,interval=0,effect=40,music=59",null,"鲨鱼技能1"],[600201,true,0,0,1,[1],1,["HitShark"],null,"BoxBulletTrriger:movex=0,movey=0,movez=-25,x=1.4,y=1.4,z=0.5,type=2,interval=0,effect=41,music=61",null,"鲨鱼技能2"],[600301,true,0,0,1,[1],1,["HitShark"],null,"BoxBulletTrriger:movex=0,movey=0,movez=-50,x=1,y=1,z=1,type=2,interval=0,effect=42,music=60",null,"鲨鱼技能3"]];
export interface ISkillLevelElement extends IElementBase{
 	/**技能ID*/
	ID:number
	/**释放技能过程中是否可移动*/
	CanMove:boolean
	/**法力消耗*/
	MpUse:number
	/**技能CD*/
	SkillCD:number
	/**技能充能*/
	MaxCharge:number
	/**技能伤害*/
	Damage:Array<number>
	/**技能类型（1：子弹型，2：直接命中）*/
	SkillType:number
	/**技能对应buff*/
	BuffName:Array<string>
	/**持续性技能持续时间*/
	RunTime:Array<number>
	/**触发参数*/
	TrrigerConfig:string
	/**自定义参数1*/
	Param1:string
 } 
export class SkillLevelConfig extends ConfigBase<ISkillLevelElement>{
	constructor(){
		super(EXCELDATA);
	}

}