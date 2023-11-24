import { myPlayerID } from "../../../../ExtensionType";
import { GameConfig } from "../../../../config/GameConfig";
import { IMonsterElement } from "../../../../config/Monster";
import { GlobalData } from "../../../../const/GlobalData";
import { TimeTool } from "../../../../utils/TimeTool";
import Component from "../../base/Component";
import { component } from "../../base/ComponentSystem";

export enum FindTargetEvent {
	/**失去目标 */
	loseTarget = "loseTarget",
	/**碰到目标 */
	arrest = "arrest",
	playerIdChange = "playerIdChange",
	/**目标点改变 */
	targetPosChange = "targetPosChange",
}
export type FindTarget = {
	loseTarget: (target: mw.Vector) => void;
	arrest: (playerId: number) => void;
	playerIdChange: (playerId: number) => void;
	targetPosChange: (loc: mw.Vector) => void;
	remove: () => void;
};

@component(10)
export class FindTargetComponent extends Component<FindTarget, FindTargetEvent> {
	/** 进入范围的玩家ID */
	protected _enterPlayerID: number[] = [];
	/** 目标位置 */
	protected _targetPosition: Vector = Vector.zero;
	/** 当前坐标 */
	protected _curLocation: Vector = Vector.zero;
	/** 怪兽配置信息 */
	protected _monsterCfg: IMonsterElement;

	/** 目标点序号 */
	protected _targetIndex: number = 0;
	/** 检测半径的平方 */
	private _squareRadius: number = 0;
	/** 触发器 */
	private _trigger: mw.Trigger = null;
	/** 当前目标的玩家ID */
	protected _curPlayerID: number = 0;

	private _owner: mw.GameObject;

	private _findTarget: () => void;

	protected onAttach(): void {
		this._owner = mw.GameObject.findGameObjectById(this.ownerSign);
		this._findTarget = TimeTool.throttle(this, this.setTarget, 15);
	}
	protected onDetach(): void {
		this._owner = null;
		this.useUpdate = false;
		if (this._trigger) {
			this._trigger.onEnter.remove(this.enter);
			this._trigger.onLeave.remove(this.leave);
		}
		this._trigger = null;
		this._enterPlayerID.length = 0;
	}

	protected onUpdate(dt: number): void {
		this._findTarget && this._findTarget();
	}

	init(ID: number) {
		this._monsterCfg = GameConfig.Monster.getElement(ID);
		this._squareRadius = this._monsterCfg.AttackRadius * this._monsterCfg.AttackRadius;
		this._targetIndex = 0;
		this._targetPosition.set(this._monsterCfg.Position[this._targetIndex]); // = .clone();
		mw.GameObject.asyncFindGameObjectById(this._monsterCfg.Trigger).then(go => {
			const trigger = (this._trigger = go as mw.Trigger);
			trigger.onEnter.add(this.enter);
			trigger.onLeave.add(this.leave);
			const players = mw.Player.getAllPlayers();
			for (const iterator of players) {
				if (trigger.checkInArea(iterator.character)) {
					trigger.onEnter.broadcast(iterator.character);
				}
			}
		});
		this.useUpdate = true;
	}

	/**
	 * 玩家进入触发器
	 * @param go 碰到触发器的玩家
	 */
	protected enter = (go: mw.GameObject) => {
		if (go instanceof mw.Character && go.player) {
			let playerId = go.player.playerId;
			if (GlobalData.NEW_PLAYERID.includes(playerId)) {
				return;
			}
			if (SystemUtil.isClient()) {
				if (playerId == myPlayerID) {
					let index = this._enterPlayerID.indexOf(playerId);
					if (index < 0) {
						this._enterPlayerID.push(playerId);
					}
				}
			} else {
				let index = this._enterPlayerID.indexOf(playerId);
				if (index < 0) {
					this._enterPlayerID.push(playerId);
				}
			}
		}
	};

	/**
	 * 玩家离开触发器
	 * @param go 离开触发器的玩家
	 */
	protected leave = (go: mw.GameObject) => {
		if (go instanceof mw.Character && go.player) {
			let ID = go.player.playerId;
			if (SystemUtil.isClient()) {
				let player = mw.Player.localPlayer;
				if (ID == player.playerId) {
					this.deletePlayer(ID);
				}
			} else {
				this.deletePlayer(ID);
			}
		}
	};

	private deletePlayer(ID: number) {
		let index = this._enterPlayerID.indexOf(ID);
		if (index >= 0) {
			this._enterPlayerID.splice(index, 1);
		}
	}

	/**
	 * 设置目标位置，检测玩家是否进入鬼的检测范围
	 */
	public setTarget() {
		let min = -1;
		this._curLocation.set(this._owner.worldTransform.position);
		if (this._enterPlayerID.length <= 0) {
			// 待机情况到达目标点，设置新的目标点
			if (
				Math.abs(this._targetPosition.x - this._curLocation.x) <= this._monsterCfg.AttackRadius &&
				Math.abs(this._targetPosition.y - this._curLocation.y) <= this._monsterCfg.AttackRadius
			) {
				this._targetIndex++;
				if (this._targetIndex >= this._monsterCfg.Position.length) {
					this._targetIndex = 0;
				}
				this._targetPosition.set(this._monsterCfg.Position[this._targetIndex]); //= .clone();
				this.sendMessage(FindTargetEvent.loseTarget, this._targetPosition);
			}
			if (this._curPlayerID) {
				this._targetPosition.set(this._monsterCfg.Position[this._targetIndex]); // = .clone();
				this._curPlayerID = 0;
				this.sendMessage(FindTargetEvent.playerIdChange, this._curPlayerID);
				this.sendMessage(FindTargetEvent.loseTarget, this._targetPosition);
			}
		} else {
			for (let i = this._enterPlayerID.length - 1; i >= 0; i--) {
				let playerId = this._enterPlayerID[i];
				let player = mw.Player.getPlayer(playerId);
				if (!player) {
					this._enterPlayerID.splice(i, 1);
					break;
				}
				let loc = player.character.worldTransform.position;
				target.set(this._curLocation);
				target.z = 0;
				loc.z = 0;
				let square = Vector.squaredDistance(loc, target);
				// 目标玩家与怪物之间的距离小于预期值
				if (square <= this._squareRadius) {
					this.deletePlayer(playerId);
					this.sendMessage(FindTargetEvent.arrest, playerId);
				}
				if (square < min || min < 0) {
					min = square;
					this._targetPosition = loc;
					this.sendMessage(FindTargetEvent.targetPosChange, loc);
					if (this._curPlayerID !== playerId) {
						// this.sendMessage(FindTargetEvent.playerIdChange, playerId);
						this._curPlayerID = playerId;
						// } else if (this._curPlayerID) {
					}
					this.sendMessage(FindTargetEvent.playerIdChange, playerId);
				}
			}
		}
	}
}
const target = mw.Vector.zero;
