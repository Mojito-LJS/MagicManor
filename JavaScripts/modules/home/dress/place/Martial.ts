/** 
 * @Author       : 陆江帅
 * @Date         : 2023-06-12 14:30:18
 * @LastEditors  : 陆江帅
 * @LastEditTime : 2023-06-12 15:58:19
 * @FilePath     : \magicmanor\JavaScripts\modules\home\dress\place\Martial.ts
 * @Description  : 
 */
import { GameConfig } from "../../../../config/GameConfig";
import { BuildingHelper } from "../../BuildingHelper";
import { Common } from "./Common";

export class Martial {
	public static readonly Instance: Martial = new Martial();

	public setMartialIndex(floorIndex: number, metopeIndex: number, ceilingIndex: number) {
		const self = Common.Instance;
		self.curSetFloorMartialIndex = floorIndex;
		self.curSetMetopeMartialIndex = metopeIndex;
		self.curSetCeilingMartialIndex = ceilingIndex;
		logI("martial Index : " + floorIndex + " | " + metopeIndex + " | " + ceilingIndex);
	}

	/**
	 * 更换材质
	 * @param dressCfgId
	 * @returns
	 */
	public changeMartials(dressCfgId: number, index: number = -1) {
		const self = Common.Instance;
		self.curCfg = GameConfig.HomeDress.getElement(dressCfgId);
		if (!self.curCfg) {
			logW("找不到配置 : " + dressCfgId);
			return;
		}

		self.curOperMartialIndex = index;

		if (index == -1) {
			if (self.curCfg.installArea === "floor") {
				self.curOperMartialIndex = self.curSetFloorMartialIndex;
			} else if (self.curCfg.installArea === "metope") {
				self.curOperMartialIndex = self.curSetMetopeMartialIndex;
			} else if (self.curCfg.installArea === "ceiling") {
				self.curOperMartialIndex = self.curSetCeilingMartialIndex;
			}
		}

		const go = BuildingHelper.getCurBuilding().buildingGo.getChildByName(self.curCfg.installArea);
		go.getChildren().forEach(async (e) => {
			const mesh = e as mw.Model;

			self.lastMartial = mesh.getMaterialInstance()[self.curOperMartialIndex];

			if (!AssetUtil.assetLoaded(self.curCfg.martialId)) {
				await AssetUtil.asyncDownloadAsset(self.curCfg.martialId);
			}

			logI("设置材质 : " + self.curCfg.martialId + " | " + self.curOperMartialIndex);
			mesh.setMaterial(self.curCfg.martialId, self.curOperMartialIndex);
		});
	}

	public cancelMartials(martialDb) {
		// const self = Common.Instance;
		// if (martialDb == 0) {
		// 	const go = VirtualRoomHelper.getCurVirtualRoom().roomGo.getChildByName(self.curCfg.installArea);

		// 	const homeCfg = GameConfig.HomeConfig.getElement(VirtualRoomHelper.getCurVirtualRoom().cfgId);
		// 	let martialId = "";
		// 	if (self.curCfg.installArea === "floor") {
		// 		martialId = homeCfg.floorMartials[self.curOperMartialIndex];
		// 	} else if (self.curCfg.installArea === "metope") {
		// 		martialId = homeCfg.metopeMartials[self.curOperMartialIndex];
		// 	} else if (self.curCfg.installArea === "ceiling") {
		// 		martialId = homeCfg.ceilingMaritals[self.curOperMartialIndex];
		// 	}

		// 	if (martialId != "") {
		// 		go.getChildren().forEach((e) => {
		// 			const mesh = e as mw.Model;
		// 			mesh.setMaterial(martialId, self.curOperMartialIndex);
		// 		});
		// 	}

		// 	return;
		// } else {
		// 	const originMartialCfg = GameConfig.HomeDress.getElement(martialDb);

		// 	const go = VirtualRoomHelper.getCurVirtualRoom().roomGo.getChildByName(self.curCfg.installArea);
		// 	go.getChildren().forEach((e) => {
		// 		const mesh = e as mw.Model;
		// 		mesh.setMaterial(originMartialCfg.martialId, self.curOperMartialIndex);
		// 	});
		// }
	}
}
