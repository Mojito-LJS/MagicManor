import { PlayerManagerExtesion, } from '../../../../Modified027Editor/ModifiedPlayer';
import { GameConfig } from "../../../../config/GameConfig";
import { IMonsterElement } from "../../../../config/Monster";
import { EventsName } from "../../../../const/GameEnum";
import { GlobalData } from "../../../../const/GlobalData";
import GameUtils from "../../../../utils/GameUtils";
import { ActionModuleServer } from "../../../action/ActionModuleServer";
import ComponentSystem from "../../../component/base/ComponentSystem";
import { AttributeComponent, AttributeEvent } from "../../../component/components/attribute/AttributeComponent";
import BuffComponent from "../../../component/components/buff/BuffComponent";
import { FindTargetComponent, FindTargetEvent } from "../../../component/components/find/FindTargetComponent";
import { InteractModuleServer } from "../../../interactModule/InteractModuleServer";


export default class MonsterBasic {
	/** 目标位置 */
	protected _targetPosition: Vector = Vector.zero;
	/** 当前坐标 */
	protected _curLocation: Vector = Vector.zero;
	/** 怪兽配置信息 */
	protected _monsterCfg: IMonsterElement;

	/** 目标点序号 */
	protected _targetIndex: number = 0;
	/** 触发器 */
	private _trigger: mw.Trigger = null;
	/** 额外高度 */
	protected _height: number = 200;

	protected _refreshEffect: mw.Effect;
	protected dead: boolean = false;
	private _fightEntityGuid: string;
	public get fightEntityGuid(): string {
		return this._fightEntityGuid;
	}

	init(ID: number) {
		this._monsterCfg = GameConfig.Monster.getElement(ID);
		this._targetIndex = 0;
		GameObject.asyncFindGameObjectById(this._monsterCfg.Trigger).then(go => {
			this._trigger = go as mw.Trigger;
		});
		if (SystemUtil.isClient()) {
			GameObject.asyncFindGameObjectById(GlobalData.fightResurgenceEffect).then(go => {
				if (go.asyncReady()) {
					this._refreshEffect = go.clone() as mw.Effect;
					this._refreshEffect.worldTransform.scale = effectScale;
				}
			});
		}
	}

	/**
	 * 怪物碰到玩家
	 * @param ID 玩家ID
	 */
	private arrest(ID: number) {
		if (SystemUtil.isClient()) {
			let player = Player.localPlayer;
			if (ID == player.playerId) {
				Event.dispatchToServer(EventsName.CancelActive);
				Event.dispatchToLocal(EventsName.CancelActive);
			}
		} else {
			Event.dispatchToLocal("MONSTER_ARREST", ID);
			if (ModuleService.getModule(ActionModuleServer).isInInteract(ID)) {
				ModuleService.getModule(InteractModuleServer).unActiveInteract(ID);
			}
		}
	}

	public show() {
		let interval = setInterval(() => {
			if (this._trigger) {
				this._trigger.enabled = (true);
				clearInterval(interval);
			}
		}, 500);
	}
	protected addEntity(eGo: mw.GameObject) {
		getEn(eGo, this._monsterCfg.ID);
		const guid = eGo.gameObjectId;
		const attribute = ComponentSystem.getComponent(AttributeComponent, guid);
		attribute.addListen(AttributeEvent.unitDeath, this, this.death);
		attribute.registerAttrChangeEvent("damage", this, (newValue: number, oldValue: number) => {
			if (newValue > 0) {
				ComponentSystem.getComponent(BuffComponent, guid).applyBuffToSelf("SlowDown", 1);
				const sound = GameConfig.Music.getElement(this._monsterCfg?.hitSound);
				if (sound) {
					let playParam = undefined;
					if (sound?.MusicRange) {
						playParam = {
							innerRadius: sound.MusicRange[0],
							falloffDistance: sound.MusicRange[1],
						};
					}
					GameUtils.asyncUseAsset(
						sound.MusicGUID,
						SoundService.play3DSound,
						SoundService,
						sound.MusicGUID,
						eGo.worldTransform.position,
						1,
						sound.Music,
						playParam
					);
				}
			}
		});

		const findTarget = ComponentSystem.attach(FindTargetComponent, guid);
		findTarget.init(this._monsterCfg.ID);
		findTarget.addListen(FindTargetEvent.arrest, this, (findTarget, playerId: number) => {
			this.arrest(playerId);
		});
		this._fightEntityGuid = eGo.gameObjectId;
	}

	public hide() {
		Event.dispatchToLocal(EventsName.RemoveNightEntity, this._fightEntityGuid);
		if (SystemUtil.isServer()) {
			Event.dispatchToLocal(EventsName.RemoveEntity, this._fightEntityGuid);
		}
		this._fightEntityGuid = null;
	}
	public death(c: AttributeComponent, guid: string) {
		this.dead = true;
		const eGo = GameObject.findGameObjectById(guid);
		this.playDeathAnimation(eGo);
		const sound = GameConfig.Music.getElement(this._monsterCfg?.deathSound);
		if (sound) {
			SoundService.play3DSound(sound.MusicGUID, eGo.worldTransform.position, 1, sound.Music, {
				radius: sound.MusicRange[0],
				falloffDistance: sound.MusicRange[1],
			});
		}
		setTimeout(() => {
			this.onDeath();
		}, 0);
	}
	protected onDeath() { }
	protected playDeathAnimation(eGo: mw.GameObject) {
		// const deathAnimation = this._monsterCfg?.deathAnimation;
		// if (PlayerManagerExtesion.isNpc(eGo) && deathAnimation) {
		// 	GameUtils.asyncUseAsset(
		// 		deathAnimation,
		// 		() => {
		// 			let animation = PlayerManagerExtesion.loadAnimationExtesion(eGo, deathAnimation, SystemUtil.isServer());
		// 			if (animation) {
		// 				animation.loop = 1;
		// 				animation.play();
		// 			}
		// 		},
		// 		this
		// 	);
		// }
		// const effect = GameConfig.Effect.getElement(this._monsterCfg?.deathEffect);
		// if (effect) {
		// 	GameUtils.asyncUseAsset(
		// 		effect.EffectID,
		// 		EffectService.playEffectAtLocation,
		// 		EffectService,
		// 		effect.EffectID,
		// 		eGo.worldTransform.position,
		// 		effect.EffectTime,
		// 		effect.EffectRotate.toRotation(),
		// 		effect.EffectLarge
		// 	);
		// }
	}
}
const effectScale = new mw.Vector(1.3, 1.3, 1.6);
