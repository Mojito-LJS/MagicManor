import { Tween } from "../../../../ExtensionType";
import { GameConfig } from "../../../../config/GameConfig";
import { IMonsterElement } from "../../../../config/Monster";
import { IMusicElement } from "../../../../config/Music";
import Component from "../../base/Component";
import ComponentSystem, { component } from "../../base/ComponentSystem";
import LibraryTargetComponent, { LibraryData, LibraryTargetEvent, Status } from "../find/LibraryTargetComponent";
import { TagComponent } from "../tag/TagComponent";
import { IdentifierTags } from "../tag/core/IdentifierTags";

export enum LibraryMoveEvent {
	moveFail = "moveFail",
}
export type LibraryMove = {
	moveFail: () => void;
};
@component(2)
export default class LibraryMoveComponent extends Component<LibraryMove, LibraryMoveEvent> {
	/**运动轨迹 */
	private _moveTrace: Vector[];
	private _obj: mw.GameObject;
	private _movePoint: Vector;
	private _index: number;
	private _step: number;
	private _target: mw.Character;
	/**状态 */
	private _status: Status;
	/**等待时间 */
	private _waitReveseTime: number;
	private _waitResetTime: number;

	private _cfg: IMonsterElement;

	private _transform: Transform;
	private _speed: number;
	private _tag: TagComponent;

	public init(id: number, points: Vector[], guid: string) {
		this._cfg = GameConfig.Monster.getElement(id);
		this._obj = mw.GameObject.findGameObjectById(guid);
		this._moveTrace = [];
		this._moveTrace.push(this._cfg.Position[0]);
		this._transform = Transform.identity;
		this._speed = this._cfg.Speed;

		for (let pos of points) {
			this._moveTrace.push(pos);
		}

		this._status = Status.Idle;
		this.useUpdate = true;
	}
	protected onAttach(): void {
		this._tag = ComponentSystem.getComponent(TagComponent, this.ownerSign);
		ComponentSystem.getComponent(LibraryTargetComponent, this.ownerSign).addListen(
			LibraryTargetEvent.targetChange,
			this,
			(libraryTarget: LibraryTargetComponent, obj: mw.Character) => {
				if (this._target === obj) {
					return;
				}
				this._tag.addTag(IdentifierTags.State.Fighting);
				this.resetData();
				this._target = obj;
				this._status = Status.Run;
				this._obj.setVisibility(PropertyStatus.On);
			}
		);
	}
	protected onUpdate(deltaTime: number): void {
		if (this._status == Status.Idle || !this._obj) return;
		const d = this.checkDis(this._obj, this._target);
		const atkRadius = this._cfg.AttackRadius ** 2;
		//检查是否碰到玩家
		if (d <= atkRadius) {
			this.catchPlayer();
			this._status = Status.Reset;
			return;
		}
		this.move(deltaTime);
	}
	protected onDetach(): void {
		this.useUpdate = false;
		this._tag = null;
	}

	private move(deltaTime: number) {
		switch (this._status) {
			case Status.Run:
				if (this.checkDis(this._obj, this._movePoint) <= 400) {
					this.resetDirection();
				}
				//获取方向
				Vector.subtract(this._movePoint, this._obj.worldTransform.position, tempVector);
				Vector.normalize(tempVector, tempVector);

				Vector.multiply(tempVector, this._speed * deltaTime, tempVector);

				this._obj.worldTransform.position = this._obj.worldTransform.position.add(tempVector);
				this.flipFace();
				break;

			case Status.ReverseDir:
				//等待
				this._waitReveseTime -= deltaTime;
				if (this._waitReveseTime < 0) {
					this._step = -1;
					this._status = Status.Run;
				}
				break;

			case Status.Reset:
				this._waitResetTime -= deltaTime;
				if (this._waitResetTime < 0) {
					this.resetData();
					this._status = Status.Idle;
					this._target = null;
					this._tag.removeTag(IdentifierTags.State.Fighting);
				}
				break;

			default:
				break;
		}
	}
	public resetData() {
		this._index = 0;
		this._movePoint = this._moveTrace[this._index];
		this._obj.worldTransform.position = this._movePoint;
		this._obj.setVisibility(PropertyStatus.Off);
		this._step = 1;

		this._waitReveseTime = 5;
		this._waitResetTime = 3;
	}
	private flipFace() {
		if (!this._target) return;
		const transform = this._transform;
		transform.lookAt(this._target.worldTransform.position);
		this._obj.worldTransform.position = transform.position;
		this._obj.worldTransform.rotation = transform.rotation;
	}

	private resetDirection() {
		//正向走
		if (this._step > 0) {
			if (this._index + this._step > this._moveTrace.length - 1) {
				this._status = Status.ReverseDir;
				return;
			}
		}
		//反向
		else {
			if (this._index + this._step < 0) {
				this._status = Status.Reset;
				return;
			}
		}
		this._status = Status.Run;
		this._index += this._step;
		this._movePoint = this._moveTrace[this._index];
	}

	private catchPlayer() {
		Event.dispatchToServer(`MONSTER_ARREST_L`);
		this._target = null;
	}

	public checkDis(vec1: Vector | mw.GameObject, vec2: Vector | mw.GameObject) {
		if (!vec1 || !vec2) return Number.MAX_VALUE;
		if (vec1 instanceof mw.GameObject) {
			vec1 = vec1.worldTransform.position;
		}
		if (vec2 instanceof mw.GameObject) {
			vec2 = vec2.worldTransform.position;
		}
		return Vector.squaredDistance(vec1, vec2);
	}
}

let tempVector = Vector.zero;
