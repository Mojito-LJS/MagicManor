import { SpawnManager,SpawnInfo, } from '../../../../Modified027Editor/ModifiedSpawn';
import InteractUI_Generate from "../../../../ui-generate/home/Items/InteractUI_generate";

export class InteractUI {
	private static _instance: InteractUI;
	public static get Instance() {
		if (!this._instance) {
			this._instance = new InteractUI();
		}
		return this._instance;
	}

	private _uiWidget: mw.UIWidget;

	private _tips: InteractUI_Generate;

	private _callback: () => void;

	async show(callback: () => void, pos: mw.Vector) {
		if (!this._uiWidget) {
			this._uiWidget = (await SpawnManager.asyncSpawn({ guid: "UIWidget" })) as mw.UIWidget;
			this._tips = mw.UIService.create(InteractUI_Generate);
			this._uiWidget.setTargetUIWidget(this._tips.uiWidgetBase);
			this._uiWidget.widgetSpace = mw.WidgetSpaceMode.Screen;
			this._tips.btnInteract.onClicked.add(() => {
				if (this._callback) this._callback();
			});
			this._uiWidget.interaction = true;
		}
		this._callback = callback;
		this._uiWidget.worldTransform.position = pos;

		this._uiWidget.setVisibility(mw.PropertyStatus.On);
	}

	hide() {
		this._uiWidget.setVisibility(mw.PropertyStatus.Off);
	}

}
