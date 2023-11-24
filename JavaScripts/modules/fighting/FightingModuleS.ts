import { FightingModuleC } from "./FightingModuleC";

/**
 * Fighting模块Server端
 */
// @mw.ModuleUtil.server(ModuleName.Fighting, FightingModuleDataHelper)
export class FightingModuleS extends ModuleS<FightingModuleC, null> {
	// private _logic: FightingLogicS;

	// public get logic(): FightingLogicS {
	// 	return this._logic;
	// }

	/**
	 * 创建模块,这时候只能调用本模块内容进行初始化
	 */
	protected override onAwake(): void {
		super.onAwake();
		// this._logic = FightingLogicS.init(this);
	}

	/**
	 * 开始模块,可以进行模块间的调用
	 */
	protected override onStart(): void {
	}


	protected onUpdate(dt: number): void {
		// this._logic?.update(dt);
	}
}
