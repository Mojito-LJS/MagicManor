import ComponentSystem from "../../../base/ComponentSystem";
import BuffComponent from "../BuffComponent";
import { CreateBuffContext } from "../base/BuffRegister";


export enum BuffScriptSName {
	buffApply = "buffApply",
}
export class BuffScriptS {
	/**
	 * 接收buff的添加
	 * @param self
	 * @param effectDef
	 * @param level
	 * @param target
	 * @param createContext
	 * @returns
	 */
	public buffApply(self: string[], effectDef: string[], level: number[], target: string[], createContext: CreateBuffContext[] = []) {
		console.log("buffApply------BuffScriptS---->", self, target);
		for (let index = 0; index < self.length; index++) {
      const s = self[index]
      const t = target[index]
      const buff = ComponentSystem.getComponent(BuffComponent,self[index])
			// const selfEntity = EntityManagerS.instance.getEntityBySign(self[index]);
			if (!buff) {
				return;
			}
			if (s === t) {
				buff.applyBuffToSelf(effectDef[index], level[index], createContext[index]);
				return;
			}
			// const targetEntity = EntityManagerS.instance.getEntityBySign(target[index]);
			// if (!targetEntity) {
			// 	return;
			// }
			buff.applyBuffToTarget(effectDef[index], level[index], t, createContext[index]);
		}
	}
}
