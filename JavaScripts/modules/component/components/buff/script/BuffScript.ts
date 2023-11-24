import { TimeTool } from "../../../../../utils/TimeTool";
import { registerFightScript } from "../../../base/BaseScript";
import ComponentSystem from "../../../base/ComponentSystem";
import BuffComponent from "../BuffComponent";
import { CreateBuffContext, getBuffDefWithName } from "../base/BuffRegister";
import { BuffScriptC, BuffScriptCName } from "./BuffScriptC";
import { BuffScriptS, BuffScriptSName } from "./BuffScriptS";

@mw.Component
export default class BuffScript extends mw.Script {
	private static _instance: BuffScript;
	private _buffApplies: { selfs: string[]; effectDefs: string[]; levels: number[]; targets: string[]; createContexts: CreateBuffContext[] } = {
		selfs: [],
		effectDefs: [],
		levels: [],
		targets: [],
		createContexts: [],
	};
	private _isAddBuffApply: boolean;
	private _t: TimeTool.Instantiable;
	private _addBuffApply: TimeTool.ReturnTimeObject<() => void>;
	public static get instance(): BuffScript {
		return this._instance;
	}
	public readonly serverFun: BuffScriptS = new BuffScriptS();
	public readonly clientFun: BuffScriptC = new BuffScriptC();
	protected onStart(): void {
		if (!BuffScript._instance) {
			BuffScript._instance = this;
		}
		if (SystemUtil.isClient()) {
			this.useUpdate = true;
			this._t = new TimeTool.Instantiable();
			this._addBuffApply = this._t.throttleByFrame(
				this,
				() => {
					if (this._isAddBuffApply) {
						this._isAddBuffApply = false;
						const { selfs, effectDefs, levels, targets, createContexts } = this._buffApplies;
						this.server(BuffScriptSName.buffApply, selfs, effectDefs, levels, targets, createContexts);
						selfs.length = 0;
						effectDefs.length = 0;
						levels.length = 0;
						targets.length = 0;
						createContexts.length = 0;
					}
				},
				2
			);
		}
	}

	protected onUpdate(deltaTime: number): void {
		if (SystemUtil.isClient()) {
			if (this._addBuffApply) {
				this._addBuffApply.run();
			}
			this._t.update(deltaTime);
		}
	}

	public static addBuffApply(self: string, effectDef: string, level: number, target: string, createContext: CreateBuffContext) {
		if (ComponentSystem.hasComponent(target, BuffComponent)) {
			ComponentSystem.getComponent(BuffComponent, target)["applyBuffToSelfInternal"](getBuffDefWithName(effectDef), level, self, createContext);
			return;
		}
		const st = this._instance;
		st._isAddBuffApply = true;
		const { selfs, effectDefs, levels, targets, createContexts } = st._buffApplies;
		selfs.push(self);
		effectDefs.push(effectDef);
		levels.push(level);
		targets.push(target);
		createContexts.push(createContext);
	}
	@mw.RemoteFunction(mw.Client)
	client<N extends BuffScriptCName>(player: mw.Player, name: N, ...args: Parameters<BuffScriptC[N]>) {
		this.clientFun[name].call(this.clientFun, ...args);
	}
	@mw.RemoteFunction(mw.Server)
	server<N extends BuffScriptSName>(name: N, ...args: Parameters<BuffScriptS[N]>) {
		this.serverFun[name].call(this.serverFun, ...args);
	}
}
