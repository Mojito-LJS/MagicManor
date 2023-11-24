import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["buffName","ps","type","duration","period","chanceToApply","periodInhibitionPolicy","dependentsEvents","eventApplyLimit","executeOnApply","stackLimit","stackDurationRefreshPolicy","stackPeriodRefreshPolicy","stackExpirationPolicy","overflowEffects","denyOverflowApply","clearStackOnOverflow","targetEffects","conditionalEffects","prematureExpirationEffects","routineExpirationEffects","effectTag","immunityTags","applyRequireTags","grantTag","ongoingTag","removalTag","removalTagWhenApply","assetId","staticAssetCls","className","grantAbilitiesInfo","modifierName","modifierOp","modifierValue"],["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],["DamageEffect",null,0,0,0,1,0,null,0,null,0,0,0,0,null,null,null,null,null,null,null,null,["state.invincible"],null,null,null,null,null,0,null,null,null,null,null,null],["TestDot",null,1,3000,500,1,1,null,0,true,1,0,0,0,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0,null,null,null,null,null,null],["TestStackDot",null,1,4000,500,1,1,null,0,true,8,1,1,1,null,true,null,null,null,null,null,null,null,null,null,null,null,null,0,null,null,null,null,null,null],["Invincible",null,1,3000,0,1,0,null,0,null,0,0,0,0,null,null,null,null,null,null,null,null,null,null,["state.invincible"],null,null,null,401,null,null,null,null,null,null],["RecoveryBlood","脱战回血buff",2,1000,1000,1,1,null,0,null,1,0,0,2,null,null,null,null,null,null,null,null,null,null,null,null,["Gameplay.state.fighting"],null,0,null,null,null,null,null,null],["SlowDown","减速",1,3000,0,1,0,null,0,null,0,0,0,0,null,null,null,null,null,null,null,null,null,null,["state.debuff.slowdown"],["Identifier.Monster.NightNormal"],null,null,0,null,null,null,["speed"],[1],[-0.3]]];
export interface IFightBuffElement extends IElementBase{
 	/**undefined*/
	buffName:string
	/**注释说明*/
	ps:string
	/**buff类型
0 = Instant 立即生效然后销毁
1 = duration 在一定时间内存在
2 = infinite 永远存在*/
	type:number
	/**只有当前一列为2 时，该属性才
生效，单位为毫秒*/
	duration:number
	/**执行周期
每隔多少时间执行一次*/
	period:number
	/**buff被成功添加的概率 不填是0
取值范围0-1*/
	chanceToApply:number
	/**0 = NeverReset 不重置
1 = ResetPeriod 重置周期
2 = ExecuteAndPeriod 执行一次
重置周期*/
	periodInhibitionPolicy:number
	/**监听的游戏事件
当宿主收到这些事件后会执行该buff*/
	dependentsEvents:Array<string>
	/**触发该事件多少次后移除buff
为-1则是一直触发*/
	eventApplyLimit:number
	/**添加时是否立即执行*/
	executeOnApply:boolean
	/**最大叠加层数*/
	stackLimit:number
	/**被叠加时的持续时间刷新规则
0 = 刷新
1 = 不刷新*/
	stackDurationRefreshPolicy:number
	/**被叠加时的周期刷新规则
0 = 刷新
1 = 不刷新*/
	stackPeriodRefreshPolicy:number
	/**叠加过期时的清理规则
0 = 清理整个堆栈
1 = 只清理一层
2 = 刷新持续时间，不清空*/
	stackExpirationPolicy:number
	/**当叠加叠满时，新添加的buff名字*/
	overflowEffects:Array<string>
	/**溢出时，是否阻止叠加栈的刷新*/
	denyOverflowApply:boolean
	/**溢出时，是否清空buff叠加栈*/
	clearStackOnOverflow:boolean
	/**当buff被成功添加后再添加的buff名*/
	targetEffects:Array<string>
	/**当buff成功执行后再添加的buff*/
	conditionalEffects:Array<string>
	/**当buff被打断时添加的buff名*/
	prematureExpirationEffects:Array<string>
	/**当buff正常结束时添加的buff名*/
	routineExpirationEffects:Array<string>
	/**buff的身份tag标签*/
	effectTag:Array<string>
	/**免疫tag，当目标拥有这些tag时，这个buff不会被添加*/
	immunityTags:Array<string>
	/**buff被添加时，宿主必须拥有下列所有tag
否则不会添加给宿主*/
	applyRequireTags:Array<string>
	/**当buff生效时，会把下列tag传递给宿主*/
	grantTag:Array<string>
	/**当目标拥有这些tag时，buff才
会被执行，没有条件就是空*/
	ongoingTag:Array<string>
	/**当目标拥有这些tag时，
Buff会被移除*/
	removalTag:Array<string>
	/**当buff被成功添加后，会从宿主身上移除下列tag*/
	removalTagWhenApply:Array<string>
	/**生效时挂载到宿主上的效果id*/
	assetId:number
	/**静态资源脚本名*/
	staticAssetCls:string
	/**用来实例化buff的类名
一般不填*/
	className:string
	/**当buff生效时，授予宿主的技能
[{

    abilityName: ‘技能名字1’;

    removalPolicy: 1
}]
removalPolicy的取值
0 = 当buff结束时，立即移除这个技能
1 = 当buff结束时，如果技能正在释放，则等待技能释放完毕后移除技能，否则立即移除
3 = 不移除*/
	grantAbilitiesInfo:string
	/**要修改的属性名字几何
如果要修改多个属性就是个多长的数组*/
	modifierName:Array<string>
	/**修改方式，和前面的数组一一对应

0 = 加
1 = 乘
2 = 除
3 = 覆盖*/
	modifierOp:Array<number>
	/**修改的值，和前面的数组长度一一对应*/
	modifierValue:Array<number>
 } 
export class FightBuffConfig extends ConfigBase<IFightBuffElement>{
	constructor(){
		super(EXCELDATA);
	}

}