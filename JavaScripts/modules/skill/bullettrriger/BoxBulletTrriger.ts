import { GeneralManager, } from '../../../Modified027Editor/ModifiedStaticAPI';
import SkillBase from "../logic/SkillBase";
import { BulletTrrigerBase } from "./BulletTrrigerBase";
import { registerBulletTrriger } from "./BulletTrrigerMgr";

@registerBulletTrriger()
export class BoxBulletTrriger extends BulletTrrigerBase {
    private _movex: number = 0
    private _movey: number = 0
    private _movez: number = 0
    private _x: number = 1
    private _y: number = 1
    private _z: number = 1
    private _interval: number = 0
    private _end: mw.Vector = mw.Vector.zero


    public init(obj: mw.GameObject, bulletID: string, life: number, skill: SkillBase, buffName: string, damage: number, trrigerConfig?: string, isOwn?: boolean) {
        super.init(obj, bulletID, life, skill, buffName, damage, trrigerConfig, isOwn)
        trrigerConfig = trrigerConfig.split("movex=")[1]
        this._movex = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        trrigerConfig = trrigerConfig.split("movey=")[1]
        this._movey = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        trrigerConfig = trrigerConfig.split("movez=")[1]
        this._movez = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        trrigerConfig = trrigerConfig.split("x=")[1]
        this._x = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(","))) / 2
        trrigerConfig = trrigerConfig.split("y=")[1]
        this._y = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(","))) / 2
        trrigerConfig = trrigerConfig.split("z=")[1]
        this._z = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(","))) / 2
        trrigerConfig = trrigerConfig.split("type=")[1]
        this._type = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        trrigerConfig = trrigerConfig.split("interval=")[1]
        this._interval = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        trrigerConfig = trrigerConfig.split("effect=")[1]
        this._effect = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        this._music = Number(trrigerConfig.split("music=")[1]) || 50
    }

    public update(dt: number) {
        const forward = this._obj.worldTransform.getForwardVector()
        const forward2 = this._obj.worldTransform.getForwardVector().normalized.multiply(this._movex)
        const right = this._obj.worldTransform.getRightVector().normalized.multiply(this._movey)
        if (this._start.x == 0 && this._start.y == 0 && this._start.z == 0) this._start.set(this._obj.worldTransform.position.clone().add(right).add(forward2))
        else this._start.set(this._end)
        this._end.x = this._start.x + forward.x * this._x * 100;
        this._end.y = this._start.y + forward.y * this._x * 100
        this._end.z = this._start.z + forward.z * this._x * 100
        const res = GeneralManager.modiftboxOverlap(this._start, this._end, this._y * 100, this._z * 100, false, this._hitObj, false, this._character)
        this.hitAnything(res)
    }
}