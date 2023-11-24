import { BaseAttributeSet } from "../AttributeSet";
import { AttrSetSource } from "./AttrSetSource";

export enum ModifierOp {
	/**
	 * 增加
	 */
	Add,

	/**
	 * 乘
	 */
	Multiply,

	/**
	 * 除
	 */
	Divide,

	/**
	 * 覆盖
	 */
	Override,

	/**
	 * 占位符
	 */
	Max,
}

export type ModifierCal = <T extends BaseAttributeSet>(this: AttrSetSource, attributeSet: T) => number;

export interface IModifiers {
	// fullName: string;
	/**属性名 */
	attributeName: string;
	/**属性集合的名字 */
	// attributeSetName: string;
	/**修改方式 */
	modifierOp: ModifierOp;
	/**buff触发条件 */
	depends?: string[];
	isBase?: boolean;
	calculate: ModifierCal;
}
