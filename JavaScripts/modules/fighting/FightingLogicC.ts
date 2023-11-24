import { GameConfig } from "../../config/GameConfig";
import { EventsName } from "../../const/GameEnum";
import { BaseAttributeData } from "../component/components/attribute/AttributeData";
import { FightingModuleC } from "./FightingModuleC";
import { FlyManager } from "./ui/fly/FlyManager";
import { WidgetFlyConfig } from "./ui/fly/ui/WidgetFly";

export class FightingLogicC {
	public static instance: FightingLogicC = null;
	private _flyCfg: { offset: [number, number]; font: { min: number; max: number } } = { offset: [50, 150], font: { min: 24, max: 36 } };

	private constructor(private _moduleC: FightingModuleC) {}

	public static init(_moduleC: FightingModuleC) {
		this.instance = new FightingLogicC(_moduleC);
		// FightAreaManagerC.instance.init(_moduleC);
		Event.addLocalListener(EventsName.HpChangeShowFly, this.instance.changeHp);
		const cfg = GameConfig.Global.getElement(83).Value2;
		if (cfg) {
			this.instance._flyCfg.offset = [cfg[0], cfg[1]];
			this.instance._flyCfg.font.min = cfg[2];
			this.instance._flyCfg.font.max = cfg[3];
		}
		return this.instance;
	}
	public update(dt: number) {
		FlyManager.instance.update(dt);
		// EntityManagerC.instance.update(dt);
		// MonsterManagerOnlyC.instance.update(dt);
	}
	/**
	 * 血量改变飘字
	 * @param attrSet
	 * @param difference
	 * @param loc
	 * @param isCritical
	 */
	private changeHp = (attrSet: BaseAttributeData, difference: number, loc: mw.Vector, isCritical: boolean = false) => {
		if (difference > 0) {
			this.hpChangeShowFly(`${difference}`, loc, false);
		} else if (difference < 0) {
			difference = Math.abs(difference);
			const e = difference / attrSet.atk;
			this.hpChangeShowFly(`${difference}`, loc, false, e);
		}
	};
	/**
	 * 飘字
	 * @param text
	 * @param location
	 * @param isCritical
	 * @param enemy
	 * @param is3D
	 */
	private hpChangeShowFly(text: string, location: mw.Vector, isCritical: boolean, enemy: number = 0, is3D: boolean = false) {
		let fontColor: [number, number, number, number] = [1, 1, 1, 1];
		if (enemy > 10) {
			fontColor = [0.973, 0.003, 0.001, 1];
		} else if (enemy > 6) {
			fontColor = [0.982, 0.133, 0, 1];
		} else if (enemy > 4) {
			fontColor = [0.956, 0.337, 0.006, 1];
		} else if (enemy > 2) {
			fontColor = [0.956, 0.597, 0.006, 1];
		} else if (enemy > 0) {
		} else {
			fontColor = [0.165, 0.871, 0.07, 1];
		}
		const cfg = new WidgetFlyConfig(text, fontColor, location, MathUtil.randomInt(...this._flyCfg.offset), this._flyCfg.font, isCritical);
		is3D ? FlyManager.instance.show3D(cfg) : FlyManager.instance.show2D(cfg);
		// this._moduleC.synchronizeShowFly(cfg, is3D);
	}
}
