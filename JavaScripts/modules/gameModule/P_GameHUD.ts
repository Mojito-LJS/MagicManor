import { EventsName } from "../../const/GameEnum";
import { GlobalData } from "../../const/GlobalData";
import { MyAction, MyAction1, myPlayerID, Tween, UICreate, UIManager } from "../../ExtensionType";
import Game_HUD_Generate from "../../ui-generate/uiTemplate/gameModule/Game_HUD_generate";
import GameUtils from "../../utils/GameUtils";
import BuildingModuleC from "../building/BuildingModuleC";
import { ManorState } from "../building/BuildingModuleS";
import { ManorInvite } from "../building/ui/ManorInvite";
import { MGSMsgHome } from "../mgsMsg/MgsmsgHome";
import { Sky } from "../sky/ui/Sky";
import StationModuleC from "../station/StationModuleC";
import { UserMgr } from "../user/UserMgr";

const creationViewPos = mw.Vector2.zero;

const outPixelPos = mw.Vector2.zero;

const outViewPos = mw.Vector2.zero;

export default class P_GameHUD extends Game_HUD_Generate {
	//事件
	public onJump: Action = new Action();

	public onExitInteractive: Action = new Action();

	public onJoyStickInput: Action1<mw.Vector2> = new Action1<mw.Vector2>();

	public mVirtualJoystick: mw.VirtualJoystickPanel = null; //摇杆

	private mTouchPad: mw.TouchPad = null; //相机滑动区域

	private _uiCanvasMap: Map<string, mw.Widget> = new Map<UIType, mw.Widget>();
	/**拍照 */
	public clickEnterCameraAC: MyAction = new MyAction();
	/**换装 */
	public clickResetClothBtnAC: MyAction1<number> = new MyAction1();

	private _first: boolean = true;

	private _scaleTween: Tween<{ scale: number }>;

	private _angleTween: Tween<{ angle: number }>;

	protected onAwake() {
		super.onAwake();
		this.layer = mw.UILayerBottom;
	}

	public onStart() {
		this.canUpdate = true;

		gameHudRootCanvas = this.rootCanvas;

		for (let i = 0; i < this.rootCanvas.getChildrenCount(); i++) {
			for (let j in UIType) {
				if (this.rootCanvas.getChildAt(i).name.includes(j)) {
					this._uiCanvasMap.set(j, this.rootCanvas.getChildAt(i));
					break;
				}
			}
		}
		this.mButton_1.onClicked.add(this.clickOpenCameraBtn.bind(this));
		this.mBtnCloth.onClicked.add(() => {
			this.clickResetClothBtnAC.call(myPlayerID);
		});

		this.mTouchPad = this.uiWidgetBase.findChildByPath("Canvas/JoyStick/MWTouchPadDesigner_1") as mw.TouchPad;
		this.mVirtualJoystick = this.uiWidgetBase.findChildByPath("Canvas/JoyStick/MWVirtualJoystick") as mw.VirtualJoystickPanel;
		this.mVirtualJoystick.onInputDir.add((vec: mw.Vector2) => {
			this.onJoyStickInput.call(vec);
		});

		this.mJump_btn.onPressed.add(() => {
			this.onJump.call();
		});

		this.mExitInteractive_btn.onClicked.add(() => {
			this.onExitInteractive.call();
		});
		this.mExitInteractive_btn.visibility = mw.SlateVisibility.Hidden;

		this.mBagBtn.onClicked.add(() => {
			Event.dispatchToLocal(EventsName.OpenBagPanel);
		});

		this.mBtnSky.onClicked.add(() => {
			/**burial point */
			MGSMsgHome.openWeather();
			UIManager.show(Sky, (guid: string) => {
				this.mIconSky.imageGuid = guid;
			});
		})

		this.mBtnInvite.onClicked.add(() => {
			UIManager.show(ManorInvite);
		})

		this.returnSchoolBtn.onClicked.add(() => {
			ModuleService.getModule(StationModuleC).showReturnPanel()
		})

		Event.addLocalListener(EventsName.ManorChange, (state: ManorState) => {
			this.mBtnInvite.onClicked.clear();
			if (state === ManorState.Free) {
				this.mIconInvite.imageGuid = "168255";
				this.mTextInvite.text = "邀请";
				this.mBtnInvite.onClicked.add(() => {
					UIManager.show(ManorInvite);
				});
			} else if (state === ManorState.Visit) {
				this.mIconInvite.imageGuid = "175752";
				this.mTextInvite.text = "回家";
				this.mBtnInvite.onClicked.add(() => {
					ModuleService.getModule(BuildingModuleC).goHome();
				});
			}
		})

		Event.addLocalListener(EventsName.EnterBuilding, (isEnter: boolean) => {
			const visibility = isEnter ? mw.SlateVisibility.SelfHitTestInvisible : mw.SlateVisibility.Collapsed;
			this.mCanvasEditor.visibility = visibility;
			if (isEnter) {
				if (this._first) {
					this._first = false;
					this.mLightEditor.visibility = mw.SlateVisibility.SelfHitTestInvisible;
					this._scaleTween.start();
				}
				this._angleTween.start();
			}
		})

		/**第一次显示编辑按钮光圈缩放动画 */
		const scale = this.mLightEditor.renderScale.clone();
		this._scaleTween = new Tween({ scale: 0 }).to({ scale: 1 }, 300).yoyo(true).repeat(1).repeatDelay(1000).onUpdate((obj) => {
			scale.set(obj.scale, obj.scale);
			this.mLightEditor.renderScale = scale;
		}).onComplete(() => { this.mLightEditor.visibility = mw.SlateVisibility.Collapsed; })

		/**编辑按钮显示时晃动动画 */
		this._angleTween = new Tween({ angle: 0 }).to({ angle: 10 }, 200).yoyo(true).repeat(6).onUpdate((obj) => {
			this.mIconEditor.renderTransformAngle = obj.angle;
		})
	}

