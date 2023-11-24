/*
 * @Author: YuKun.Gao
 * @Date: 2023-05-12 17:23:52
 * @LastEditors: YuKun.Gao
 * @LastEditTime: 2023-05-31 17:05:28
 * @Description: file content
 * @FilePath: \catcompanion\JavaScripts\modules\room\VirtualRoomHelper.ts
 */

import { EventsName } from "../../const/GameEnum";
import { Editor } from "./dress/place/Editor";
import { ManorState } from "../building/BuildingModuleS";

export class BuildingInfo {
	public owner: number;

	public buildingGo: mw.GameObject;

	public buildingID: number;

	public cfgId: number;
}

export class BuildingHelper {
	private static _curBuilding: BuildingInfo;

	public static getCurBuilding(): BuildingInfo {
		return this._curBuilding;
	}

	public static init() {
		Event.addLocalListener(EventsName.ManorChange, (state: ManorState) => {
			if (state === ManorState.Visit) {
				Editor.Instance.leftEditorModel();
				this._curBuilding = null;
			}
		})
	}

	public static enterBuilding(info?: BuildingInfo) {
		if (!info) {
			Editor.Instance.leftEditorModel();
			this._curBuilding = null;
			return
		}
		this._curBuilding = info;
	}

	/**
	 * 是否在自己的房间
	 */
	public static inSelfBuilding(): boolean {
		return this._curBuilding !== null;
	}

	public static getAllDressAreas() {
		if (this._curBuilding == null) return;
		const areas: string[] = [];
		const dressArea = this._curBuilding.buildingGo.getChildByName("dressArea");
		const children = dressArea.getChildren();
		for (const child of children) {
			areas.push(child.name);
		}
		return areas
	}

	public static showDressArea(showArea: string) {
		if (this._curBuilding == null) return;
		const dressArea = this._curBuilding.buildingGo.getChildByName("dressArea");
		dressArea.setVisibility(mw.PropertyStatus.On);
		const children = dressArea.getChildren();
		children.forEach((e) => {
			if (e.name != showArea) {
				e.setVisibility(mw.PropertyStatus.Off);
				e.setCollision(mw.PropertyStatus.Off);
			} else {
				e.setVisibility(mw.PropertyStatus.On);
				e.setCollision(mw.PropertyStatus.On);
			}
		});
	}

	public static showAllDressArea() {
		if (this._curBuilding == null) return;
		const dressArea = this._curBuilding.buildingGo.getChildByName("dressArea");
		dressArea.setVisibility(mw.PropertyStatus.On);
		const children = dressArea.getChildren();
		children.forEach((e) => {
			e.setVisibility(mw.PropertyStatus.On);
			e.setCollision(mw.PropertyStatus.On);
		});
	}

	public static hideDressArea() {
		if (this._curBuilding == null) return;
		const dressArea = this._curBuilding.buildingGo.getChildByName("dressArea");
		dressArea.setVisibility(mw.PropertyStatus.Off);
		const children = dressArea.getChildren();
		children.forEach((e) => {
			e.setVisibility(mw.PropertyStatus.Off);
			e.setCollision(mw.PropertyStatus.Off);
		});
	}
}
