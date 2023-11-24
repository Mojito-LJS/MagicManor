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
