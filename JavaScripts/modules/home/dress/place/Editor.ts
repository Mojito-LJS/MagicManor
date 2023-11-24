import { ModifiedCameraSystem, CameraModifid, CameraSystemData, } from '../../../../Modified027Editor/ModifiedCamera';
import { MapEx } from "../../../../utils/MapEx";
import { BuildingHelper } from "../../BuildingHelper";
import { HomeDesignMainUI } from "../../ui/roomDress/HomeDesignMainUI";
import { HomeDesignOperationEnum } from "../../ui/roomDress/HomeDesignOper";
import { Common, OperState } from "./Common";
import { DressUtils } from "./Utils";

export class Editor {
	public static readonly Instance: Editor = new Editor();

	// ====================安装家具逻辑============================

	public joinEditorModel() {
		const self = Common.Instance;
		mw.UIService.show(HomeDesignMainUI);
		self.state = OperState.ChooseItem;
	}

	public leftEditorModel() {
		const self = Common.Instance;
		this.cancelInstall();
		self.state = OperState.None;
		mw.UIService.hide(HomeDesignMainUI);
	}

	public joinEditorItemOper() {
		const self = Common.Instance;
		self.state = OperState.EditorItem;
		self.installOperUI.setState(HomeDesignOperationEnum.Install);
		self.operDressTips.setVisibility(mw.PropertyStatus.On);
		self.areaNormalDir = self.installRootGo.worldTransform.getForwardVector();
		BuildingHelper.showDressArea(self.installCfg.installArea.toString());
		DressUtils.setOperTipsInfo(true, self.areaNormalDir);
	}

	/**
	 * 取消安装
	 */
	public cancelInstall() {
		const self = Common.Instance;
		if (self.installViewGo) {
			const info = MapEx.get(self.dressView2Info, self.installViewGo.gameObjectId);
			//取消安装时，不需要销毁物体。
			if (info) {
				if (self.installRootGo) {
					self.installRootGo.worldTransform.position = info.pos;
					self.installRootGo.worldTransform.rotation = info.rot;
					self.installRootGo = null;
				}
			}

			if (!info && self.installRootGo) {
				self.installRootGo.destroy();
				self.installRootGo = null;
			}
		}

		self.state = OperState.ChooseItem;
		if (self.operDressTips) self.operDressTips.setVisibility(mw.PropertyStatus.Off);
		if (self.installOperUIWidget) self.installOperUIWidget.setVisibility(mw.PropertyStatus.Off);

		BuildingHelper.hideDressArea();

		if (self.cameraLock) {
			self.cameraLock = false;
			ModifiedCameraSystem.resetOverrideCameraRotation();
		}
	}
}
