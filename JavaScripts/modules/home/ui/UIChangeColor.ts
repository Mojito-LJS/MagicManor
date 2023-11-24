import { GameConfig } from "../../../config/GameConfig";
import ChangeColor_Generate from "../../../ui-generate/home/room/ChangeColor_generate";
import ColorItem_Generate from "../../../ui-generate/home/Items/ColorItem_generate";

class ColorInfo {
	public btn: ColorItem_Generate;

	public color: string;

	public colorId: number;
}

export class UIChangeColor extends ChangeColor_Generate {
	public colorInfos: ColorInfo[] = [];

	private _setColorCallback: (colorHex: string, colorId: number) => void;

	protected onAwake(): void {
		this.layer = mw.UILayerTop;

		this.mCloseBtn.onClicked.add(() => {
			this.visible = false;
		});
	}

	public onShow(callback: (colorHex: string, colorId: number) => void) {
		this._setColorCallback = callback;
		const allColors = GameConfig.HomeColor.getAllElement();
		for (let i = 0; i < allColors.length; ++i) {
			let info: ColorInfo;
			if (i >= this.colorInfos.length) {
				info = new ColorInfo();
				info.btn = mw.UIService.create(ColorItem_Generate); //mw.Button.newObject(this.mbtnCanvas, "btn");
				this.mbtnCanvas.addChild(info.btn.uiWidgetBase);
				info.btn.mBtn.onClicked.add(this.onClicked.bind(this, info));
				info.colorId = allColors[i].id;
				this.colorInfos.push(info);
			} else {
				info = this.colorInfos[i];
			}

			info.color = allColors[i].colorHex;
			info.btn.mBtn.normalImageColor = mw.LinearColor.colorHexToLinearColor(info.color);
		}
	}

	private onClicked(info: ColorInfo) {
		if (this._setColorCallback) this._setColorCallback(info.color, info.colorId);
		this.visible = false;
	}

	public setPos(pos: Vector2, leftOffset: boolean, highOffset: boolean) {
		this.mChangeColorCanvas.position = pos.add(
			new Vector2(leftOffset ? -this.mChangeColorCanvas.size.x : 0, highOffset ? -this.mChangeColorCanvas.size.y : 0)
		);
	}
}
