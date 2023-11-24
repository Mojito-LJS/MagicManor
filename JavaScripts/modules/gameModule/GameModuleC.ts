import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';
import { ModifiedCameraSystem, CameraModifid, CameraSystemData, } from '../../Modified027Editor/ModifiedCamera';
import { AddGMCommand } from "module_gm";
import { GameConfig } from "../../config/GameConfig";
import { EventsName } from "../../const/GameEnum";
import { GlobalData } from "../../const/GlobalData";
import { GlobalModule } from "../../const/GlobalModule";
import { UIHide, UIManager } from "../../ExtensionType";
import { ResManager } from "../../ResManager";
import { CameraType } from "../../ui/cameraUI/CameraMainUI";
import Tips from "../../ui/commonUI/Tips";
import { SettingUI } from "../../ui/SettingUI";
import GameUtils from "../../utils/GameUtils";
import { ActionModuleClient } from "../action/ActionModuleClient";
import { BagModuleC } from "../bag/BagModuleC";
import { CameraModuleC } from "../camera/CameraModule";
import GMBasePanelUI from "../gm/GMBasePanelUI";
import { P_NPCPanel } from "../npc/NPCPanel";
import { PropModuleC } from "../prop/PropModuleC";
import SkillUI from "../skill/ui/SkillUI";
import { GameModuleData } from "./GameData";
import { IGameModuleS } from "./GameModuleS";
import P_GameHUD, { UIType } from "./P_GameHUD";
import TaskModuleC from "../task/TaskModuleC";
import BuildingModuleC from "../building/BuildingModuleC";
import { Editor } from "../home/dress/place/Editor";
import FindGame from "../find/FindGame";


export interface IGameModuleC { }
//客户端
export class GameModuleC extends ModuleC<IGameModuleS, GameModuleData> implements IGameModuleC {
	public hudPanel: P_GameHUD;
	public isInteractive: boolean;
	public curBgmID: number = 13;

	private btnExitInteractiveCallback: () => void;
	private moveExitInteractiveCallback: () => void;
	private jumpExitInteractiveCallback: () => void;

	onStart() {
		this.hudPanel = mw.UIService.create(P_GameHUD);
		this.hudPanel.clickResetClothBtnAC.add(playerID => {
			GlobalModule.MyPlayerC.Cloth.resetPlayerCloth(playerID);
		});
		this.hudPanel.onJump.add(() => {
			ModuleService.getModule(ActionModuleClient).cleanStance();
			if (!this.localPlayer.character.isJumping) {
				Event.dispatchToLocal(EventsName.PLAYER_JUMP);
			}
			this.localPlayer.character.jump();
		}, this);
		//身份牌
		this.hudPanel.mIdCard_btn.onClicked.add(() => {
			UIManager.show(SettingUI);
		});

		/**点击进入编辑页面 */
		this.hudPanel.mBtnEditor.onClicked.add(() => {
			Editor.Instance.joinEditorModel();
		});

		/**点击退出交互物按钮 */
		this.hudPanel.onExitInteractive.add(() => {
			if (this.btnExitInteractiveCallback != null) {
				this.btnExitInteractiveCallback();
				this.btnExitInteractiveCallback = null;
			}
		}, this);

		/**摇杆移动事件 */
		this.hudPanel.onJoyStickInput.add((v: mw.Vector2) => {
			if (this.moveExitInteractiveCallback != null) {
				this.moveExitInteractiveCallback();
				this.moveExitInteractiveCallback = null;
			}
		});
		this.hudPanel.onJump.add(() => {
			if (this.jumpExitInteractiveCallback != null) {
				this.jumpExitInteractiveCallback();
				this.jumpExitInteractiveCallback = null;
			}
		});

		Event.addLocalListener("PlayButtonClick", () => {
			SoundService.stopSound("136199");
			SoundService.playSound("136199");
		});
	}

