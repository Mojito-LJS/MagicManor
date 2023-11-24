import { SpawnManager, SpawnInfo, } from '../../../Modified027Editor/ModifiedSpawn';
import { GameConfig } from "../../../config/GameConfig";
import { MapEx } from "../../../utils/MapEx";
import BuildingModuleC from "../../building/BuildingModuleC";
import { MGSMsgHome } from "../../mgsMsg/MgsmsgHome";
import { BuildingHelper } from "../BuildingHelper";
import { UIHomeDesignOper } from "../ui/roomDress/HomeDesignOper";
import { DressInfoDB, HomeDressData } from "./HomeDressData";
import { HomeDressModuleS } from "./HomeDressModuleS";
import { InteractMgr } from "./interact/InteractMgr";
import { Common, OperState } from "./place/Common";
import { DressInfo } from "./place/DressInfo";
import { Martial } from "./place/Martial";
import { Touch } from "./place/Touch";
import { DressUtils } from "./place/Utils";

export class HomeDressModuleC extends ModuleC<HomeDressModuleS, HomeDressData> {
	// ====================安装家具逻辑============================

	/**
	 * 玩家进入场景
	 * @param sceneType
	 */
	protected async onEnterScene(sceneType: number): Promise<void> {
		const self = Common.Instance;
		const installOperUIWidget = (self.installOperUIWidget = (await SpawnManager.asyncSpawn({
			guid: "UIWidget",
			replicates: false
		})) as mw.UIWidget);
		installOperUIWidget.widgetSpace = mw.WidgetSpaceMode.Screen;
		self.installOperUI = mw.UIService.getUI(UIHomeDesignOper);
		installOperUIWidget.setTargetUIWidget(self.installOperUI.uiWidgetBase);
		installOperUIWidget.interaction = true;
		installOperUIWidget.setVisibility(mw.PropertyStatus.Off);

		//初始化touch
		Touch.Instance.initTouch();

		// 初始化安装家具的提示对象
		if (self.operDressTips == null) {
			self.operDressTips = await SpawnManager.asyncSpawn({ guid: "88464DF443337B22995555891AA9FAB1", replicates: false });
			await self.operDressTips.asyncReady();
			self.operDressTips.setVisibility(mw.PropertyStatus.Off);
		}

		ModuleService.getModule(BuildingModuleC).createBuildings(this.localPlayerId);
	}

	public sureMartials() {
		const self = Common.Instance;
		const buildingID = BuildingHelper.getCurBuilding().buildingID;
		const index = self.curOperMartialIndex;
		const cfg = self.curCfg;
		const area = cfg.installArea;
		this.server.net_SetMartialByArea(buildingID, area, index, cfg.id, BuildingHelper.getCurBuilding().owner);
	}

