import Component from "../../base/Component";
import { component } from "../../base/ComponentSystem";

export enum InfoEventName {
	cancelCameraLockTarget = "cancelCameraLockTarget",
}
export type InfoEvent = {
	cancelCameraLockTarget: () => void;
};

@component(10)
export default class InfoComponent extends Component<InfoEvent, InfoEventName> {
	private _configId: number;
	public get configId(): number {
		return this._configId;
	}
	public set configId(v: number) {
		this._configId = v;
	}

	private _owner: mw.GameObject;

	public get owner(): mw.GameObject {
		if (!this._owner) {
			this._owner = mw.GameObject.findGameObjectById(this.ownerSign);
		}
		return this._owner;
	}
}