	//进入场景
	onEnterScene(sceneType: number): void {
		let selfName: string = Player.localPlayer.character.displayName;
		UIManager.showUI(this.hudPanel, mw.UILayerBottom, selfName);

		this.hudPanel.clickEnterCameraAC.add(this.showCameraPanel.bind(this));
		if (GlobalData.isOpenGM) {
			this.addGM();
			new GMBasePanelUI().show();
		}

		this.hudPanel.mPulloff_btn.onClicked.add(() => {
			this.resetPos();
		});

		//3Dui多语言
		this.uiLanguage();

		let npc = mw.UIService.create(P_NPCPanel);
		mw.UIService.showUI(npc);

		this.loginChoose();

		GlobalModule.MyPlayerC.Cloth.downloadData()
	}
	private uiLanguage() {
		let allUI = GameConfig.Global.getElement(59).Value4; //所有3dui
		allUI.forEach(async item => {
			let top = (await ResManager.instance.findGameObjectByGuid(item)) as mw.UIWidget;
			if (!top) {
				console.log("guan log uiLanguage top:" + top + ",item:" + item);
				return;
			}
			let uiRoot = top.getTargetUIWidget().rootContent;
			for (let i = 0; i < uiRoot.getChildrenCount(); i++) {
				let item = uiRoot.getChildAt(i);
				if (!(item instanceof mw.TextBlock)) {
					continue;
				}
				let ui = item as mw.TextBlock;
				let key: string = ui.text;
				if (key) {
					let data = GameUtils.getLanguage(key);
					if (data) {
						ui.text = data.info;
						if (data.size > 0) {
							ui.fontSize = data.size;
						}
					}
				}
			}
		});
	}
	private resetPos() {
		if (this.btnExitInteractiveCallback != null) {
			this.btnExitInteractiveCallback();
			this.btnExitInteractiveCallback = null;
		}
		ModuleService.getModule(ActionModuleClient).off();
		setTimeout(() => {
			this.server.net_ResetPos(GlobalData.globalPos);
			Event.dispatchToLocal("PlayerClickDeliverFootBall");
		}, 500);
	}

	/**设置玩家传送，玩家旋转，相机角度 */
	public playerTrasnformRotSysRot(pos: mw.Vector, rot: mw.Rotation, sysRot: mw.Rotation) {
		const character = this.localPlayer.character;
		if (pos) {
			character.worldTransform.position = pos.clone();
		}
		if (rot) {
			character.worldTransform.rotation = rot.clone();
		}
		if (sysRot) {
			ModifiedCameraSystem.setOverrideCameraRotation(sysRot);
			setTimeout(() => {
				ModifiedCameraSystem.resetOverrideCameraRotation();
			}, 32);
		}
	}

	private addGM() {
		AddGMCommand("刷新Find", (player: mw.Player, value: string) => {
			FindGame.instance.startFindGame();
		});
		AddGMCommand("清除当前任务", (player: mw.Player, value: string) => {
			ModuleService.getModule(TaskModuleC).resetTask();
		});
		AddGMCommand("生成建筑", (player: mw.Player, value: string) => {
			const id = Number(value);
			id && ModuleService.getModule(BuildingModuleC).createBuilding(id);
		});
		AddGMCommand("清除所有建筑", (player: mw.Player, value: string) => {
			ModuleService.getModule(BuildingModuleC).destroyBuildings();
		});
		AddGMCommand("清除建筑(建筑ID)", (player: mw.Player, value: string) => {
			const id = Number(value);
			id && ModuleService.getModule(BuildingModuleC).destroyBuildingById(id);
		});

		AddGMCommand("添加造物物品", (player: mw.Player, value: string) => {
			const v = value.split(",").map(v => Number(v));
			const id = v[0];
			const count = v[1] ? v[1] : 1;
			id && ModuleService.getModule(BagModuleC).addCreationItem(id, count);
		});
		AddGMCommand("添加指定物品", (player: mw.Player, value: string) => {
			ModuleService.getModule(BagModuleC).addItem(Number(value));
		});
		AddGMCommand("添加所有物品", (player: mw.Player, value: string) => {
			const allItemLst = GameConfig.Item.getAllElement();
			for (const item of allItemLst) {
				if ([1, 3].includes(item.ItemType)) ModuleService.getModule(BagModuleC).addItem(item.ID, 1, false);
			}
		});
	}



	/**
	 * 监听退出交互物的操作
	 * @param type 类型 1-按钮退出 2-行走和跳跃退出 3-跳跃退出
	 * @param Callback 退出的回调
	 */
	public addExitInteractiveListener(type: number, Callback: () => void) {
		if (type == 1) {
			this.hudPanel.showExitInteractiveBtn(true);
			this.btnExitInteractiveCallback = Callback;
			this.moveExitInteractiveCallback = null;
			this.jumpExitInteractiveCallback = null;
		} else if (type == 2) {
			this.hudPanel.showExitInteractiveBtn(false);
			this.moveExitInteractiveCallback = Callback;
			this.jumpExitInteractiveCallback = Callback;
			this.btnExitInteractiveCallback = null;
		} else if (type == 3) {
			this.hudPanel.showExitInteractiveBtn(false);
			this.jumpExitInteractiveCallback = Callback;
			this.moveExitInteractiveCallback = null;
			this.btnExitInteractiveCallback = null;
		}
	}
	public removeExitInteractiveListener() {
		this.btnExitInteractiveCallback = null;
		this.moveExitInteractiveCallback = null;
		this.jumpExitInteractiveCallback = null;
		this.hudPanel.showExitInteractiveBtn(false);
	}
	public quitInterval() {
		if (this.btnExitInteractiveCallback != null) {
			this.btnExitInteractiveCallback();
			this.btnExitInteractiveCallback = null;
		}
	}
	/**
	 * 设置相机滑动区域可用性
	 * @param bool
	 */
	public setTouchPadEnabled(bool: boolean): void {
		this.hudPanel.setTouchPadEnabled(bool);
	}