	/**
	 * 获取部分canvas是否显示
	 * @param type
	 * @returns
	 */
	public getUITypeIsVisible(type: UIType): boolean {
		return this._uiCanvasMap.get(type).visible;
	}

	/**
	 * 获取指定的Canvas
	 * @param type
	 * @returns
	 */
	public getUITypeCanvas(type: UIType) {
		let result = this._uiCanvasMap.get(type);
		return result as mw.Canvas;
	}

	public setUIVisable(visable: boolean, ...param: UIType[]) {
		for (let val of param) {
			if (!this._uiCanvasMap.has(val)) return;
			let result = this._uiCanvasMap.get(val);
			result.visibility = visable ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed;
		}
	}

	public setAllUIVisible(visible: boolean) {
		this._uiCanvasMap.forEach((value, key) => {
			value.visibility = visible ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed;
		});
	}

	public clickOpenCameraBtn() {
		this.clickEnterCameraAC.call();
	}
	public getCameraUI() {
		return this;
	}

	onUpdate(dt: number) {
		GlobalData.gamePlayTime -= dt;
		if (GlobalData.gamePlayTime <= 0) {
			GlobalData.gamePlayTime = 0;
			ModuleService.getModule(StationModuleC).depart();
		}
		this.mTimeCount.text = GameUtils.getTimeStringMS(Math.floor(GlobalData.gamePlayTime));
	}

	onShow(name: string) {
		this.resetJoyStick();
	}

	public setTouchPadEnabled(bool: boolean): void {
		this.mTouchPad.enable = bool;
	}
	public showExitInteractiveBtn(isShow: boolean) {
		if (isShow) {
			this.mExitInteractive_btn.visibility = mw.SlateVisibility.Visible;
			// this.mMWImage_3.visibility = (mw.SlateVisibility.Hidden);
			this.mJump_btn.visibility = mw.SlateVisibility.Hidden;
			// this.mBehavior_btn.visibility = (mw.SlateVisibility.Hidden);
		} else {
			this.mExitInteractive_btn.visibility = mw.SlateVisibility.Hidden;
			// this.mMWImage_3.visibility = (mw.SlateVisibility.Hidden);
			this.mJump_btn.visibility = mw.SlateVisibility.Visible;
		}
	}

	public camera_FP(isShow: boolean) {
		this.mRightDownCon.visibility = isShow ? mw.SlateVisibility.SelfHitTestInvisible : mw.SlateVisibility.Collapsed;
		this.camera_Other(isShow);
	}
	public camera_Other(isShow: boolean) {
		this.canvas_btn.visibility = isShow ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed;
		this.mIdCard_btn.visibility = isShow ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed;
		this.mPulloff_btn.visibility = isShow ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed;
		this.mBtn_Trans.visibility = isShow ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed;

	}
	/**修改右下Canvas显隐状态 */
	public changeRightDownCanvasState(isShow: boolean) {
		this.mRightDownCon.visibility = isShow ? mw.SlateVisibility.SelfHitTestInvisible : mw.SlateVisibility.Collapsed;
	}

	public changeJoyStickState(isShow: boolean) {
		// this.mVirtualJoystick.isLocationFixed = true;
		this.resetJoyStick();
		this.mVirtualJoystick.visibility = isShow ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed;
	}

	public changePanelState(isShow: boolean) {
		this.rootCanvas.visibility = isShow ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed;
		if (!isShow) {
		}
	}

	public resetJoyStick() {
		this.mVirtualJoystick?.resetJoyStick();
	}

	public changeJumpBtnState(isShow: boolean) {
		this.mRightDownCon.visibility = isShow ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed;
	}
}

export enum UIType {
	Camera = "Camera",
	Action = "Action",
	Bag = "Bag",
	Cloth = "Cloth",
	Sky = "Sky",
}

export let gameHudRootCanvas: mw.Canvas = null;
const startPos = new mw.Vector2(36, 72);
const endPos = new mw.Vector2(137, 72);
