import { IHomeDressElement } from "../../../../config/HomeDress";
import { MapEx } from "../../../../utils/MapEx";
import { UIHomeDesignOper } from "../../ui/roomDress/HomeDesignOper";
import { DressInfo } from "./DressInfo";

export enum OperState {
	None = 0,
	ChooseItem = 1,
	ChooseItemComplete = 2,
	EditorItem = 3
}
export class Common {
	public static readonly Instance: Common = new Common();

	/**检测距离 */
	public static readonly Dis: number = 1000;

	//触摸输入
	public touch: TouchInput;

	//当前操作状态
	public state: OperState = OperState.None;

	//安装的家具的配置Id
	public installCfgId: number = 0;

	//安装的家具的配置
	public installCfg: IHomeDressElement = null;

	//安装的家具的根节点
	public installRootGo: mw.GameObject = null;

	//安装的家具的真实视图对象
	public installViewGo: mw.GameObject = null;

	//当前安装网格的法线方向
	public areaNormalDir: Vector = null;

	//当前安装网格的安装点
	public importPoint: Vector = null;

	//旋转家具的值
	public rotateVal: number = 0;

	//当前安装的家具的提示对象(用于提示是否能安装)
	public operDressTips: mw.GameObject = null;

	//避免重复触摸
	public lastPos: Vector2 = Vector2.zero;

	//是否可安装
	public canInstall: boolean = false;

	public installOperUIWidget: mw.UIWidget;

	public installOperUI: UIHomeDesignOper;

	// ====================更换材质逻辑============================

	//准备设置材质的索引
	public curSetFloorMartialIndex: number = 0;

	public curSetMetopeMartialIndex: number = 0;

	public curSetCeilingMartialIndex: number = 0;

	public lastMartial: MaterialInstance = null;

	//当前正在设置的材质索引
	public curOperMartialIndex: number = 0;

	public curCfg: IHomeDressElement = null;

	touchState: number = 0;

	cameraLock: boolean = false;

	isChoose: boolean = false;

	//装饰物存储
	dressGoMap: MapEx.MapExClass<DressInfo> = {};

	//装饰物goGuid获取信息
	dressView2Info: MapEx.MapExClass<DressInfo> = {};
}
