import { SpawnManager, SpawnInfo, } from '../../../../Modified027Editor/ModifiedSpawn';
import { GameConfig } from "../../../../config/GameConfig";
import { MapEx } from "../../../../utils/MapEx";
import { BuildingHelper } from "../../BuildingHelper";
import { HomeDesignOperationEnum } from "../../ui/roomDress/HomeDesignOper";
import { Common, OperState } from "./Common";
import { Martial } from "./Martial";
import { DressUtils } from "./Utils";

export class Place {
	public static readonly Instance: Place = new Place();

	/**
	 * 初始化要安装的家具
	 * @param homeDressCfgId
	 */
	public async initInstallGoByCfgId(homeDressCfgId: number) {
		const cfg = GameConfig.HomeDress.getElement(homeDressCfgId);
		if (!cfg) {
			logW("找不到该配置 : " + homeDressCfgId);
			return;
		}

		if (cfg.isMartial) {
			Martial.Instance.changeMartials(homeDressCfgId);

			return;
		}
		const self = Common.Instance;

		//初始化一些操作值
		self.rotateVal = 0;
		self.operDressTips.setVisibility(mw.PropertyStatus.Off);
		self.areaNormalDir = null;
		self.installCfgId = homeDressCfgId;

		//初始化操作状态
		self.state = OperState.EditorItem;

		//显示安装区域网格
		BuildingHelper.showDressArea(cfg.installArea.toString());

		//初始化安装家具对象
		if (self.installViewGo) {
			const info = MapEx.get(self.dressView2Info, self.installViewGo.gameObjectId);
			if (info === null && self.installRootGo !== null) {
				self.installRootGo.destroy();
				self.installRootGo = null;
				self.installViewGo = null;
			}
		}
		self.installRootGo = await SpawnManager.asyncSpawn({ guid: cfg.guid, replicates: false });
		await self.installRootGo.asyncReady();

		self.installViewGo = self.installRootGo.getChildByName("view");
		if (!self.installViewGo) {
			logW("找不到prefab view : " + homeDressCfgId);
			return;
		}

		//开始安装
		this.findPosPushDressGo();

		self.installOperUIWidget.worldTransform.position = self.installRootGo.worldTransform.position;
		self.installOperUIWidget.setVisibility(mw.PropertyStatus.On);
		self.installOperUIWidget.interaction = true;
		self.installOperUI.setState(HomeDesignOperationEnum.Install);
	}

	/**
	 * 找一个在视野内位置放置家具
	 */
	private findPosPushDressGo() {
		const self = Common.Instance;
		self.installCfg = GameConfig.HomeDress.getElement(self.installCfgId);

		const size = mw.getViewportSize();
		const center = new Vector2(size.x / 2, size.y / 2);

		const tempPos = center.clone();
		const logicCount = size.y / 2 / rate;
		let find = false;

		for (let i = 0; i < logicCount; i++) {
			//向上判断
			tempPos.y = center.y - i * rate;
			if (DressUtils.tryPushByScreenPos(tempPos, self.installCfg, 0)) {
				find = true;
				break;
			}
			//向上判断
			tempPos.y = center.y - i * rate;
			tempPos.x = center.x + i * rate;
			if (DressUtils.tryPushByScreenPos(tempPos, self.installCfg, 0)) {
				find = true;
				break;
			}
			//向上判断
			tempPos.y = center.y - i * rate;
			tempPos.x = center.x - i * rate;
			if (DressUtils.tryPushByScreenPos(tempPos, self.installCfg, 0)) {
				find = true;
				break;
			}

			//向下判断
			tempPos.y = center.y + i * rate;
			if (DressUtils.tryPushByScreenPos(tempPos, self.installCfg, 0)) {
				find = true;
				break;
			}

			//向下判断
			tempPos.y = center.y + i * rate;
			tempPos.x = center.x + i * rate;
			if (DressUtils.tryPushByScreenPos(tempPos, self.installCfg, 0)) {
				find = true;
				break;
			}

			//向下判断
			tempPos.y = center.y + i * rate;
			tempPos.x = center.x - i * rate;
			if (DressUtils.tryPushByScreenPos(tempPos, self.installCfg, 0)) {
				find = true;
				break;
			}
		}

		self.operDressTips.setVisibility(mw.PropertyStatus.On);
	}
}
const rate = 25;
