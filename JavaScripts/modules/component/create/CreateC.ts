import { myCharacterGuid } from "../../../ExtensionType";
import { GameConfig } from "../../../config/GameConfig";
import { EventsName } from "../../../const/GameEnum";
import { SkillComponent, SkillEvent } from "../../skill/SkillComponent";
import ComponentSystem from "../base/ComponentSystem";
import { AttributeComponent, AttributeEvent } from "../components/attribute/AttributeComponent";
import { BaseAttributeData } from "../components/attribute/AttributeData";
import { AttributeSet } from "../components/attribute/AttributeSet";
import BuffComponent from "../components/buff/BuffComponent";
import HeadComponent from "../components/head/HeadComponent";
import InfoComponent from "../components/info/InfoComponent";
import { TagComponent } from "../components/tag/TagComponent";

export function createMonsterC(configId: number, guid: string, hp: number, tags?: string[]) {
	const config = GameConfig.FightMonster.getElement(configId);
	const configM = GameConfig.Monster.getElement(configId);

	const tag = ComponentSystem.attach(TagComponent, guid);
	const attribute = ComponentSystem.attach(AttributeComponent, guid);
	const info = ComponentSystem.attach(InfoComponent, guid);
	// ComponentSystem.attach(SkillComponent, guid);

	const attr = new AttributeSet(new BaseAttributeData(), config.attrId);
	attribute.defaultAttributeSet = attr;
	attribute.setAttributeCurrentValue("hp", hp, guid);
	if (!tags) {
		tags = config.tags;
	}
	tag.addTag(tags);
	info.configId = configId;
	ComponentSystem.attach(HeadComponent, guid);

	initMonster(attribute);
}

export function createMonsterOnlyC(configId: number, guid: string) {
	const config = GameConfig.FightMonster.getElement(configId);

	const tag = ComponentSystem.attach(TagComponent, guid);
	const attribute = ComponentSystem.attach(AttributeComponent, guid);
	const buff = ComponentSystem.attach(BuffComponent, guid);
	const info = ComponentSystem.attach(InfoComponent, guid);
	// ComponentSystem.attach(SkillComponent, guid);

	const attr = new AttributeSet(new BaseAttributeData(), config.attrId);
	attribute.defaultAttributeSet = attr;
	tag.addTag(config.tags);
	info.configId = configId;

	ComponentSystem.attach(HeadComponent, guid);

	initMonster(attribute, true);
}

function initMonster(attribute: AttributeComponent, isOnlyC: boolean = false) {
	attribute.addListen(
		AttributeEvent.hpChange,
		this,
		(attribute: AttributeComponent, difference: number, loc: mw.Vector, isCritical: boolean, fromSign: string) => {
			if (fromSign === myCharacterGuid) {
				Event.dispatchToLocal(EventsName.HpChangeShowFly, attribute.defaultAttributeSet.currentData, difference, loc, isCritical);
			}
			Event.dispatchToLocal(EventsName.SilverCoinAtNight, attribute.ownerSign, difference, loc, fromSign);
			if (isOnlyC) {
				Event.dispatchToLocal(EventsName.FightCourse);
			}
		}
	);
	attribute.addListen(AttributeEvent.unitDeath, this, (attr, entity: string, fromSign: string) => {
		console.log("[ 怪物死亡 ] >", entity);
		Event.dispatchToLocal(EventsName.MonsterDead, entity, fromSign);
		setTimeout(() => {
			Event.dispatchToLocal(EventsName.RemoveNightEntity, entity);
		}, 0);
	});
}

export function createPlayerC(guid: string, tags: string[]) {
	const tag = ComponentSystem.attach(TagComponent, guid);
	const attribute = ComponentSystem.attach(AttributeComponent, guid);
	ComponentSystem.attach(InfoComponent, guid);
	const skill = ComponentSystem.attach(SkillComponent, guid);

	const attr = new AttributeSet(new BaseAttributeData(), 1);
	attribute.defaultAttributeSet = attr;
	tag.addTag(tags);
	skill.addListen(SkillEvent.onHit, this, (skill: SkillComponent, entity: string, skillId: number) => {

	});
}