	public setUIstate(bool: boolean) {
		if (bool) {
			ModuleService.getModule(ActionModuleClient).changePanelState(true);
			ModuleService.getModule(PropModuleC).setUIShow();
			ModuleService.getModule(BagModuleC).setHubVis(true);
			UIManager.show(SkillUI);
			this.hudPanel.setUIVisable(true, UIType.Camera, UIType.Cloth, UIType.Sky);
			if (!this.hudPanel.visible) UIManager.showUI(this.hudPanel);
		} else {
			ModuleService.getModule(ActionModuleClient).changePanelState(false);
			ModuleService.getModule(PropModuleC).setUIHide();
			ModuleService.getModule(BagModuleC).setHubVis(false);
			UIManager.hide(SkillUI);
			this.hudPanel.setUIVisable(false, UIType.Camera, UIType.Cloth, UIType.Sky);
			UIHide(this.hudPanel);
		}
	}

	/**相机功能--修改主页UI显隐状态 */
	public changeHUDState(cameraType: CameraType) {
		if (cameraType == CameraType.Camera_FP) {
			this.hudPanel.camera_FP(false);
			ModuleService.getModule(BagModuleC).setHubVis(false);
			ModuleService.getModule(ActionModuleClient).changePanelState(false);
			ModuleService.getModule(PropModuleC).setUIHide();
			UIManager.hide(SkillUI);
			this.hudPanel.setUIVisable(false, UIType.Cloth, UIType.Bag, UIType.Sky);
		} else if (cameraType == CameraType.Null) {
			this.hudPanel.camera_FP(true);
			UIManager.show(SkillUI);
			ModuleService.getModule(BagModuleC).setHubVis(true);
			ModuleService.getModule(ActionModuleClient).changePanelState(true);
			ModuleService.getModule(PropModuleC).setUIShow();
			this.hudPanel.setUIVisable(true, UIType.Camera, UIType.Cloth, UIType.Bag, UIType.Sky);
		} else {
			this.hudPanel.camera_FP(true);
			this.hudPanel.camera_Other(false);

			ModuleService.getModule(BagModuleC).setHubVis(false);
			ModuleService.getModule(ActionModuleClient).changePanelState(false);
			ModuleService.getModule(PropModuleC).setUIHide();
			UIManager.hide(SkillUI);
			this.hudPanel.setUIVisable(false, UIType.Cloth, UIType.Bag, UIType.Sky);
		}
	}

	public showCameraPanel(isOutCall: boolean = false) {
		ModuleService.getModule(BagModuleC).setHubVis(false);
		ModuleService.getModule(CameraModuleC).showCamera(isOutCall);
		this.hudPanel.setUIVisable(false, UIType.Camera);
	}

	/**ui游戏时隐藏 */
	public showCameraEnterBag(isVis: boolean) {
		ModuleService.getModule(BagModuleC).setHubVis(isVis);
		// isVis ? UIManager.showUI(this.cameraEnterPanel) : UIHide(this.cameraEnterPanel);
		this.hudPanel.setUIVisable(isVis, UIType.Camera);
		this.changeJoyStickState(isVis);
	}

	public IsTakePhotos(is: boolean) {
		this.hudPanel.changeRightDownCanvasState(is);
	}

	public changeJoyStickState(is: boolean) {
		this.hudPanel.changeJoyStickState(is);
	}

	public propShowCameraPanel(cameraType: CameraType) {
		this.showCameraPanel(true);
		// UIHide(this.cameraEnterPanel)
		this.hudPanel.setUIVisable(false, UIType.Camera);
		ModuleService.getModule(CameraModuleC).switchCamera(cameraType);
	}
	public getCameraUI() {
		return this.hudPanel.getCameraUI();
	}

	/**
	 * 登录设置身份牌
	 * @param occupation
	 * @returns
	 */
	private loginChoose() {
		let nickName = mw.AccountService.getNickName();
		this.server.net_PlayerLogin(!nickName ? this.localPlayer.character.displayName : nickName);
	}

	/**播放大厅音乐 */
	public playBGM(id: number) {
		let cfg = GameConfig.Music.getElement(id);
		mw.SoundService.playBGM(cfg.MusicGUID, cfg.Music);
		this.curBgmID = id;
	}
}
