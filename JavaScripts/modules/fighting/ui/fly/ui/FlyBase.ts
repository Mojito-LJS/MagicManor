/**
 * @Author       : peiwen.chen
 * @Date         : 2023-01-05 17:49:43
 * @LastEditors  : peiwen.chen
 * @LastEditTime : 2023-01-11 14:01:02
 * @FilePath     : \huntroyale\JavaScripts\ui\common\fly\FlyBase.ts
 * @Description  : 修改描述
 */
import Tween = mw.Tween;
export class FLyConfig {
	constructor(
		public size: number,

		public pos: mw.Vector2,

		public renderOpacity: number
	) {}
}
export interface FlyGenerate extends mw.UIScript {
	textFont: mw.TextBlock;
}
export interface FlyIconGenerate extends FlyGenerate {
	imgBg: mw.Image;
}
export class FlyBase<T extends FlyGenerate> {
	startPos: mw.Vector2 = mw.Vector2.zero;

	betweenPos: mw.Vector2 = mw.Vector.zero;

	endPos: mw.Vector2 = mw.Vector2.zero;

	time: number = 100;

	tween: Tween<FLyConfig>;

	readonly onEnd: mw.Action1<this> = new mw.Action1();

	readonly onStart: mw.Action1<this> = new mw.Action1();

	private _uiObject: mw.Widget;

	private _text: mw.TextBlock;

	private _view: T;

	public get view(): T {
		return this._view;
	}

	private constructor() {
		// mw.UIService.hideUI(this._view);
	}
	static create<T extends FlyGenerate>(viewCls: mw.TypeName<T>) {
		const e = new FlyBase<T>();
		e._view = mw.UIService.create(viewCls);
		e._uiObject = e._view.uiObject;
		e._text = e._view.textFont;
		return e;
	}

	setTween(size: { min: number; max: number }, time: number, tweenGroup: TweenGroup) {
		this.tween?.stop();
		const startCfg = new FLyConfig(size.min, this.startPos, 0.5);
		const endCfg = new FLyConfig(size.max, this.endPos, 1);
		this.time = time;
		// this.tween = new Tween({ z: size[0], x: this.startPos.x, y: this.startPos.y, renderOpacity: 0.5 }).to({ z: size[1], x: this.endPos.x, y: this.endPos.y, renderOpacity: 1 }, this.time).onStart(obj => {
		this.tween = new Tween(startCfg, tweenGroup)
			.to(endCfg, 500)
			.onStart(obj => {
				const slot = this._uiObject;
				slot.position = slot.position.set(obj.pos);
				this._uiObject.renderOpacity = obj.renderOpacity;
				this.startCall();
			})
			.onUpdate(obj => {
				const slot = this._uiObject;
				this._uiObject.renderOpacity = obj.renderOpacity;
				slot.position = slot.position.set(obj.pos);
				this._text.fontSize = obj.size;
			})
			.onComplete(obj => {
				new Tween(obj, tweenGroup)
					.to(new FLyConfig(size.max * 0.5, this.betweenPos, 0.5), 1000)
					.onUpdate(obj => {
						const slot = this._uiObject;
						this._uiObject.renderOpacity = obj.renderOpacity;
						slot.position = slot.position.set(obj.pos);
						this._text.fontSize = obj.size;
					})
					.onComplete(this.endCall)
					.onStop(this.endCall)
					.start();
			})
			.onStop(this.endCall);
	}

	private startCall = () => {
		this.onStart.call(this);
	};

	private endCall = () => {
		this.onEnd.call(this);
	};

	setEnd(offset: number) {
		this.endPos.set(MathUtil.randomFloat(-0.5, 0.5), MathUtil.randomFloat(-1, 0)).normalize().multiply(offset).add(this.startPos);
	}

	setText(content: string, color: [number, number, number, number] = [1, 1, 1, 1], size: number = 24) {
		const text = this._text;
		text.fontSize = size;
		const fontColor = text.fontColor;
		fontColor.r = color[0];
		fontColor.g = color[1];
		fontColor.b = color[2];
		fontColor.a = color[3];
		text.fontColor = fontColor;
		text.text = content;
		this._uiObject.position = this._uiObject.position.set(this.startPos);
	}

	start() {
		this.tween?.start();
	}

	hide() {
		this.tween?.stop();
		mw.UIService.hideUI(this._view);
	}
}
