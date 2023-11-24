
import SkillBase from "../logic/SkillBase";

/**
 * @Author       : 田可成
 * @Date         : 2023-03-15 18:30:31
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-05-05 13:21:52
 * @FilePath     : \mollywoodschool\JavaScripts\modules\skill\bullettrriger\BulletTrrigerBase.ts
 * @Description  :
 */
export abstract class BulletTrrigerBase {
	protected _obj: mw.GameObject;
	protected _bulletID: string;
	protected _skill: SkillBase;
	protected _buffName: string;
	protected _damage: number;
	protected _trrigerConfig: string;
	protected _effect: number = 0;
	protected _music: number = 0;
	protected _isOwn: boolean = true;
	protected _type: number;
	protected _hitObj: string[] = [];
	protected _character: mw.Character;
	protected _start: mw.Vector = mw.Vector.zero
	private _timeout: number;
	public isActive: boolean = false;

	public init(
		obj: mw.GameObject,
		bulletID: string,
		life: number,
		skill: SkillBase,
		buffName: string,
		damage: number,
		trrigerConfig?: string,
		isOwn?: boolean
	) {
		this._obj = obj;
		this._obj.setVisibility(mw.PropertyStatus.On);
		this._bulletID = bulletID;
		this._buffName = buffName;
		this._damage = damage;
		this._trrigerConfig = trrigerConfig;
		this._isOwn = isOwn;
		this._hitObj.length = 0;
		this.isActive = true;
		this._character = Player.localPlayer.character;
		this._skill = skill
		if (this._timeout) clearTimeout(this._timeout);
		this._timeout = setTimeout(() => {
			this.deActive();
		}, life * 1000);
	}

	protected deActive() {
		this._hitObj.length = 0;
		this.isActive = false;
		this._obj.setVisibility(mw.PropertyStatus.Off);
		this._start.set(mw.Vector.zero)
		if (this._timeout) clearTimeout(this._timeout);
	}

	protected hitAnything(res: mw.GameObject[]) {
		for (let index = 0; index < res.length; index++) {
			const element = res[index];
			if (element instanceof mw.Trigger || element.gameObjectId == this._character.gameObjectId || this._hitObj.includes(element.gameObjectId)) {
				continue;
			}
			this._hitObj.push(element.gameObjectId);
			if (this._type == 1) break;
			else {
				if (this._isOwn) this._skill.onHit(element.gameObjectId, this._buffName, this._damage, this._effect, this._music, this._obj.worldTransform.position);
			}
		}
		if (this._type == 1 && this._hitObj.length > 0) {
			if (this._isOwn && this._skill.onHit(this._hitObj[0], this._buffName, this._damage, this._effect, this._music, this._obj.worldTransform.position)) {
				this.deActive();
			}
		}
	}
	public abstract update(dt: number);
}
