import { SpawnManager,SpawnInfo, } from '../../../../Modified027Editor/ModifiedSpawn';
/**
 * @Author       : peiwen.chen
 * @Date         : 2023-03-02 18:00:37
 * @LastEditors  : peiwen.chen
 * @LastEditTime : 2023-03-08 15:35:19
 * @FilePath     : \fantasymagicschool\JavaScripts\modules\fighting\ui\fly\WidgetFlyUI.ts
 * @Description  : 修改描述c
 */
import FlyFont_Generate from "../../../../ui-generate/fly/FlyFont_generate";
import FlyIcon_Generate from "../../../../ui-generate/fly/FlyIcon_generate";
import WidgetFly_Generate from "../../../../ui-generate/fly/WidgetFly_generate";
import { single } from "../../../../utils/GameUtils";
import WidgetFly, { WidgetFlyConfig } from "./ui/WidgetFly";

@single()
export class WidgetFlyUI {
	// private static _instance: WidgetFlyUI;

	public static readonly instance: WidgetFlyUI = null;

	private _widgetFly: WidgetFly<FlyFont_Generate, FlyIcon_Generate>;

	private _pool: { uiWidget: mw.UIWidget; view: WidgetFly_Generate }[] = [];

	private _index: number = 0;

	constructor() {
		this._widgetFly = new WidgetFly(
			FlyFont_Generate,
			FlyIcon_Generate,
			a => {
				a.view.uiObject.visibility = mw.SlateVisibility.SelfHitTestInvisible;
			},
			a => {
				a.view.uiObject.visibility = mw.SlateVisibility.Collapsed;
			}
		);
		const maxCount = this._widgetFly.tipPools.length + this._widgetFly.iconTipPools.length;
		for (let index = 0; index < maxCount; index++) {
			this.createUIWidget();
		}
		Event.addLocalListener("ScenesManagerClose", () => {
			TimeUtil.delayExecute(() => {
				// this._view.onHide();
			}, 2);
		});
	}

	private createUIWidget() {
		const uiWidget = SpawnManager.spawn<mw.UIWidget>({ guid: "UIWidget" /**世界ui的资源ID */, replicates: false });
		if (!uiWidget) {
			SpawnManager.asyncSpawn<mw.UIWidget>({ guid: "UIWidget" /**世界ui的资源ID */, replicates: false }).then(this.onCreate);
		} else {
			this.onCreate(uiWidget as mw.UIWidget);
		}
	}

	private onCreate = (uiWidget: mw.UIWidget) => {
		uiWidget.asyncReady().then(() => {
			uiWidget.widgetSpace = mw.WidgetSpaceMode.Screen;
			uiWidget.pivot = new mw.Vector2(0.5, 0.5);
			if (SystemUtil.isClient()) {
				const view = mw.UIService.create(WidgetFly_Generate);
				uiWidget.setTargetUIWidget(view.uiObject as mw.UserWidget);
				uiWidget.drawSize = WindowUtil.getViewportSize().clone();
				uiWidget.refresh();
				this._pool.push({ uiWidget, view });
			}
		});
	};

	public get() {
		const uiWidget = this._pool[this._index];
		this._index = this._index >= this._pool.length ? 0 : this._index + 1;
		return uiWidget;
	}

	public showFly(cfg: WidgetFlyConfig) {
		const ui = this.get();
		// ui.parent = null;
		ui.uiWidget.worldTransform.position = ui.uiWidget.worldTransform.position.set(cfg.loc);
		const flyItem = this._widgetFly.getFly(cfg, WindowUtil.getViewportSize().divide(2));
		ui.view.rootCanvas.addChild(flyItem.view.uiObject);
		flyItem.start();
	}
	public update(dt: number) {
		this._widgetFly.tweenGroup.update();
	}
}
