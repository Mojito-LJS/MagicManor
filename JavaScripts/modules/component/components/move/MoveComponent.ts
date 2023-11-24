import { IMonsterElement } from "../../../../config/Monster";
import Component from "../../base/Component";
import ComponentSystem, { component } from "../../base/ComponentSystem";
import { AttributeComponent } from "../attribute/AttributeComponent";
import { FindTargetComponent, FindTargetEvent } from "../find/FindTargetComponent";

export enum MoveEvent {
	moveFail = "moveFail",
}
export type Move = {
	moveFail: () => void;
};

@component(10)
export class MoveComponent extends Component<Move, MoveEvent> {
	protected speed: number;
	protected failNum: number = 0;
	protected curLocation: mw.Vector = mw.Vector.zero;
	private _targetIndex: number = 0;
	private _height: number = 200;
	protected isLoseTarget: boolean = true;
	protected monsterCfg: IMonsterElement;
	private _owner: mw.GameObject;
	protected onAttach(): void {
		const ownerSign = this.ownerSign;
		this._owner = mw.GameObject.findGameObjectById(this.ownerSign);
		if (ComponentSystem.hasComponent(ownerSign, AttributeComponent)) {
			const attribute = ComponentSystem.getComponent(AttributeComponent, ownerSign);
			this.speed = attribute.getAttributeValue("speed");
			attribute.registerAttrChangeEvent("speed", this, (newValue: number) => {
				this.speed = newValue;
				this.setSpeed(newValue);
			});
		}
		if (ComponentSystem.hasComponent(ownerSign, FindTargetComponent)) {
			const findTarget = ComponentSystem.getComponent(FindTargetComponent, ownerSign);
			const monsterCfg = (this.monsterCfg = findTarget["_monsterCfg"]);
			findTarget.addListen(FindTargetEvent.playerIdChange, this, (findTarget: FindTargetComponent, playerId: number) => {
				const owner = this._owner as mw.Character; //findTarget.setTarget as any;
				this.isLoseTarget = false;
				this.setSpeed(this.speed);
				if (playerId && mw.Player.getPlayer(playerId)?.character) {
					mw.Navigation.stopNavigateTo(owner);
					setTimeout(() => {
						mw.Navigation.navigateTo(owner, mw.Player.getPlayer(playerId)?.character?.worldTransform.position, monsterCfg.PathRadius / 2, this.onSuccess, this.onFail);
					}, 0);
				}
			});
			findTarget.addListen(FindTargetEvent.loseTarget, this, (findTarget: FindTargetComponent, target: mw.Vector) => {
				const owner = this._owner as any;
				this.isLoseTarget = true;
				this.setSpeed(this.speed);
				mw.Navigation.stopNavigateTo(owner);
				setTimeout(() => {
					mw.Navigation.navigateTo(owner, target, monsterCfg.PathRadius, this.onSuccess, this.onFail);
				}, 0);
			});
		} else {
			console.error("type error: 缺少组件>FindTargetComponent");
		}
	}
	protected onDetach(): void {
		const owner = this._owner as any;
		mw.Navigation.stopNavigateTo(owner);
	}

	protected onSuccess = () => { };
	/**寻路失败 */
	protected onFail = () => {
		this.failNum++;
		if (this.failNum > 15) {
			this.curLocation.set(this.monsterCfg.Position[this._targetIndex]);
			if (this.monsterCfg.Scale.z > 1) {
				this.curLocation.z += (this.monsterCfg.Scale.z - 1) * this._height;
			}
			this.failNum = 0;
		}
		this.sendMessage(MoveEvent.moveFail);
	};

	/**
	 * 设置速度
	 * @param newValue
	 */
	protected setSpeed(newValue: number) {
		if (this.isLoseTarget) {
			newValue = this.monsterCfg.Speed / 3;
		}
		const owner = this._owner as any;
		if (owner instanceof mw.Character) {
			owner.maxWalkSpeed = newValue;
		}
	}
}
