import { GameConfig } from "../../config/GameConfig";
import { EventsName } from "../../const/GameEnum";
import { ComponentModuleC } from "./ComponentModuleC";
import { ComponentModuleDataHelper, MonsterSyncGame } from "./ComponentModuleDataHelper";
import { initScript } from "./base/BaseScript";
import ComponentSystem from "./base/ComponentSystem";
import { AttributeComponent } from "./components/attribute/AttributeComponent";
import { buildBuffDefWithConfig } from "./components/buff/base/BuffRegister";
import InfoComponent from "./components/info/InfoComponent";
import { TagComponent } from "./components/tag/TagComponent";
import { createPlayerS } from "./create/CreateS";

/**
 * Component模块Server端
 */
export class ComponentModuleS extends ModuleS<ComponentModuleC, null> {
	private _removeSing: string[] = [];
	private _revivalEntity: MonsterSyncGame = new MonsterSyncGame();
	/**
	 * 创建模块,这时候只能调用本模块内容进行初始化
	 */
	override onAwake(): void {
		super.onAwake();
	}

	/**
	 * 开始模块,可以进行模块间的调用
	 */
	override onStart(): void {
		buildBuffDefWithConfig(GameConfig.FightBuff.getAllElement());
		initScript(() => { });
		Event.addLocalListener(EventsName.EntityRevival, this.syncEntityRevival);
		Event.addLocalListener(EventsName.RemoveEntity, (sign: string) => {
			this._removeSing.push(sign);
		});
	}
	protected onUpdate(dt: number): void {
		ComponentSystem.update(dt);
		if (this._removeSing.length > 0) {
			this.removeEntityByGuid(this._removeSing);
			this._removeSing.length = 0;
		}
		if (this._revivalEntity.guid.length > 0) {
			this.syncRevivalMonster(this._revivalEntity);
			this._revivalEntity.guid.length = 0;
			this._revivalEntity.configId.length = 0;
			this._revivalEntity.guid.length = 0;
			this._revivalEntity.hp.length = 0;
		}
	}
	protected onPlayerLeft(player: mw.Player): void {
		Event.dispatchToLocal(EventsName.RemoveNightEntity, player.character.gameObjectId);
		// ComponentSystem.detach(player.character.guid);
	}
	/**
	 * 当复活后去向客户端同步
	 * @param entity
	 */
	private syncEntityRevival = (sign: string) => {
		const attribute = ComponentSystem.getComponent(AttributeComponent, sign);
		const info = ComponentSystem.getComponent(InfoComponent, sign);
		const tag = ComponentSystem.getComponent(TagComponent, sign);
		this._revivalEntity.tags.push(tag.tags.join(","));
		this._revivalEntity.guid.push(sign);
		this._revivalEntity.hp.push(attribute.getAttributeValue("hp"));
		this._revivalEntity.configId.push(info.configId);
	};

	public syncRevivalMonster(monsterEntity: MonsterSyncGame) {
		const { guid, configId, hp, tags } = monsterEntity;
		this.getAllClient().net_SyncMonsterAll(guid, configId, hp, tags);
	}

	public removeEntityByGuid(removeEntityGuid: string[]) {
		this.getAllClient().net_removeEntityByGuid(removeEntityGuid);
	}

	/**
	 * 同步组件信息
	 * @param player
	 */
	public net_Info(player?: mw.Player) {
		createPlayerS(player.playerId, 1, player.character.gameObjectId);
		const guid = mw.Player.getAllPlayers()
			.map(v => v.character.gameObjectId)
			.filter(v => v !== player.character.gameObjectId);
		const attributes = ComponentSystem.getComponent(AttributeComponent).filter(v => !guid.includes(v.ownerSign));
		const tags = ComponentSystem.getComponent(TagComponent).filter(v => !guid.includes(v.ownerSign));
		const infos = ComponentSystem.getComponent(InfoComponent).filter(v => !guid.includes(v.ownerSign));

		const attrSign = attributes.map(v => v.ownerSign);
		const attrV = attributes.map(v => v.getAttributeValue("hp"));
		const attrCfgId = attributes.map(v => v.defaultAttributeSet.configId);

		const tagSign = tags.map(v => v.ownerSign);
		const tagV = tags.map(v => v.tags.join(","));

		const infoSign = infos.map(v => v.ownerSign);
		const infoV = infos.map(v => v.configId);

		this.getClient(player).net_Info(attrSign, attrV, attrCfgId, tagSign, tagV, infoSign, infoV);
	}
}
