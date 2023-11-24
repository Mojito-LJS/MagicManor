import { GameConfig } from "../../../../config/GameConfig";
import Component from "../../base/Component";
import ComponentSystem, { component } from "../../base/ComponentSystem";
import InfoComponent from "../info/InfoComponent";
import { HeadUI, HeadUIManager } from "./HeadUI";
export enum HeadEventName {
	cancelCameraLockTarget = "cancelCameraLockTarget",
}
export type HeadEvent = {
	cancelCameraLockTarget: () => void;
};

@component(10)
export default class HeadComponent extends Component<HeadEvent, HeadEventName> {
	private _owner: mw.GameObject;
	private _headUI: HeadUI;
	protected async onAttach(): Promise<void> {
		const guid = this.ownerSign;
		let npc = mw.GameObject.findGameObjectById(guid);
		if (!npc) {
			npc = await mw.GameObject.asyncFindGameObjectById(guid);
		}
		this._owner = npc;
		npc.asyncReady().then(npc => {
			const configId = ComponentSystem.getComponent(InfoComponent, guid).configId;
			const config = GameConfig.FightMonster.getElement(configId);
			// const { headMaxD, headScaleFactor, posOffset, inform } = config;
			// npc.setVisibility(Type.PropertyStatus.On, true);
			if (npc instanceof mw.Character) {
				const uiWidget = npc.overheadUI;
				if (uiWidget.tag !== "NPC" && !uiWidget["__headUI"]) {
					this._headUI = HeadUIManager.getHeadUI(guid, uiWidget, config);
					npc.overheadUI.setVisibility(true);
				} else {
					(uiWidget["__headUI"] as HeadUI).reset(guid, config);
				}
			} else {
				// npc.getChildByName("skirace-p-l6-3").setVisibility(Type.PropertyStatus.On, true);
				const headUI = (this._headUI = HeadUIManager.getHeadUI(guid, undefined, config));
				headUI.attachToGameObject(npc, new mw.Vector(0, 0, 100));
			}
		});
	}

	protected onDetach(): void {
		if (this._headUI.uiWidget.tag !== "NPC") {
			HeadUIManager.recover(this._headUI);
			this._headUI = null;
		}
	}
}