	public cancelMartials() {
		const self = Common.Instance;
		const martialDB = this.data.getAreaMartial(BuildingHelper.getCurBuilding().buildingID, self.curCfg.installArea, self.curOperMartialIndex);
		Martial.Instance.changeMartials(martialDB, self.curOperMartialIndex);
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	public net_UpdateMartial(dressCfgId: number, index: number) {
		const self = Common.Instance;
		Martial.Instance.changeMartials(dressCfgId, index);
		if (BuildingHelper.getCurBuilding().owner === Player.localPlayer.playerId) {
			this.data.setAreaMartial(BuildingHelper.getCurBuilding().buildingID, self.curCfg.installArea, self.curOperMartialIndex, dressCfgId);
		}
	}

	/**
	 * 旋转装饰家具
	 * @returns
	 */
	public rotateDress() {
		const self = Common.Instance;
		const cfg = GameConfig.HomeDress.getElement(self.installCfgId);
		let quaternion = self.installRootGo.worldTransform.rotation.toQuaternion();
		self.rotateVal += 90;
		quaternion = Quaternion.rotateAround(quaternion, self.installRootGo.worldTransform.getForwardVector(), (90 * Math.PI) / 180);
		self.installRootGo.worldTransform.rotation = quaternion.toRotation();

		if (!DressUtils.canPushLogic(self.areaNormalDir, self.importPoint)) {
			DressUtils.setOperTipsInfo(false, self.areaNormalDir);
			return false;
		}

		DressUtils.setOperTipsInfo(true, self.areaNormalDir);
	}

	public deleteDress() {
		const self = Common.Instance;
		const buildingID = BuildingHelper.getCurBuilding().buildingID;
		const info = MapEx.get(self.dressView2Info, self.installViewGo.gameObjectId);
		const dressId = 0;
		//取消安装时，不需要销毁物体。
		if (info) {
			this.server.net_SellDress(buildingID, info.id, Player.localPlayer.playerId);
			/**加钱 */
			const cfg = GameConfig.HomeDress.getElement(info.cfgId);
			Event.dispatchToLocal("SellHomeDress", cfg.price);
			/**埋点 */
			MGSMsgHome.sellHomeDress(info.cfgId)
		}
		self.state = OperState.ChooseItem;
		self.operDressTips.setVisibility(mw.PropertyStatus.Off);
		self.installOperUIWidget.setVisibility(mw.PropertyStatus.Off);
	}

	/**
	 * 确认安装
	 */
	public sureInstall() {
		const self = Common.Instance;
		if (!self.canInstall) {
			logW("当前位置不可安装");
			return;
		}

		// 检查是否更新
		const info = MapEx.get(self.dressView2Info, self.installViewGo.gameObjectId);
		let dressId = 0;
		if (info) {
			dressId = info.id;
		}

		const res = this.server.net_InstallOrUpdateDress(
			BuildingHelper.getCurBuilding().buildingID,
			self.installCfgId,
			BuildingHelper.getCurBuilding().owner,
			self.installRootGo.worldTransform.position,
			self.installRootGo.worldTransform.rotation,
			self.rotateVal,
			dressId
		);

		if (res) {
			MapEx.del(self.dressView2Info, self.installViewGo.gameObjectId);
			/**扣钱 */
			const cfg = GameConfig.HomeDress.getElement(self.installCfgId);
			Event.dispatchToLocal("BuyHomeDress", cfg.price);
			/**埋点 */
			MGSMsgHome.buyHomeDress(self.installCfgId)
			logI("安装成功");
		} else {
			logW("安装失败");
		}

		self.state = OperState.ChooseItem;
		self.operDressTips.setVisibility(mw.PropertyStatus.Off);
		BuildingHelper.hideDressArea();
		if (dressId == 0 && self.installRootGo != null) {
			self.installRootGo.destroy();
		}
		self.installRootGo = null;
		self.installOperUIWidget.setVisibility(mw.PropertyStatus.Off);
	}

	//===================================================================================================
	//======================================  家具管理  =================================================
	//===================================================================================================

	/**
	 * 客户端初始化房间装饰
	 */
	public async initDress(ownerId: number, buildings: number[]) {
		for (const id of buildings) {
			const infoStr = await this.server.net_RequestDressList(ownerId, id);
			logI("initDress--客户端初始化房间装饰", infoStr);
			const arr: Array<DressInfoDB> = JSON.parse(infoStr);
			//这里可以分帧处理
			for (let i = 0; i < arr.length; i++) {
				const e = arr[i];
				await this.net_UpdateDress(
					e.id,
					e.cfgId,
					new Vector(e.pos[0], e.pos[1], e.pos[2]),
					new Rotation(e.rotate[0], e.rotate[1], e.rotate[2]),
					e.rotateVal,
					e.colorId,
					e.sign
				);
			}

			//初始化材质
			const martialStr = await this.server.net_RequestMartialList(ownerId, id);
			logI("初始化材质--->", martialStr);
			const martialMap: MapEx.MapExClass<number> = JSON.parse(martialStr);
			this.data.setAllAreaMartials(id, martialMap);

			const keys = Object.keys(martialMap);
			for (let i = 0; i < keys.length; ++i) {
				const str = keys[i].toString().split("_");
				logI("str : " + str + " == > " + str[1]);
				await this.net_UpdateMartial(MapEx.get(martialMap, keys[i]), parseInt(str[1]));
			}

			//初始化交互物
			const re = await this.server.net_requestInteractListState(InteractMgr.Instance.interactSign);
			const interactState = JSON.parse(re) as [string, boolean][];
			for (const iterator of interactState) {
				const [sign, isActive] = iterator;
				const [s, index] = sign.split("|");
				InteractMgr.Instance.isInteract(parseInt(index), s, isActive);
			}
		}
	}

	startInteract(index: number, sign: string, isActive: boolean) {
		this.server.net_interact(index, sign, isActive);
	}

	public reqUpdateDressColor(colorId: number) {
		const self = Common.Instance;
		const buildingID = BuildingHelper.getCurBuilding().buildingID;
		const dressInfo = MapEx.get(self.dressView2Info, self.installViewGo.gameObjectId);
		if (dressInfo) {
			this.server.net_ChangeDressColor(buildingID, dressInfo.id, colorId, Player.localPlayer.playerId);
			/**埋点 */
			MGSMsgHome.changeHomeDressColor(self.installCfgId)
		}
	}

	/**
	 * 服务器通知更新装饰颜色
	 * @param dressId
	 * @param colorId
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public net_UpdateDressColor(dressId: number, colorId: number) {
		const self = Common.Instance;
		const dressInfo = MapEx.get(self.dressGoMap, dressId);
		if (dressInfo) {
			dressInfo.updateColor(colorId);
		}
	}

	/**
	 * 清理装饰
	 */
	public clearDress() {
		const self = Common.Instance;
		MapEx.forEach(self.dressGoMap, (key, value) => {
			value.destroy();
		});
		InteractMgr.Instance.clear();
		self.dressGoMap = {};
		self.dressView2Info = {};
		self.operDressTips.setVisibility(mw.PropertyStatus.Off);
		self.installOperUIWidget.setVisibility(mw.PropertyStatus.Off);
		self.state = OperState.None;
	}

	/**
	 * 服务器通知_更新装饰
	 * @param id
	 * @param cfgId
	 * @param pos
	 * @param rot
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public async net_UpdateDress(id: number, cfgId: number, pos: Vector, rot: Rotation, rotateVal: number, colorId: number, sign: string) {
		const self = Common.Instance;
		let dressInfo: DressInfo;
		if (MapEx.has(self.dressGoMap, id)) {
			logI("更新道具 : " + id + " 开始 配置 " + cfgId);
			dressInfo = MapEx.get(self.dressGoMap, id);
			dressInfo.cfgId = cfgId;
			dressInfo.pos = pos;
			dressInfo.rot = rot;
			if (!dressInfo.go) {
				dressInfo.go.worldTransform.position = pos;
				dressInfo.go.worldTransform.rotation = rot;
			}
			dressInfo.rotateVal = rotateVal;
			logI("更新道具 : " + id);
		} else {
			dressInfo = new DressInfo(id, cfgId, pos, rot, rotateVal, colorId);
			MapEx.set(self.dressGoMap, id, dressInfo);
			logI("创建道具 : " + id);
		}
		if (dressInfo) {
			await dressInfo.initGo(sign);
			if (dressInfo.viewGo) MapEx.set(self.dressView2Info, dressInfo.viewGo.gameObjectId, dressInfo);
		}
	}

	/**
	 * 服务器通知_移除装饰
	 * @param id
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public net_DeleteDress(id: number) {
		const self = Common.Instance;
		if (MapEx.has(self.dressGoMap, id)) {
			const dressInfo = MapEx.get(self.dressGoMap, id);
			MapEx.del(self.dressGoMap, id);
			if (dressInfo.viewGo) MapEx.del(self.dressView2Info, dressInfo.viewGo.gameObjectId);
			dressInfo.go.destroy();
		}
	}

	net_interact(index: number, sign: string, isActive: boolean) {
		InteractMgr.Instance.isInteract(index, sign, isActive);
	}
}
