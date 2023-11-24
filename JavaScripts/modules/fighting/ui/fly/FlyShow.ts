import { GeneralManager, } from '../../../../Modified027Editor/ModifiedStaticAPI';
/**
 * @Author       : peiwen.chen
 * @Date         : 2023-03-02 18:00:37
 * @LastEditors  : peiwen.chen
 * @LastEditTime : 2023-03-09 13:10:49
 * @FilePath     : \fantasymagicschool\JavaScripts\modules\fighting\ui\fly\FlyShow.ts
 * @Description  : 修改描述
 */

import FlyFont_Generate from "../../../../ui-generate/fly/FlyFont_generate";
import FlyIcon_Generate from "../../../../ui-generate/fly/FlyIcon_generate";
import WidgetFly_Generate from "../../../../ui-generate/fly/WidgetFly_generate";
import { single } from "../../../../utils/GameUtils";
import { VectorUtil } from "../../util/MetaExtensionHelper";
import WidgetFly, { WidgetFlyConfig } from "./ui/WidgetFly";
const startPos = mw.Vector2.zero;
/**
 * 提示文字
 *
 */
@single()
export class FlyShow {
	public static readonly instance: FlyShow = null;

	private _view: WidgetFly_Generate;

	private widgetFly: WidgetFly<FlyFont_Generate, FlyIcon_Generate>;
	private _isVisible: boolean = false;

	constructor() {
		this.init();
	}
	private init() {
		this._view = mw.UIService.create(WidgetFly_Generate);
		this.widgetFly = new WidgetFly(
			FlyFont_Generate,
			FlyIcon_Generate,
			a => {
				mw.UIService.showUI(a.view);
			},
			a => {
				mw.UIService.hideUI(a.view);
			}
		);
		Event.addLocalListener("ScenesManagerClose", () => {
			TimeUtil.delayExecute(() => {
				this.hide();
			}, 2);
		});
	}

	public hide() {
		mw.UIService.hideUI(this._view);
		this.widgetFly.onHide();
		this._isVisible = false;
	}
	public show() {
		if (this._isVisible) {
			return;
		}
		mw.UIService.showUI(this._view, mw.UILayerScene);
		this._isVisible = true;
	}
	public showFly(cfg: WidgetFlyConfig) {
		GeneralManager.modifyProjectWorldLocationToWidgetPosition(Player.localPlayer, cfg.loc, startPos, true);
		if (!VectorUtil.withinRect(mw.Vector2.zero, this._view.rootCanvas.size, startPos)) {
			return;
		}
		this.show();
		this.widgetFly.getFly(cfg, startPos).start();
	}

	public update(dt: number) {
		if (!this._isVisible) {
			return;
		}
		this.widgetFly.tweenGroup.update();
	}
}
