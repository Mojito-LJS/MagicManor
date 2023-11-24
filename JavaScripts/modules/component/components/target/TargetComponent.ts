import { GameConfig } from "../../../../config/GameConfig";
import { TimeTool } from "../../../../utils/TimeTool";
import Component from "../../base/Component";
import ComponentSystem, { component } from "../../base/ComponentSystem";
import { DelegateAgent } from "../../base/TypeEvent";
import { AttributeComponent, AttributeEvent } from "../attribute/AttributeComponent";
import { IdentifierTags } from "../tag/core/IdentifierTags";
export enum FindEventName {
	cancelCameraLockTarget = "cancelCameraLockTarget",
}
export type FindEvent = {
	cancelCameraLockTarget: () => void;
};
export const movePoint: DelegateAgent<(worldLocation: mw.Vector) => void> = new DelegateAgent();

@component(10)
export class TargetComponent extends Component<FindEvent, keyof FindEvent> {
	private _target: mw.GameObject;
	private _camera: mw.Camera;
	private _check: () => void;
	private _targetAttribute: AttributeComponent;
	public get target(): mw.GameObject {
		return this._target;
	}

	private _owner: mw.Character;

	protected onAttach(): void {
		this.useUpdate = true;
		this._owner = mw.GameObject.findGameObjectById(this.ownerSign) as mw.Character;
		this._camera = mw.Camera.currentCamera;
		this._check = TimeTool.throttle(
			this,
			() => {
				if (this.checkTarget()) {
					this.findTarget();
				}
			},
			5
		);
	}
	protected onDetach(): void {
		this.useUpdate = false;
		this.clearAgent();
		this._targetAttribute = null;
	}

	protected onUpdate(dt: number): void {
		if (this._target) {
			movePoint.broadCast(this._target.worldTransform.position);
		}
		this._check();
	}
	public closeLockTarget() {
		if (this._targetAttribute) {
			this._targetAttribute.clearAgentOfCaller(this);
		}
		this._target = null;
		movePoint.broadCast(null);
		this.sendMessage(FindEventName.cancelCameraLockTarget);
	}

	private findTarget = () => {
		const entity = this._owner;
		const my = entity.worldTransform.position;
		// scope /= 2;
		const myc = entity as mw.Character;
		const targets = ComponentSystem.getComponent(AttributeComponent)
			?.filter(e => {
				if (e.tag.hasAllExact(IdentifierTags.State.Fighting)) {
					return false;
				}
				const loc = e.owner.worldTransform.position;
				myForwardVector.set(myc.worldTransform.getForwardVector());
				loc.subtract(my); //.normalize();
				const a = mw.Vector.angle3D(loc, myForwardVector);
				const l = loc.length;
				// if (l <= 5000) {
				// 	return false;
				// }
				const d = loc.length * Math.sin(a * MathUtil.D2R);
				// return a <= scope; //&& e.tag.hasAllExact(IdentifierTags.State.Fighting);
				return d <= cameraLockTarget.angle; //&& e.tag.hasAllExact(IdentifierTags.State.Fighting);
			})
			.sort((a, b) => mw.Vector.squaredDistance(a.owner.worldTransform.position, my) - mw.Vector.squaredDistance(b.owner.worldTransform.position, my));
		if (targets && targets.length > 0) {
			this._target = targets[0].owner;
			this._targetAttribute = targets[0];
			this._targetAttribute.addListen(AttributeEvent.unitDeath, this, this.closeLockTarget);
		}
	};

	private checkTarget() {
		if (!this._target && this._camera) {
			return true;
		}
		const target = this._target;

		const entity = this._owner;
		const my = this._owner.worldTransform.position;
		const scope = cameraLockTarget.angle; // 2;
		const loc = target.worldTransform.position;
		myForwardVector.set(mw.Player.localPlayer.character.worldTransform.position.subtract(my));
		loc.subtract(my); //.normalize();
		const a = mw.Vector.angle3D(loc, myForwardVector);
		const l = loc.length;
		const d = loc.length * Math.sin(a * MathUtil.D2R);
		const out = !(d <= scope && l <= cameraLockTarget.length); //&& target.tag.hasAllExact(IdentifierTags.State.Fighting)
		if (out) {
			this._target = null;
			movePoint.broadCast(null);
		}
		return out;
	}
}
const myForwardVector = mw.Vector.zero;
export const cameraLockTarget = {
	angle: GameConfig.Global.getElement(82).Value2[0] || 100,
	length: GameConfig.Global.getElement(82).Value2[5] || 5000,
};
