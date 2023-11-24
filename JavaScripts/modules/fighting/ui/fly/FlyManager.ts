/**
 * @Author       : peiwen.chen
 * @Date         : 2023-03-02 18:00:37
 * @LastEditors  : peiwen.chen
 * @LastEditTime : 2023-03-06 15:59:03
 * @FilePath     : \fantasymagicschool\JavaScripts\modules\fighting\fly\FlyManager.ts
 * @Description  : 修改描述
 */
import { single } from "../../../../utils/GameUtils";
import { FlyShow } from "./FlyShow";
import { WidgetFlyUI } from "./WidgetFlyUI";
import { WidgetFlyConfig } from "./ui/WidgetFly";
@single()
export class FlyManager {
	// private static _instance: FlyManager;

	public static readonly instance: FlyManager = null;

	// private constructor() {}

	/**
	 * 显示飘字
	 * @param cfg 配置
	 * @returns
	 */
	public show2D(cfg: WidgetFlyConfig) {
		FlyShow.instance.showFly(cfg);
	}

	/**
	 * 显示飘字
	 * @param cfg 配置
	 * @returns
	 */
	public show3D(cfg: WidgetFlyConfig) {
		WidgetFlyUI.instance.showFly(cfg);
	}

	public update(dt: number) {
		FlyShow.instance.update(dt);
		WidgetFlyUI.instance.update(dt);
	}
}
