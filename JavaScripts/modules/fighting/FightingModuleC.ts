/**
 * @Author       : peiwen.chen
 * @Date         : 2023-03-02 18:00:37
 * @LastEditors  : peiwen.chen
 * @LastEditTime : 2023-03-20 13:55:53
 * @FilePath     : \fantasymagicschool\JavaScripts\modules\fighting\FightingModuleC.ts
 * @Description  : 修改描述
 */
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
