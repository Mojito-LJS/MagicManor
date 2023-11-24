import ComponentSystem, { component } from "../../base/ComponentSystem";
import { AttributeComponent } from "../attribute/AttributeComponent";
import { FindTargetComponent, FindTargetEvent } from "../find/FindTargetComponent";
import { TagComponent } from "../tag/TagComponent";
import { IdentifierTags } from "../tag/core/IdentifierTags";
import { MoveComponent } from "./MoveComponent";

@component(10)
export class GhostMoveComponent extends MoveComponent {
	private _direction: mw.Vector = mw.Vector.zero;
	protected isLoseTarget: boolean = true;
	private _go: mw.GameObject;
	protected endMove: boolean = true;
	public set go(v: mw.GameObject) {
		this._go = v;
		this.curLocation.set(v.worldTransform.position);
		this.useUpdate = true;
	}
	private _targetPosition: mw.Vector = mw.Vector.zero;
	protected dead: boolean = false;

	private _tag: TagComponent;
	protected onAttach(): void {
		const ownerSign = this.ownerSign;
		if (ComponentSystem.hasComponent(ownerSign, TagComponent)) {
			this._tag = ComponentSystem.getComponent(TagComponent, ownerSign);
			// this._tag.addTag(IdentifierTags.State.Fighting);
		}
		if (ComponentSystem.hasComponent(ownerSign, AttributeComponent)) {
			const attribute = ComponentSystem.getComponent(AttributeComponent, ownerSign);
			this.speed = attribute.getAttributeValue("speed");
			attribute.registerAttrChangeEvent("speed", this, this.setSpeed);
		}
		if (ComponentSystem.hasComponent(ownerSign, FindTargetComponent)) {
			const findTarget = ComponentSystem.getComponent(FindTargetComponent, ownerSign);
			const monsterCfg = (this.monsterCfg = findTarget["_monsterCfg"]);
			findTarget.addListen(FindTargetEvent.playerIdChange, this, (findTarget: FindTargetComponent, playerId: number) => {
				this.isLoseTarget = false;
				this.setSpeed(this.speed);
				if (playerId) {
					this.useUpdate && this._go.setVisibility(PropertyStatus.On);
					this._tag.addTag(IdentifierTags.State.Fighting);
				} else {
					this._go.setVisibility(PropertyStatus.Off);
					this._tag.removeTag(IdentifierTags.State.Fighting);
				}
			});
			findTarget.addListen(FindTargetEvent.loseTarget, this, (findTarget: FindTargetComponent, target: mw.Vector) => {
				if (this._targetPosition.equals(target)) {
					return;
				}
				this.isLoseTarget = true;
				this.setSpeed(monsterCfg.Speed / 3);
				this.endMove = false;
				this._targetPosition.set(target);
				this._targetPosition.z = this.curLocation.z;
			});
			findTarget.addListen(FindTargetEvent.targetPosChange, this, (find, target) => {
				if (this._targetPosition.equals(target)) {
					return;
				}
				this.endMove = false;
				this._targetPosition.set(target);
				this._targetPosition.z = this.curLocation.z;
			});
		} else {
			console.error("type error: 缺少组件>FindTargetComponent");
		}
	}
	protected onDetach(): void {
		this.useUpdate = false;
		this._tag = null;
		this._go = null;
	}

	protected onUpdate(dt: number): void {
		if (!this._go || this.dead || this.endMove) {
			return;
		}
		this.setTarget();
		let detal = this.speed * dt;
		this.curLocation.x += this._direction.x * detal;
		this.curLocation.y += this._direction.y * detal;
		this.curLocation.z = this._go.worldTransform.position.z; //+= this._direction.z * detal;
		this._go.worldTransform.position = this.curLocation;
		if (mw.Vector.squaredDistance(this.curLocation, this._targetPosition) <= this.monsterCfg.PathRadius ** 2) {
			this.onSuccess();
			this.endMove = true;
		}
	}

	public setTarget(): void {
		const direction = this._direction;
		mw.Vector.subtract(this._targetPosition, this.curLocation, direction);
		direction.normalize();
		// let { x, y } = direction;
		// let cos = (x * 1 + y * 0) / direction.length;
		// let angle = (Math.acos(cos) * 180) / Math.PI;
		// if (y >= 0) {
		// 	angle = Math.abs(angle);
		// } else {
		// 	angle = -1 * Math.abs(angle);
		// }
		this._go.worldTransform.lookAt(this._targetPosition);
		// this._go.worldRotation = new Type.Rotation(0, 0, angle + this.monsterCfg.Rotation.z);
	}
}
