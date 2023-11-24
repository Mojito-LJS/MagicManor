import { PlayerManagerExtesion, } from '../../../../Modified027Editor/ModifiedPlayer';
import { InteractMgr } from "./InteractMgr";
import { InteractUI } from "./InteractUI";

export class InteractItem {
	public readonly onDestroy: mw.Action = new mw.Action();

	private _interact: mw.Interactor;

	private _trigger: mw.Trigger;

	private _isActive: boolean = false;

	sign: string;

	// public get isActive(): boolean {
	// 	return this._isActive;
	// }

	public set isActive(v: boolean) {
		this._isActive = v;
		if (!v) {
			console.log("设置碰撞");
		}
		if (this._trigger) {
			this._trigger.enabled = (!v);
		}
	}

	id: number;

	cfgId: number;

	index: number;

	constructor(interact: mw.Interactor, trigger: mw.Trigger, index: number) {
		this._interact = interact;
		this._trigger = trigger;
		this.index = index;
		trigger.onEnter.add(this.onEnter);
		trigger.onLeave.add(this.onLeave);
		interact.onEnter.add(() => {
			InteractUI.Instance.hide();
		});
	}

	init(id: number, cfgId: number, sign: string) {
		this.id = id;
		this.cfgId = cfgId;
		this.sign = sign;
	}

	private onEnter = (go: mw.GameObject) => {
		if (!(PlayerManagerExtesion.isCharacter(go)) || go != Player.localPlayer.character) return;
		logI("进入交互");
		if (this._isActive) return;
		InteractUI.Instance.show(() => {
			this._interact.enter(Player.localPlayer.character);
			InteractMgr.Instance.nowInteractItem = this;
			this.isActive = true;
		}, this._interact.worldTransform.position);
	};

	private onLeave = (go: mw.GameObject) => {
		if (!(PlayerManagerExtesion.isCharacter(go)) || go != Player.localPlayer.character) return;
		logI("离开交互");
		// if (!this._isActive) return;
		// this._interact.leave();
		// this.isActive = false;
		InteractUI.Instance.hide();
	};

	endInteract() {
		if (!this._isActive) return;
		this._interact.leave();
		this.isActive = false;
	}

	destroy() {
		if (this._isActive) {
			this._interact?.leave();
			this.isActive = false;
		}
		this._trigger?.onEnter.remove(this.onEnter);
		this._trigger?.onLeave.remove(this.onLeave);
		this.onDestroy.call();
		this.onDestroy.clear();
		this._interact = null;
		this._trigger = null;
	}
}
