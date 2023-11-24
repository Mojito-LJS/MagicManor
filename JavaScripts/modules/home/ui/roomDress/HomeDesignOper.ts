import HomeDesignOper_Generate from "../../../../ui-generate/home/HomeDesignOper_generate";
import { HomeDressModuleC } from "../../dress/HomeDressModuleC";
import { Editor } from "../../dress/place/Editor";
import { UIChangeColor } from "../UIChangeColor";
import { HomeDesignMainUI } from "./HomeDesignMainUI";

export enum HomeDesignOperationEnum {
	Operation = 0,
	Install = 1
}

export class UIHomeDesignOper extends HomeDesignOper_Generate {
	private _moduleC: HomeDressModuleC;

	protected onStart(): void {
		this.layer = mw.UILayerTop;
		this._moduleC = ModuleService.getModule(HomeDressModuleC);

		this.mBtnInstallSure.onClicked.add(() => {
			this._moduleC.sureInstall();
			mw.UIService.getUI(HomeDesignMainUI).canvasShow();
		});

		this.mBtnInstallCancel.onClicked.add(() => {
			Editor.Instance.cancelInstall();
			mw.UIService.getUI(HomeDesignMainUI).canvasShow();
		});

		this.mBtnInstallRotate.onClicked.add(() => {
			this._moduleC.rotateDress();
		});

		this.mBtnMove.onClicked.add(() => {
			Editor.Instance.joinEditorItemOper();
		});

		this.mPriceBtn.onClicked.add(() => {
			this._moduleC.deleteDress();
			mw.UIService.getUI(HomeDesignMainUI).canvasShow();
		});

		this.mBtnChangeColor.onClicked.add(() => {
			mw.UIService.show(UIChangeColor, (colorHex, colorId) => {
				ModuleService.getModule(HomeDressModuleC).reqUpdateDressColor(colorId);
			});
			const uiChangeColor = mw.UIService.getUI(UIChangeColor) as UIChangeColor;
			const outPixel = Vector2.zero;
			const outPos = Vector2.zero;
			mw.localToViewport(this.mBtnChangeColor.tickSpaceGeometry, Vector2.zero, outPixel, outPos);
			uiChangeColor.setPos(outPos, true, true);
		});
	}

	public setState(state: HomeDesignOperationEnum) {
		if (state == HomeDesignOperationEnum.Install) {
			this.mOperCanvas.visibility = mw.SlateVisibility.Collapsed;
			this.mInstallOperCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		} else if (state == HomeDesignOperationEnum.Operation) {
			this.mOperCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
			this.mInstallOperCanvas.visibility = mw.SlateVisibility.Collapsed;
		}
	}
}
