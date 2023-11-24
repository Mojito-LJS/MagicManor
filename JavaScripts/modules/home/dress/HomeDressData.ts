import { MapEx } from "../../../utils/MapEx";

/**
 * 家园装饰数据
 */
export class DressInfoDB {
	public sign: string = "DressInfoDB";

	//家具id
	public id: number = 0;

	//配置id
	public cfgId: number = 0;

	//位置
	public pos: Array<number> = [];

	//旋转
	public rotate: Array<number> = [];

	//旋转偏移量
	public rotateVal: number = 0;

	//颜色id
	public colorId: number = 0;
}

/**
 * 家园装饰信息
 */
export class HomeDressInfo {
	public buildingID: number;

	public genId: number = 0;

	public martialInfos: MapEx.MapExClass<number> = {};

	public dressList: Array<DressInfoDB> = [];
}

/**
 * 家园装饰数据
 */
export class HomeDressData extends Subdata {
	@Decorator.persistence()
	public dressInfos: Array<HomeDressInfo> = [];

	protected onDataInit(): void {

	}

	protected initDefaultData(): void {
		this.dressInfos = [];
		this.save(false);
	}

	/**
	 * 设置区域材质
	 */
	public setAreaMartial(homeId: number, area: string, index: number, cfgId: number) {
		const dressInfo = this.dressInfos.find((info) => {
			return info.buildingID == homeId;
		});
		if (dressInfo) {
			MapEx.set(dressInfo.martialInfos, area + "_" + index, cfgId);
		}

		this.save(false);
	}

	/**
	 * 获取区域材质
	 * @param homeId
	 * @param area
	 * @param index
	 */
	public getAreaMartial(homeId: number, area: string, index: number): number {
		const dressInfo = this.dressInfos.find((info) => {
			return info.buildingID == homeId;
		});
		if (dressInfo) {
			if (MapEx.has(dressInfo.martialInfos, area + "_" + index)) {
				return MapEx.get(dressInfo.martialInfos, area + "_" + index);
			}
		}
		return 0;
	}

	/**
	 * 获取所有区域的材质信息
	 * @param homeId
	 * @returns
	 */
	public getAllAreaMartial(homeId: number): MapEx.MapExClass<number> {
		const dressInfo = this.dressInfos.find((info) => {
			return info.buildingID == homeId;
		});
		if (dressInfo) {
			return dressInfo.martialInfos;
		}
		return {};
	}

	/**
	 * 设置所有区域的材质信息
	 * @param homeId
	 * @param maps
	 */
	public setAllAreaMartials(homeId, maps: MapEx.MapExClass<number>) {
		const dressInfo = this.dressInfos.find((info) => {
			return info.buildingID == homeId;
		});
		if (dressInfo) {
			dressInfo.martialInfos = maps;
		}
	}

	/**
	 * 移除所有装饰根据家园id
	 * @param homeId
	 */
	public removeAllDressByHomeId(homeId: number) {
		const newList = [];

		this.dressInfos.forEach((e) => {
			if (e.buildingID == homeId) {
				return;
			}
			newList.push(e);
		});
		this.dressInfos = newList;

		this.save(false);
	}

	/**
	 * 获取所有装饰
	 * @param homeId
	 * @returns
	 */
	public getAllDressInfo(homeId: number): DressInfoDB[] {
		const dressInfo = this.dressInfos.find((info) => {
			return info.buildingID == homeId;
		});
		if (dressInfo) {
			return dressInfo.dressList;
		}
		return [];
	}

	/**
	 * 添加装饰
	 * @param homeId
	 * @param dressCfgId
	 * @param pos
	 * @param rotate
	 * @returns
	 */
	public addDress(homeId: number, dressCfgId: number, pos: Vector, rotate: Rotation, rotateVal: number): DressInfoDB {
		let dressInfo = this.dressInfos.find((info) => {
			return info.buildingID == homeId;
		});
		if (dressInfo) {
			const dress = new DressInfoDB();
			dress.id = dressInfo.genId;
			dress.cfgId = dressCfgId;
			dress.pos = [pos.x, pos.y, pos.z];
			dress.rotate = [rotate.x, rotate.y, rotate.z];
			dress.rotateVal = rotateVal;
			dressInfo.dressList.push(dress);
			dressInfo.genId++;
		} else {
			dressInfo = new HomeDressInfo();
			dressInfo.buildingID = homeId;
			const dress = new DressInfoDB();
			dress.id = dressInfo.genId;
			dress.cfgId = dressCfgId;
			dress.pos = [pos.x, pos.y, pos.z];
			dress.rotate = [rotate.x, rotate.y, rotate.z];
			dress.rotateVal = rotateVal;
			dressInfo.dressList.push(dress);
			dressInfo.genId++;
			dressInfo.martialInfos = {};
			this.dressInfos.push(dressInfo);
		}
		this.save(false);
		return dressInfo.dressList[dressInfo.dressList.length - 1];
	}

	/**
	 * 移除装饰
	 * @param homeId
	 * @param dressId
	 * @returns
	 */
	public removeDress(homeId: number, dressId: number): boolean {
		const dressInfo = this.dressInfos.find((info) => {
			return info.buildingID == homeId;
		});
		if (dressInfo) {
			const index = dressInfo.dressList.findIndex((dress) => {
				return dress.id == dressId;
			});
			if (index != -1) {
				dressInfo.dressList.splice(index, 1);
			}
			this.save(false);
			return true;
		}
		return false;
	}

	/**
	 * 更新装饰
	 * @param homeId
	 * @param dressId
	 * @param pos
	 * @param rotate
	 * @returns
	 */
	public updateDress(homeId: number, dressId: number, pos: Vector, rotate: Rotation, rotateVal: number): boolean {
		const dressInfo = this.dressInfos.find((info) => {
			return info.buildingID == homeId;
		});
		if (dressInfo) {
			const dress = dressInfo.dressList.find((dress) => {
				return dress.id == dressId;
			});
			if (dress) {
				dress.pos = [pos.x, pos.y, pos.z];
				dress.rotate = [rotate.x, rotate.y, rotate.z];
				dress.rotateVal = rotateVal;
				this.save(false);
				return true;
			}
		}
		return false;
	}

	/**
	 * 更新装饰颜色
	 * @param homeId
	 * @param dressId
	 * @param colorId
	 * @returns
	 */
	public updateDressColor(homeId: number, dressId: number, colorId: number): boolean {
		const dressInfo = this.dressInfos.find((info) => {
			return info.buildingID == homeId;
		});
		if (dressInfo) {
			const dress = dressInfo.dressList.find((dress) => {
				return dress.id == dressId;
			});
			if (dress) {
				dress.colorId = colorId;
				this.save(false);
				return true;
			}
		}
		return false;
	}
}
