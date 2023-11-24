import ComponentSystem from "../../../base/ComponentSystem";
import { AttributeComponent } from "../AttributeComponent";
import { AttributeChangeRpc } from "../AttributeData";

@mw.Component
export default class AttrScript extends mw.Script {
	@mw.Property({ replicated: true, onChanged: "signHelper" })
	sign: string = "";

	/**
	 * [属性名,当前值，改变值，fromSign]
	 */
	@mw.Property({ replicated: true, onChanged: "changeHelper" })
	change: [string, number, number, string] = ["", 0, 0, ""];
	signHelper() { }
	changeHelper() {
		console.log("changeHelper------->");
		if (this.change[0] === "damage") {
			return;
		}
		// EntityManagerC.instance.syncData(this.sign, [new AttributeChangeRpc(...this.change)]);
		ComponentSystem.getComponent(AttributeComponent, this.sign)?.syncData([new AttributeChangeRpc(...this.change)]);
	}
}
export class AttrScriptMgr {
	private static _scripts: AttrScript[] = [];
	static async getAttrScript() {
		if (SystemUtil.isClient()) {
			return undefined;
		}
		if (this._scripts.length > 0) {
			return this._scripts.pop();
		}
		return await mw.Script.spawnScript(AttrScript, true);
	}

	static recover(script: AttrScript) {
		if (!script) {
			return;
		}
		this._scripts.push(script);
	}
}
