/**
 * @Author       : peiwen.chen
 * @Date         : 2023-03-02 18:00:37
 * @LastEditors  : peiwen.chen
 * @LastEditTime : 2023-03-02 18:58:19
 * @FilePath     : \fantasymagicschool\JavaScripts\modules\fighting\fly\ui\WidgetFly.ts
 * @Description  : 修改描述
 */

import { FlyBase, FlyGenerate, FlyIconGenerate } from "./FlyBase";

export enum FlyTimeType {
	/**飘字时间 (ms)*/
	Time,
	/**飘字的速度 */
	Speed,
}
export class WidgetFlyConfig {
	constructor(
		public content: string,
		public color: [number, number, number, number],
		public loc: mw.Vector,
		public offset: number,

		public size: { min: number; max: number } = { min: 24, max: 30 },
		public flyType: boolean = false,
		public timeType: FlyTimeType = FlyTimeType.Time,
		public typeValue?: number
	) {}
}
/**
 * AUTHOR: 命中不能缺你
 * TIME: 2022.11.16-17.22.22
 */

export default class WidgetFly<F extends FlyGenerate, I extends FlyIconGenerate> {
	/**默认时间 */
	private readonly DEFAULT_TIME: number = 800;

	/**默认速度 */
	private readonly DEFAULT_SPEED: number = 800;

	/**毫秒 */
	private readonly M: number = 1000;

	/**每种飘字的最大数量 */
	private readonly maxCount: number = 15;

	/**飘字缓存池 */
	private _tipPools: FlyBase<FlyGenerate>[] = [];

	public get tipPools(): FlyBase<FlyGenerate>[] {
		return this._tipPools;
	}

	private _iconTipPools: FlyBase<FlyIconGenerate>[] = [];

	public get iconTipPools(): FlyBase<FlyIconGenerate>[] {
		return this._iconTipPools;
	}

	private _nowIndex: number = 0;

	private _nowIconIndex: number = 0;

	public tweenGroup = new TweenGroup();
	// protected _view: T;

	constructor(
		fontItem: mw.TypeName<F>,
		iconItem: mw.TypeName<I>,
		onStart: (a: FlyBase<FlyGenerate>) => void,
		onEnd: (a: FlyBase<FlyGenerate>) => void
	) {
		setTimeout(() => {
			/**创建一个mw.TextBlock */
			for (let index = 0; index < this.maxCount; index++) {
				TimeUtil.delayExecute(() => {
					const item = FlyBase.create(fontItem);
					item.onStart.add(onStart);
					item.onEnd.add(onEnd);
					this._tipPools.push(item);
				}, index);
			}
			/**创建一个有背景的 */
			for (let index = 0; index < this.maxCount; index++) {
				TimeUtil.delayExecute(() => {
					const item = FlyBase.create(iconItem);
					item.onStart.add(onStart);
					item.onEnd.add(onEnd);
					this._iconTipPools.push(item);
				}, index);
			}
		}, 0);
	}

  createFont=(fontItem: mw.TypeName<F>,onStart,onEnd)=>{
    const item = FlyBase.create(fontItem);
    item.onStart.add(onStart);
    item.onEnd.add(onEnd);
    this._tipPools.push(item);
  }
  createIcon=(iconItem: mw.TypeName<I>,onStart,onEnd)=>{
    const item = FlyBase.create(iconItem);
    item.onStart.add(onStart);
    item.onEnd.add(onEnd);
    this._iconTipPools.push(item);
  }

	onHide() {
		for (const iterator of this._tipPools) {
			iterator.hide();
		}
		for (const iterator of this._iconTipPools) {
			iterator.hide();
		}
	}

	/**
	 * 显示飘字
	 * @param cfg 配置
	 * @returns
	 */
	getFly(cfg: WidgetFlyConfig, startPos?: mw.Vector2) {
		const { content, color, flyType, offset, size, timeType, typeValue } = cfg;
		const item = flyType ? this.getIcon() : this.getText();
		item.startPos.set(startPos);
		item.betweenPos.set(startPos);
		item.setEnd(offset);
		item.setText(content, color, size?.min);
		item.setTween(size, this.getTime(timeType, typeValue, offset), this.tweenGroup);
		return item;
	}

	/**获得一个纯文本的飘字  */
	private getText() {
		if (this._nowIndex === this._tipPools.length) {
			this._nowIndex = 0;
		}
		return this._tipPools[this._nowIndex++];
	}

	/**获得一个带图片的飘字 */
	private getIcon() {
		if (this._nowIconIndex === this._iconTipPools.length) {
			this._nowIconIndex = 0;
		}
		return this._iconTipPools[this._nowIconIndex++];
	}

	/**
	 * 获得飘字时间
	 * @param timeType 时间计算类型
	 * @param typeValue 类型的值
	 * @param offset 偏移
	 * @returns
	 */
	private getTime(timeType: FlyTimeType = FlyTimeType.Time, typeValue: number, offset: number) {
		switch (timeType) {
			case FlyTimeType.Time:
				if (typeValue) {
					return typeValue;
				}
				return this.DEFAULT_TIME;
			case FlyTimeType.Speed:
				if (typeValue) {
					return (offset * this.M) / typeValue;
				}
				return (offset * this.M) / this.DEFAULT_SPEED;

			default:
				return this.DEFAULT_TIME;
		}
	}
}
