import { Tween } from "../../../../ExtensionType";
import { GameConfig } from "../../../../config/GameConfig";
import { IMonsterElement } from "../../../../config/Monster";
import { IMusicElement } from "../../../../config/Music";
import Component from "../../base/Component";
import { component } from "../../base/ComponentSystem";

export enum Status {
	Idle,
	Run,
	/**反转方向 */
	ReverseDir,
	Reset,
}

/**默认数据 */
export type LibraryData = {
	frontOriginPos: Vector;
	backOriginPos: Vector;
	frontTargetPos: Vector;
	backTargetPos: Vector;
};
export enum LibraryTargetEvent {
	/**失去目标 */
	loseTarget = "loseTarget",
	/**碰到目标 */
	arrest = "arrest",
	targetChange = "targetChange",
	/**目标点改变 */
	targetPosChange = "targetPosChange",
}
export type LibraryTarget = {
	loseTarget: (target: mw.Vector) => void;
	arrest: (playerId: number) => void;
	targetChange: (character: mw.Character) => void;
	targetPosChange: (loc: mw.Vector) => void;
	remove: () => void;
};
@component(2)
export default class LibraryTargetComponent extends Component<LibraryTarget, LibraryTargetEvent> {
	private _frontDoor: mw.GameObject;
	private _backDoor: mw.GameObject;
	private _backIsOpen: boolean;
	private _monsterTrigger: mw.Trigger;
	private _tween: Tween<Vector>;

	private _defaultData: LibraryData;
	private _soundCfg: IMusicElement;

	public get player() {
		return mw.Player.localPlayer;
	}

	public get sound() {
		return SoundService;
	}
	public async init() {
		this._soundCfg = GameConfig.Music.getElement(40);
		this._frontDoor = await mw.GameObject.asyncFindGameObjectById(`478C3AAE`);
		this._backDoor = await mw.GameObject.asyncFindGameObjectById(`79A1973A`);
		this._monsterTrigger = (await mw.GameObject.asyncFindGameObjectById(`B59EDBF4`)) as mw.Trigger;

		this._backIsOpen = false;

		// this._doorTrigger.onEnter.add(this.onDoorTrigger);
		this._monsterTrigger.onEnter.add(this.onMonsterTrigger);

		this._defaultData = {
			frontOriginPos: this._frontDoor.worldTransform.position,
			backOriginPos: this._backDoor.worldTransform.position,
			frontTargetPos: this._frontDoor.worldTransform.position.clone().add(new Vector(0, 0, -300)),
			backTargetPos: this._backDoor.worldTransform.position.clone().add(new Vector(0, 0, -300)),
		};
	}

	protected onDetach(): void {
		this._monsterTrigger.onEnter.remove(this.onMonsterTrigger);
	}

	private onMonsterTrigger = (obj: mw.GameObject) => {
		if (obj instanceof mw.Character && obj.player == this.player) {
			// this.setTarget(obj);
			this.sendMessage(LibraryTargetEvent.targetChange, obj);

			if (this._backIsOpen) return;
			this._backIsOpen = true;
			this.playSound();

			let time = setTimeout(() => {
				this._tween = new Tween(this._backDoor.worldTransform.position)
					.to(this._defaultData.backTargetPos, 2000)
					.onUpdate(v => {
						this._backDoor.worldTransform.position = v;
					})
					.start();
				clearTimeout(time);
			}, 3000);
		}
	};
	private playSound() {
		this.sound.stopSound(this._soundCfg.MusicGUID);
		this.sound.playSound(this._soundCfg.MusicGUID, this._soundCfg.Music);
	}
}
