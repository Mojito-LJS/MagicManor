import SkillBase from "../logic/SkillBase";
import { BulletTrrigerBase } from "./BulletTrrigerBase";
import { registerBulletTrriger } from "./BulletTrrigerMgr";

/**
 * @Author       : 田可成
 * @Date         : 2023-03-16 18:23:18
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-05-04 18:28:30
 * @FilePath     : \mollywoodschool\JavaScripts\modules\skill\bullettrriger\CircularBulletTrriger.ts
 * @Description  : 
 */
@registerBulletTrriger()
export class CircularBulletTrriger extends BulletTrrigerBase {
    private _movex: number = 0
    private _movey: number = 0
    private _movez: number = 0
    private _r: number = 1
    private _interval: number = 0

    public init(obj: mw.GameObject, bulletID: string, life: number, skill: SkillBase, buffName: string, damage: number, trrigerConfig?: string, isOwn?: boolean) {
        super.init(obj, bulletID, life, skill, buffName, damage, trrigerConfig, isOwn)
        trrigerConfig = trrigerConfig.split("movex=")[1]
        this._movex = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        trrigerConfig = trrigerConfig.split("movey=")[1]
        this._movey = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        trrigerConfig = trrigerConfig.split("movez=")[1]
        this._movez = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        trrigerConfig = trrigerConfig.split("r=")[1]
        this._r = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        trrigerConfig = trrigerConfig.split("type=")[1]
        this._type = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        trrigerConfig = trrigerConfig.split("interval=")[1]
        this._interval = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        trrigerConfig = trrigerConfig.split("effect=")[1]
        this._effect = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        this._music = Number(trrigerConfig.split("music=")[1]) || 50
    }

    public update(dt: number) {
        this._start = this._obj.worldTransform.position.clone()
        this._start.x += this._movex; this._start.y += this._movey; this._start.z += this._movez
        const res = QueryUtil.sphereOverlap(this._start, this._r * 100, false, this._hitObj, false, this._character)
        this.hitAnything(res)
    }
}