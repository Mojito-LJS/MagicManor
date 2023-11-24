import { GameConfig } from "../../../config/GameConfig";
import { EventsName } from "../../../const/GameEnum";
import ComponentSystem from "../base/ComponentSystem";
import { AttributeComponent, AttributeEvent } from "../components/attribute/AttributeComponent";
import { BaseAttributeData } from "../components/attribute/AttributeData";
import { AttributeSet } from "../components/attribute/AttributeSet";
import { PlayerAttr } from "../components/attribute/PlayerAttr";
import BuffComponent from "../components/buff/BuffComponent";
import InfoComponent from "../components/info/InfoComponent";
import { TagComponent } from "../components/tag/TagComponent";
import { IdentifierTags } from "../components/tag/core/IdentifierTags";

export function createMonsterS(configId: number, guid: string) {
	const config = GameConfig.FightMonster.getElement(configId);

	const tag = ComponentSystem.attach(TagComponent, guid);
	const attribute = ComponentSystem.attach(AttributeComponent, guid);
	ComponentSystem.attach(BuffComponent, guid);
	const info = ComponentSystem.attach(InfoComponent, guid);

	info.configId = configId;
	const attr = new AttributeSet(new BaseAttributeData(), config.attrId);
	attribute.defaultAttributeSet = attr;
	tag.addTag(config.tags);
	setTimeout(() => {
		Event.dispatchToLocal(EventsName.EntityRevival, guid);
	}, 0);
	initMonster(attribute);
}

function initMonster(attribute: AttributeComponent) {
	attribute.addListen(
		AttributeEvent.hpChange,
		this,
		(attribute: AttributeComponent, difference: number, loc: mw.Vector, isCritical: boolean, fromSign: string) => {
			Event.dispatchToLocal(EventsName.SilverCoinAtNight, attribute.ownerSign, difference, loc, fromSign);
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
export function createPlayerS(playerId: number, configId: number, guid: string) {
	const tag = ComponentSystem.attach(TagComponent, guid);
	const attribute = ComponentSystem.attach(AttributeComponent, guid);
	ComponentSystem.attach(BuffComponent, guid);
	const info = ComponentSystem.attach(InfoComponent, guid);

	info.configId = configId;
	attribute.defaultAttributeSet = new AttributeSet(new PlayerAttr(), 1);
	tag.addTag(IdentifierTags.Player.Character);
}
