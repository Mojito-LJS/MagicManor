import { GameConfig } from "../../config/GameConfig";
import { FightingLogicC } from "./FightingLogicC";
import { FightingModuleS } from "./FightingModuleS";
// import { MonsterManagerC } from "./manager/monster/MonsterManagerC";

/**
 * Fighting模块Client端
 */
// @mw.ModuleUtil.client(ModuleName.Fighting)
export class FightingModuleC extends ModuleC<FightingModuleS, null> {
	private _logic: FightingLogicC;

	public get logic(): FightingLogicC {
		return this._logic;
	}

	/**
	 * 开始模块,可以进行模块间的调用
	 */
	protected override onStart(): void {
		super.onStart();
		this._logic = FightingLogicC.init(this);
	}


	protected onUpdate(dt: number): void {
		this._logic?.update(dt);
	}

}
