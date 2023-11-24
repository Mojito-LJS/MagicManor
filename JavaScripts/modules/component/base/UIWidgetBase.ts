/**
 * @Author       : 陈佩文 peiwen.chen@appshahe.com
 * @Date         : 2023-03-01 15:53:50
 * @LastEditors  : 陈佩文 peiwen.chen@appshahe.com
 * @LastEditTime : 2023-03-01 15:53:51
 * @FilePath     : \blueprint\JavaScripts\modules\attrs\UIWidetBase.ts
 * @Description  :
 */

export abstract class UIWidgetBase<T extends mw.UIScript> {
	uiWidget: mw.UIWidget = null;

	protected view: T;
	private _isShow: boolean = true;

	constructor(public uiClass: mw.TypeName<T>, uiWidget?: mw.UIWidget, bInReplicates: boolean = false) {
		if (!uiWidget) {
			uiWidget = mw.UIWidget.spawn("UIWidget" /**世界ui的资源ID */, { replicates: bInReplicates });
			if (!uiWidget) {
				mw.UIWidget.asyncSpawn("UIWidget" /**世界ui的资源ID */, { replicates: bInReplicates }).then(this.onCreate);
			}
			// } else {
		}
		this.onCreate(uiWidget as mw.UIWidget);
	}

	private onCreate = (uiWidget: mw.UIWidget) => {
		this.uiWidget = uiWidget;
		this.view = UIService.create(this.uiClass);
		uiWidget.asyncReady().then(() => {
			uiWidget.widgetSpace = mw.WidgetSpaceMode.OverheadUI;
			uiWidget.pivot = new mw.Vector2(0.5, 0.5);
			uiWidget.setTargetUIWidget(this.view.uiObject as mw.UserWidget);
			// uiWidget.drawSize = this.view.rootCanvas.size.clone();
			uiWidget.refresh();
			this.onInit();
		});
	};

	protected abstract onInit();
	ready() {
		return this.uiWidget.asyncReady();
	}

	/**显示 */
	show(...params: unknown[]) {
		if (this._isShow) {
			return;
		}
		this._isShow = true;
		this.ready().then(uiWidget => {
			this.onShow(...params);
			uiWidget.setVisibility(mw.PropertyStatus.On);
		});
	}

	protected onShow(...params: unknown[]) { }

	/**隐藏 */
	hide() {
		if (!this._isShow) {
			return;
		}
		this._isShow = false;
		this.ready().then(uiWidget => {
			this.uiWidget.setVisibility(mw.PropertyStatus.Off);
		});
	}

	/**
	 * 将世界ui挂载到一个GameObject上
	 * @param attachObj
	 */
	attachToGameObject(attachObj: mw.GameObject, relativeLocation: mw.Vector = mw.Vector.zero) {
		this.ready().then(uiWidget => {
			uiWidget.parent = attachObj;
			uiWidget.localTransform.position = relativeLocation;
			uiWidget.setVisibility(mw.PropertyStatus.FromParent);
		});
	}

	/**
	 * 将世界ui挂载到一个人形对象的对应插槽上
	 * @param attachObj 人形对象
	 * @param socket 插槽，默认为Root
	 */
	attachGameObjectToCharacter(
		attachObj: mw.Character,
		socket: mw.HumanoidSlotType = mw.HumanoidSlotType.Root,
		relativeLocation: mw.Vector = mw.Vector.zero
	) {
		this.ready().then(uiWidget => {
			attachObj && attachObj.attachToSlot(this.uiWidget, socket);
			uiWidget.localTransform.position = relativeLocation;
			uiWidget.setVisibility(mw.PropertyStatus.FromParent);
		});
		// attachObj && attachObj.attach(this.uiWidget, socket);
		// this.uiWidget.setRelativeLocation(new Type.Vector(0, 0, 100))
	}

	/**
	 * 将此物体与当前附着的物体分离
	 */
	detachFromGameObject() {
		this.uiWidget.parent = null;
	}

	destroy() {
		this.onDestroy();
		this.uiWidget.destroy();
		this.view.destroy();
		this.uiWidget = null;
	}
	onDestroy() { }
}
