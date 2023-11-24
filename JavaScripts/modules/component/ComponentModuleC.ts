import { myCharacterGuid } from "../../ExtensionType";
import { GameConfig } from "../../config/GameConfig";
import { EventsName } from "../../const/GameEnum";
import { ComponentModuleDataHelper } from "./ComponentModuleDataHelper";
import { ComponentModuleS } from "./ComponentModuleS";
import ComponentSystem from "./base/ComponentSystem";
import { buildBuffDefWithConfig } from "./components/buff/base/BuffRegister";
import { createMonsterC, createPlayerC } from "./create/CreateC";

/**
 * Component模块Client端
 */
export class ComponentModuleC extends ModuleC<ComponentModuleS, null> {
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
		super.onStart();
		buildBuffDefWithConfig(GameConfig.FightBuff.getAllElement());
	}

	protected onEnterScene(sceneType: number): void {
		setTimeout(() => {
			this.server.net_Info(mw.Player.localPlayer);
		}, 1000);
	}

	protected onUpdate(dt: number): void {
		ComponentSystem.update(dt);
	}

	net_Info(attrSign: string[], attrV: number[], attrCfgId: number[], tagSign: string[], tagV: string[], infoSign: string[], infoV: number[]) {
		const signMap: { [key: string]: { info: number; tags: string[]; hp: number; configId: number } } = {};
		for (let index = 0; index < infoSign.length; index++) {
			const sign = infoSign[index];
			const v = infoV[index];
			if (signMap[sign]) {
				signMap[sign]["info"] = v;
			} else {
				signMap[sign] = { info: v, tags: [], hp: 0, configId: 0 };
			}
		}
		for (let index = 0; index < tagSign.length; index++) {
			const sign = tagSign[index];
			const v = tagV[index];
			if (signMap[sign]) {
				signMap[sign]["tags"] = v.split(",");
			} else {
				signMap[sign] = { info: 0, tags: v.split(","), hp: 0, configId: 0 };
			}
		}
		for (let index = 0; index < attrSign.length; index++) {
			const sign = attrSign[index];
			const v = attrV[index];
			if (signMap[sign]) {
				signMap[sign]["hp"] = v;
				signMap[sign]["configId"] = attrCfgId[index];
			} else {
				signMap[sign] = { info: 0, tags: [], hp: v, configId: attrCfgId[index] };
			}
		}
		for (const sign of Object.keys(signMap)) {
			const { info, tags, hp, configId } = signMap[sign];
			if (sign !== myCharacterGuid) {
				createMonsterC(info, sign, hp, tags);
			} else {
				createPlayerC(sign, tags);
			}
		}
	}

	net_SyncMonsterAll(guid: string[], configId: number[], hp: number[], tags: string[]) {
		for (let index = 0; index < guid.length; index++) {
			const sign = guid[index];
			createMonsterC(configId[index], sign, hp[index], tags[index].split(","));
		}
	}

	net_removeEntityByGuid(removeEntityGuid: string[]) {
		for (const guid of removeEntityGuid) {
			Event.dispatchToLocal(EventsName.RemoveNightEntity, guid);
		}
	}
}
