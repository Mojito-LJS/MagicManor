import { Class } from "../../../const/GlobalData";
import { bulletClass } from "../../../ExtensionType";
import SkillBase from "../logic/SkillBase";
import { BulletTrrigerBase } from "./BulletTrrigerBase";

/**
 * @Author       : 田可成
 * @Date         : 2023-03-08 14:41:20
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-05-05 11:42:14
 * @FilePath     : \mollywoodschool\JavaScripts\modules\skill\bullettrriger\BulletTrrigerMgr.ts
 * @Description  : 
 */
export default class BulletTrrigerMgr {
    private _myBulletMap: Map<string, BulletTrrigerBase> = new Map()
    private _otherBulletMap: Map<string, BulletTrrigerBase> = new Map()
    private static _instance: BulletTrrigerMgr;

    public static get instance() {
        if (!this._instance) {
            this._instance = new BulletTrrigerMgr();
        }
        return this._instance;
    }

    public createBullet(obj: mw.GameObject, bulletID: string, life: number, skill: SkillBase, buffName: string, damage: number, trrigerConfig: string) {
        let newBulletTrriger: BulletTrrigerBase
        const config = trrigerConfig.split(":")
        if (!this._myBulletMap.has(obj.gameObjectId)) {
            newBulletTrriger = new (bulletClass.get(config[0]))()
            this._myBulletMap.set(obj.gameObjectId, newBulletTrriger)
        } else {
            newBulletTrriger = this._myBulletMap.get(obj.gameObjectId)
        }
        newBulletTrriger.init(obj, bulletID, life, skill, buffName, damage, config[1], true)
    }

    public createOtherBullet(obj: mw.GameObject, bulletID: string, life: number, skill: SkillBase, buffName: string, damage: number, trrigerConfig: string) {
        let newBulletTrriger: BulletTrrigerBase
        const config = trrigerConfig.split(":")
        if (!this._otherBulletMap.has(obj.gameObjectId)) {
            newBulletTrriger = new (bulletClass.get(config[0]))()
            this._otherBulletMap.set(obj.gameObjectId, newBulletTrriger)
        } else {
            newBulletTrriger = this._otherBulletMap.get(obj.gameObjectId)
        }
        newBulletTrriger.init(obj, bulletID, life, skill, buffName, damage, config[1], false)
    }

    private _updateTime: number = 0
    public update(dt: number) {
        //TODO：如有性能问题就改为每5帧检测
        // if (++this._updateTime % 3 != 0) return;
        for (const key of this._myBulletMap) {
            if (key[1].isActive) key[1].update(dt)
        }
        for (const key of this._otherBulletMap) {
            if (key[1].isActive) key[1].update(dt)
        }
    }
}
export function registerBulletTrriger() {
    return function <T extends BulletTrrigerBase>(constructor: Class<T>) {
        bulletClass.set(constructor.name, constructor)
    };
}
BulletTrrigerMgr.instance