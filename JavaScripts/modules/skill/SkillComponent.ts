import { GeneralManager, } from '../../Modified027Editor/ModifiedStaticAPI';
import { GameConfig } from "../../config/GameConfig";
import { EventsName, PlayerStateType, SkillState } from "../../const/GameEnum";
import Component from "../component/base/Component";
import ComponentSystem, { component } from "../component/base/ComponentSystem";
import BuffComponent from "../component/components/buff/BuffComponent";
import BuffScript from "../component/components/buff/script/BuffScript";
import { IdentifierTags } from "../component/components/tag/core/IdentifierTags";
import { TagComponent } from "../component/components/tag/TagComponent";
import SkillBase from "./logic/SkillBase";
import SkillMgr from "./SkillMgr";

export enum SkillEvent {
	onHit = "onHit",
}

export type ISkillEvent = {
	onHit(entity: string, skillID: number);
};

@component(10)
export class SkillComponent extends Component<ISkillEvent, SkillEvent> {
	private _skillMap: Map<PlayerStateType, SkillBase[]> = new Map()
	private _callArr: any[] = []

	protected onAttach(): void {
		this.useUpdate = true;
		for (const element of SkillMgr.Inst.skillClassMap) {
			setTimeout(() => {
				this._callArr.push(() => {
					let skill = new element[1](element[0], this.ownerSign)
					skill.init()
					if (!this._skillMap.has(skill.disableState)) {
						this._skillMap.set(skill.disableState, []);
					}
					let arr = this._skillMap.get(skill.disableState);
					arr.push(skill)
				})
			}, 2000);
		}
		Event.addLocalListener(EventsName.PLAYER_STATE, (stateType: number, active: boolean) => {
			this.setState(stateType, active)
		})
	}

	protected onDetach(): void {
		this.useUpdate = false;
		this._callArr.length = 0;
		this._skillMap = new Map()
	}

	public findSkill(skillID: number): SkillBase {
		let skillbase: SkillBase = null
		this._skillMap.forEach(arr => {
			for (const skill of arr) {
				if (skill.skill == skillID) {
					skillbase = skill
					return;
				}
			}
		});
		return skillbase;
	}

	public setState(state: PlayerStateType, isActive: boolean) {
		if (this._skillMap.has(state)) {
			const arr = this._skillMap.get(state)
			for (const skill of arr) {
				if (isActive) skill.State = SkillState.Disable
				else if (skill.State == SkillState.Disable) skill.State = SkillState.Enable
			}
		}
	}

	public onHit(
		hitObj: string,
		buffName: string,
		damage: number,
		effectId: number,
		music: number,
		skillID: number,
		hitLocation?: mw.Vector
	): boolean {
		// const entity = this.entity as EntityC;
		let key: TagComponent = ComponentSystem.getComponent(TagComponent, hitObj); //= EntityManagerC.instance.getEntityByEnemy(entity, hitObj)
		if (key && key.hasAllExact(IdentifierTags.State.Fighting) && buffName != "") {
			BuffScript.addBuffApply(this.ownerSign, buffName, damage, hitObj, {});
			ComponentSystem.getComponent(BuffComponent, this.ownerSign)?.applyBuffToTarget(buffName, damage, hitObj);
			// 音效
			const sound = GameConfig.Music.getElement(music);
			if (sound) {
				const musicRange = sound.MusicRange;
				const range = musicRange
					? {
						innerRadius: musicRange[0],
						falloffDistance: musicRange[1],
					}
					: undefined;
				SoundService.play3DSound(sound.MusicGUID, hitLocation, 1, sound.Music, range);
			}
			//特效
			const effect = GameConfig.Effect.getElement(effectId);
			effect &&
				GeneralManager.rpcPlayEffectAtLocation(
					effect.EffectID,
					hitLocation,
					effect.EffectTime,
					effect.EffectRotate.toRotation(),
					effect.EffectLarge
				);
			this.sendMessage(SkillEvent.onHit, hitObj, skillID);
			return true;
		}
		if (buffName == "") return true;
		return false;
	}

	protected onUpdate(dt: number): void {
		if (this._callArr.length > 0) {
			this._callArr.pop()();
		}
		this._skillMap.forEach(arr => {
			for (const skill of arr) {
				skill.onUpdate(dt)
			}
		});
	}
}
