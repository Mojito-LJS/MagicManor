import { GameConfig } from "../../../../config/GameConfig";
import { GameObjectByScenePosition } from "../../../../utils/GameObjectByScenePosition";
import { MapEx } from "../../../../utils/MapEx";
import { BuildingHelper } from "../../BuildingHelper";
import { HomeDesignOperationEnum } from "../../ui/roomDress/HomeDesignOper";
import { Common, OperState } from "./Common";
import { DressUtils } from "./Utils";

export class Touch {
	public static readonly Instance: Touch = new Touch();

	/**
	 * 初始化触摸按键
	 */
	public async initTouch() {
		const self = Common.Instance;
		self.touch = new mw.TouchInput();
		await Player.asyncGetLocalPlayer();
		self.touch.onTouch.add((index, location, type) => {
			//logI("ontouch", index, location, type);
			switch (type) {
				case mw.TouchInputType.TouchBegin:
					this.onTouchBegin(index, location);
					break;
				case mw.TouchInputType.TouchMove:
					this.onTouchMove(index, location);
					break;
				case mw.TouchInputType.TouchEnd:
					this.onTouchEnd(index, location);
					break;

				default:
					break;
			}
		});
	}

	/**
	 * 触摸开始
	 * @param index
	 * @param touchPos
	 */
	private onTouchBegin(index: number, touchPos: Vector2) {
		const self = Common.Instance;
		self.touchState = 1;
		if (!BuildingHelper.inSelfBuilding()) return;

		if (self.state === OperState.ChooseItem) {
			this.editorHomeDress(touchPos);
			return;
		}

		if (self.state === OperState.EditorItem) {
			if (self.installRootGo !== null) {
				const cfg = GameConfig.HomeDress.getElement(self.installCfgId);
				if (DressUtils.tryPushByScreenPos(touchPos, cfg, 1)) {
					logI("tryPushByScreenPos");
				}
			}
			return;
		}
	}

	/**
	 * 触摸移动
	 * @param index
	 * @param touchPos
	 * @returns
	 */
	private onTouchMove(index: number, touchPos: Vector2) {
		const self = Common.Instance;
		self.touchState = 2;
		if (!BuildingHelper.inSelfBuilding()) return;

		if (Vector2.distance(self.lastPos, touchPos) < 5) {
			return;
		}

		self.lastPos = touchPos;

		if (self.state === OperState.EditorItem) {
			if (self.installRootGo !== null) {
				const cfg = GameConfig.HomeDress.getElement(self.installCfgId);
				if (DressUtils.tryPushByScreenPos(touchPos, cfg, 2)) {
					logI("tryPushByScreenPos");
				}
			}
		}
	}

	/**
	 * 触摸结束
	 * @param index
	 * @param touchPos
	 */
	private onTouchEnd(index: number, touchPos: Vector2) {
		const self = Common.Instance;
		self.touchState = 3;
		if (!BuildingHelper.inSelfBuilding()) return;

		if (self.state === OperState.ChooseItem) {
			this.editorHomeDress(touchPos);
			return;
		}

		if (self.state === OperState.EditorItem) {
			if (self.installRootGo !== null) {
				const cfg = GameConfig.HomeDress.getElement(self.installCfgId);
				if (DressUtils.tryPushByScreenPos(touchPos, cfg, 3)) {
					logI("tryPushByScreenPos");
				}
			}
			return;
		}
	}

	private editorHomeDress(touchPos: Vector2) {
		const self = Common.Instance;
		let hitRes = GameObjectByScenePosition.get(touchPos.x, touchPos.y, Common.Dis, true, false);
		hitRes = hitRes.filter((e) => e.gameObject.name === "view");
		hitRes.forEach((e) => {
			logI("e.gameObject---->", e.gameObject.name);
		});
		//logI("================================");
		if (hitRes.length > 0) {
			const go = hitRes[0].gameObject;
			const dressInfo = MapEx.get(self.dressView2Info, go.gameObjectId);
			if (!dressInfo) {
				return;
			}
			const cfg = GameConfig.HomeDress.getElement(dressInfo.cfgId);
			if (!cfg) {
				logW("找不到该配置 : " + dressInfo.cfgId);
				return;
			}

			self.canInstall = false;
			self.installCfgId = dressInfo.cfgId;
			self.installCfg = cfg;
			self.installRootGo = go.parent;
			self.installViewGo = go;
			self.rotateVal = dressInfo.rotateVal;
			self.importPoint = self.installRootGo.worldTransform.position;

			self.installOperUIWidget.worldTransform.position = self.installRootGo.worldTransform.position;
			self.installOperUIWidget.setVisibility(mw.PropertyStatus.On);
			self.installOperUIWidget.interaction = true;
			self.installOperUIWidget.setCollision(mw.CollisionStatus.QueryOnly);
			self.installOperUI.setState(HomeDesignOperationEnum.Operation);
		} else {
			logW("没找到对象");
		}
	}
}
