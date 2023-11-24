import { BaseComponent } from "../../base/Component";
import { TagComponent } from "../tag/TagComponent";
import { BaseAttributeData } from "./AttributeData";
import { AttrSetSource } from "./aggregator/AttrSetSource";
export interface IAttributeSet {
	/**属性集合的名字,特别的是当一个对象拥有多个属性集合时，需要使用该对象做区分*/
	setName: string;

	owner: IAttributeSetOwner;
	currentData: BaseAttributeData;
	clear(): void;
	/**
	 * buff生效前调用
	 * @param buff
	 * @param attributeName
	 * @param value
	 */
	preBuffExecute(buff: AttrSetSource, attributeName: string, value: number): boolean;

	/**
	 * 当一条属性的currentValue将要被修改时候回调该函数
	 * @param attributeName 被修改的属性名
	 * @param value 期望值
	 * @return 实际值
	 */
	preAttributeChange(attributeName: string, value: number): number;

	/**
	 * 当一条属性的baseValue将要被修改时候回调该函数
	 * @param attributeName 被修改的属性名
	 * @param value 期望值
	 * @return 实际值
	 */
	preAttributeBaseChange(attributeName: string, value: number): number;

	/**
	 * 当一条属性的currentvalue被修改后回调函数
	 * @param attributeName 属性名
	 * @param oldValue 被修改前的值
	 * @param newValue 被修改后的值
	 */
	postAttributeChange(attributeName: string, oldValue: number, newValue: number): void;

	/**
	 * 当一条属性的baseValue被修改后回调函数
	 * @param attributeName 属性名
	 * @param oldValue 被修改前的值
	 * @param newValue 被修改后的值
	 */
	postAttributeBaseChange(attributeName: string, oldValue: number, newValue: number): void;

	/**
	 * 获取对应属性的当前值
	 * 如果没有对应的属性，则返回0
	 * @param attributeName
	 * @returns
	 */
	getNumericValue(name: string): number;
	/**
	 * 修改对应属性的当前值
	 * @param newValue 新值
	 * @param attributeName 属性名
	 * @param fromSign 修改来源
	 */
	setNumericValue(newValue: number, attributeName: string, fromSign: string): number;
	/**
	 * 获取对应属性的基础值
	 * 如果没有对应的属性，则返回0
	 * @param attributeName
	 * @returns
	 */
	getBaseValue(name: string): number;
	/**
	 * 修改对应属性的基础值
	 * @param newValue 新值
	 * @param attributeName 属性名
	 * @param fromSign 修改来源
	 */
	setBaseValue(newValue: number, attributeName: string, fromSign: string): number;
}

export interface IDrawable {
	draw(): void;
}

export interface IAttributeSetOwner extends BaseComponent {
  tag: TagComponent
	preAttributeBaseChange(attributeName: string, value: number): unknown;
	postAttributeChange(attributeName: string, oldValue: number, newValue: number, fromSign: string): unknown;
	postAttributeBaseChange(attributeName: string, oldValue: number, newValue: number, fromSign: string): unknown;
	preAttributeChange(attributeName: string, value: number): unknown;
	/**
	 * 设置基本属性
	 * @param attributeName 属性名字
	 * @param newValue  该属性的新值
	 * @param attributeSet 拥有该属性的属性集合
	 *
	 */
	setAttributeBaseValue(attributeName: string, newValue: number, fromSign: string);

	/**
	 * 获取某个属性集合指定属性的基础值
	 * @param attributeName 属性名
	 * @param attributeSet 属性集合
	 */
	getAttributeBaseValue(attributeName: string, attributeSet: IAttributeSet);
}
