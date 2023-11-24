import BuildingModuleS from "../../building/BuildingModuleS";
import { HomeDressData } from "./HomeDressData";
import { HomeDressModuleC } from "./HomeDressModuleC";

export class HomeDressModuleS extends ModuleS<HomeDressModuleC, HomeDressData> {
	clearInteract(ownerId: number) {
		const itemKeys = [...this._interactMap.keys()];

		const res = itemKeys.filter((e) => {
			return e.indexOf(`${ownerId}-`) == 0;
		});
		for (const iterator of res) {
			this._interactMap.delete(iterator);
		}
	}

	net_requestInteractListState(signs: string[]) {
		const itemEntries = this._interactMap.entries();
		const res = [];
		for (const [sign, isActive] of itemEntries) {
			if (signs.indexOf(sign) == -1) continue;
			res.push([sign, isActive]);
		}
		return JSON.stringify(res);
	}

	/**
	 * 请求玩家房间装饰列表
	 * @param ownerId
	 * @returns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public net_RequestDressList(ownerId: number, homeId: number): string {
		const db = this.getPlayerData(ownerId);
		if (!db) {
			return JSON.stringify([]);
		}
		let res = null;
		db.dressInfos.forEach((e) => {
			if (e.buildingID == homeId) {
				e.dressList.forEach((dress) => {
					dress.sign = `${ownerId}-${homeId}-${dress.id}-${dress.cfgId}`;
				});
				res = e.dressList;
			}
		});
		if (!res) {
			return JSON.stringify([]);
		}
		//TODO后续要优化这里
		const content = JSON.stringify(res);
		return content;
	}

	/**
	 * 请求玩家房间材质列表
	 * @param ownerId
	 * @returns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public net_RequestMartialList(ownerId: number, buildingID: number): string {
		const db = this.getPlayerData(ownerId);

		if (!db) {
			return JSON.stringify([]);
		}
		let res = null;
		db.dressInfos.forEach((e) => {
			if (e.buildingID == buildingID) {
				res = e.martialInfos;
			}
		});
		if (!res) {
			return JSON.stringify([]);
		}
		//TODO后续要优化这里
		const content = JSON.stringify(res);
		return content;
	}

	/**
	 * 客户端请求安装或更新装饰
	 * @param cfgId
	 * @param worldLocation
	 * @param worldRotation
	 * @param isBuy
	 * @param dressId
	 * @returns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public net_InstallOrUpdateDress(
		buildingID: number,
		cfgId: number,
		ownerId: number,
		worldLocation: Vector,
		worldRotation: Rotation,
		rotateVal: number,
		dressId: number
	): boolean {
		if (ownerId != this.currentPlayerId) {
			logI("不是自己房间无法更新装饰");
			return false;
		}
		const playerId = ownerId;
		const manorPlayers = ModuleService.getModule(BuildingModuleS).getManorPlayers(playerId);
		if (dressId == 0) {
			const dress = this.currentData.addDress(buildingID, cfgId, worldLocation, worldRotation, rotateVal);
			dressId = dress.id;
		} else {
			this.currentData.updateDress(buildingID, dressId, worldLocation, worldRotation, rotateVal);
		}

		for (const player of manorPlayers) {
			this.getClient(player).net_UpdateDress(
				dressId,
				cfgId,
				worldLocation,
				worldRotation,
				rotateVal,
				0,
				`${playerId}-${buildingID}-${dressId}-${cfgId}`
			);
		}
		return true;
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	public net_ChangeDressColor(buildingID: number, dressId: number, color: number, ownerId: number): boolean {
		if (ownerId != this.currentPlayerId) {
			logI("不是自己房间无法更新装饰");
			return false;
		}

		const playerId = ownerId;
		const manorPlayers = ModuleService.getModule(BuildingModuleS).getManorPlayers(playerId);
		this.currentData.updateDressColor(buildingID, dressId, color);

		for (const player of manorPlayers) {
			this.getClient(player).net_UpdateDressColor(dressId, color);
		}
		return true;
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	public net_SetMartialByArea(buildingID: number, area: string, index: number, cfgId: number, ownerId: number): boolean {
		if (ownerId != this.currentPlayerId) {
			logI("不是自己房间无法更新装饰");
			return false;
		}

		//TODO后续要添加金币校验

		const playerId = ownerId;
		const manorPlayers = ModuleService.getModule(BuildingModuleS).getManorPlayers(playerId);
		this.currentData.setAreaMartial(buildingID, area, index, cfgId);

		for (const player of manorPlayers) {
			this.getClient(player).net_UpdateMartial(cfgId, index);
		}

		return true;
	}

	/**
	 * 客户端请求出售装饰
	 * @param dressId
	 * @returns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public net_SellDress(buildingID: number, dressId: number, ownerId: number): boolean {
		if (ownerId != this.currentPlayerId) {
			logI("不是自己房间无法删除装饰");
			return false;
		}

		const playerId = ownerId;
		const manorPlayers = ModuleService.getModule(BuildingModuleS).getManorPlayers(playerId);
		this.currentData.removeDress(buildingID, dressId);

		for (const player of manorPlayers) {
			this.getClient(player).net_DeleteDress(dressId);
		}
		return true;
	}

	/**
	 * 出售所有房间装饰
	 * @param homeId
	 * @param ownerId
	 */
	public sellAllDress(homeId: number, ownerId: number) {
		const db = this.getPlayerData(ownerId);
		const allDress = db.getAllDressInfo(homeId);

		//TODO:处理金币

		db.removeAllDressByHomeId(homeId);
	}

	private _interactMap: Map<string, boolean> = new Map();

	net_interact(index: number, sign: string, isActive: boolean) {
		const myPlayerId = this.currentPlayerId;
		const [playerId, homeId, dressId] = sign.split("-");
		const playerID = parseInt(playerId);
		const manorPlayers = ModuleService.getModule(BuildingModuleS).getManorPlayers(playerID);
		this._interactMap.set(`${sign}|${index}`, isActive);
		for (const player of manorPlayers) {
			if (player === myPlayerId) return;
			this.getClient(player).net_interact(index, sign, isActive);
		}
	}
}
