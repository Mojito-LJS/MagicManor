/**
 * @Author       : peiwen.chen
 * @Date         : 2023-03-15 18:45:26
 * @LastEditors  : peiwen.chen
 * @LastEditTime : 2023-03-22 09:51:10
 * @FilePath     : \fantasymagicschool\JavaScripts\modules\fighting\core\attribute\AttributeData.ts
 * @Description  : 修改描述
 */

import { IFightAttrElement } from "../../../../config/FightAttr";


/**同步的属性类 */
// @Core.Type
export class AttributeChangeRpc {
	/**属性名 */
	// @Core.Property()
	public attributeName: string;
	// @Core.Property()
	public currentValue: number;
	// @Core.Property()
	public changeValue: number;
	// @Core.Property()
	public fromSign: string;
	// @Core.Property()
	public isBase: boolean = false;
	constructor(attributeName: string, currentValue: number, changeValue: number, fromSign: string, isBase: boolean = false) {
		this.attributeName = attributeName;
		this.currentValue = currentValue;
		this.changeValue = changeValue;
		this.fromSign = fromSign;
		this.isBase = isBase;
	}
}
@mw.Serializable
export class AllAttributeChangeRpc {
	/**属性名 */
	@mw.Property()
	public attributeName: string;
	@mw.Property()
	public current: number;
	@mw.Property()
	public base: number;
	constructor(attributeName: string, currentValue: number, changeValue: number) {
		this.attributeName = attributeName;
		this.current = currentValue;
		this.base = changeValue;
	}
}
export class BaseAttributeData {
	/**
	 * 血量
	 */
	hp: number = 100;

	/**
	 * 最大血量
	 */
	maxHp: number = 100;
	/**
	 * 基础攻击力
	 */
	atk: number = 10;
	/**
	 * 移动速度
	 */
	speed: number = 100;
	/**
	 * 伤害值
	 */
	// damage: number = 0;

	// /**
	//  * 暴击伤害倍率
	//  */
	// criticalDamageRatio: number = 1.5;

	// /**
	//  * 暴击概率
	//  */
	// criticalRatio: number = 0;
	// /**
	//  * 伤害加成系数
	//  */
	// damageRatio: number = 0;

	// /**
	//  * 伤害减免系数
	//  */
	// decreaseDamageRatio: number = 0;
	// /**
	//  * 防御力
	//  */
	// defense: number = 0;

	/**
	 * 恢复的hp
	 */
	// recover: number = 0;

	// /**
	//  * 额外生命恢复系数
	//  */
	// recoverHpRatio: number = 0;
}
export function initData<T extends BaseAttributeData>(data: T, value: IFightAttrElement) {
	const attrEntries = Object.entries(value);
	for (const [key, val] of attrEntries) {
		if (Object.prototype.hasOwnProperty.call(data, key)) {
			data[key] = val;
		}

		if (key.match("max")) {
			let newKey = key.replace("max", "");
			newKey = newKey.replace(newKey[0], newKey[0].toLowerCase());
			if (Object.prototype.hasOwnProperty.call(data, newKey)) {
				data[newKey] = val;
			}
		}
	}
	return data;
}
