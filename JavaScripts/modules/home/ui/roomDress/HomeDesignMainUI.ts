import { GameConfig } from "../../../../config/GameConfig";
import { IHomeDressElement } from "../../../../config/HomeDress";
import { IHomeDressTypeElement } from "../../../../config/HomeDressType";
import HomeDesignItemUI_Generate from "../../../../ui-generate/home/HomeDesignItemUI_generate";
import HomeDesignMainUI_Generate from "../../../../ui-generate/home/HomeDesignMainUI_generate";
import Tips from "../../../../ui/commonUI/Tips";
import { Stack } from "../../../../utils/Stack";
import { BagModuleC } from "../../../bag/BagModuleC";
import { BuildingHelper } from "../../BuildingHelper";
import { HomeDressModuleC } from "../../dress/HomeDressModuleC";
import { Editor } from "../../dress/place/Editor";
import { Place } from "../../dress/place/Place";
import { ControlUI } from "../ControlUI";

export class HomeDesignItemUI extends HomeDesignItemUI_Generate {
	private _callback: (id: number) => void;

	private _id: number = 0;

	protected onAwake(): void {
		this.mBtn.onClicked.add(
			(() => {
				logI("Item click");
				if (this._callback) this._callback(this._id);
			}).bind(this)
		);
		this.mBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	}

	public show(iconGuid: string, name: string, price: number, id: number, showPrice: boolean, onclick: (id: number) => void) {
		this._id = id;
		this._callback = onclick;
		this.mIcon.imageGuid = iconGuid;
		this.mNameTex.text = name;
		this.mPriceTex.text = price.toString();
		if (!showPrice) {
			this.mPriceCanvas.visibility = mw.SlateVisibility.Collapsed;
		} else {
			this.mPriceCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		}
	}
}

export class HomeDesignMainUI extends HomeDesignMainUI_Generate {
	private _cacheItemUI: Array<HomeDesignItemUI> = [];
	private _lastClickTypeBtn: mw.StaleButton;
	private _areas: string[];
	private _money: number;

	protected onAwake(): void {
		this.layer = mw.UILayerOwn;

		this.mBtnShow.onClicked.add(this.showItemScroll.bind(this));
		this.mBtnHide.onClicked.add(this.hideItemScroll.bind(this));

		this.mTypeBtn1.onClicked.add(this.onTypeBtnClick.bind(this, this.mTypeBtn1, 1));
		this.mTypeBtn2.onClicked.add(this.onTypeBtnClick.bind(this, this.mTypeBtn2, 2));
		this.mTypeBtn3.onClicked.add(this.onTypeBtnClick.bind(this, this.mTypeBtn3, 3));

		this.mTypeBtn1.text = GameConfig.HomeDressType.getElement(1).name;
		this.mTypeBtn2.text = GameConfig.HomeDressType.getElement(2).name;
		this.mTypeBtn3.text = GameConfig.HomeDressType.getElement(3).name;

		this.mBackBtn.onClicked.add(this.onBackTypeClick.bind(this));

		this.mCloseBtn.onClicked.add(
			(() => {
				Editor.Instance.leftEditorModel();
			}).bind(this)
		);

		this.mBtnChangeMartialSure.onClicked.add(
			(() => {
				ModuleService.getModule(HomeDressModuleC).sureMartials();
				this.canvasShow();
			}).bind(this)
		);

		this.mBtnChangeMartialCancel.onClicked.add(
			(() => {
				ModuleService.getModule(HomeDressModuleC).cancelMartials();
				this.canvasShow();
			}).bind(this)
		);
	}

	protected onStart(): void {
		Event.addLocalListener("BuyHomeDress", (price: number) => {
			this.refreshMoney();
		})
		Event.addLocalListener("SellHomeDress", (price: number) => {
			this.refreshMoney();
		})
	}

	protected onShow(isResetView: boolean = true) {
		this.canvasShow();
		this.refreshMoney();

		if (isResetView) {
			this.mBtnGroupCanvasRoot.visibility = mw.SlateVisibility.SelfHitTestInvisible;
			this.mScrollItemCanvasRoot.visibility = mw.SlateVisibility.Collapsed;
			this.mHideBtnCanvas.visibility = mw.SlateVisibility.Collapsed;
			this.mShowBtnCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;

			this.setTypeBtnClickState(this.mTypeBtn1, true);
			this._lastClickTypeBtn = this.mTypeBtn1;
			this.setTypeItemDatas(1);
			this.showTypeItems();
			this.setTypeBtnClickState(this.mTypeBtn2, false);
			this.setTypeBtnClickState(this.mTypeBtn3, false);
		}

		mw.UIService.show(ControlUI);
		this._areas = BuildingHelper.getAllDressAreas()
	}

	private refreshMoney() {
		const item = ModuleService.getModule(BagModuleC).getItem(90005);
		const money = item ? item.count : 0;
		this._money = money;
		this.moneyCount.text = money.toString();
	}

	private setTypeBtnClickState(btn: mw.StaleButton, isClick: boolean) {
		if (isClick) {
			btn.fontColor = mw.LinearColor.colorHexToLinearColor("#A27C5AFF");
			btn.outlineColor = mw.LinearColor.colorHexToLinearColor("#A27C5AFF");
			btn.normalImageColor = mw.LinearColor.colorHexToLinearColor("#EFEEE1FF");
			btn.outlineSize = 0;
			btn.renderOpacity = 1;
		} else {
			btn.fontColor = mw.LinearColor.colorHexToLinearColor("#FFFFFFFF");
			btn.outlineColor = mw.LinearColor.colorHexToLinearColor("#FCFCFCFF");
			btn.normalImageColor = mw.LinearColor.colorHexToLinearColor("#3D3D3DFF");
			btn.outlineSize = 1;
			btn.renderOpacity = 0.6;
		}
	}

	private onTypeBtnClick(btn: mw.StaleButton, type: number) {
		this.showItemScroll();

		if (this._lastClickTypeBtn) {
			this.setTypeBtnClickState(this._lastClickTypeBtn, false);
		}

		this.setTypeBtnClickState(btn, true);
		this._lastClickTypeBtn = btn;

		this.setTypeItemDatas(type);
		this.showTypeItems();
	}

	private _openTypeList: Stack<IHomeDressTypeElement[]> = new Stack<IHomeDressTypeElement[]>();

	private _showItemList: IHomeDressElement[] = [];

	private _showItem: boolean = false;

	private onBackTypeClick() {
		if (this._openTypeList.size() == 1) {
			return;
		}

		if (this._openTypeList.size() > 0) {
			this._openTypeList.pop();
		}

		this._showItemList.length = 0;
		this._showItem = false;

		if (this._openTypeList.size() > 0) {
			this.showTypeItems();
		}

		if (this._openTypeList.size() == 1) {
			this.mBackBtnCanvas.visibility = mw.SlateVisibility.Collapsed;
			//重新设置scrollsize
			this.mScrollBox.size = this.mItemCanvas.size;
			this.mScrollCanvas.position = new Vector2(0, this.mScrollCanvas.position.y);
		}
	}

	private setTypeItemDatas(typeId: number) {
		const types = [];

		const def = GameConfig.HomeDressType.getElement(typeId);

		if (def == null) {
			logW("无效parentId");
			return;
		}

		if (def.parentTypeId == 0) {
			this._openTypeList.clear();
			this._showItemList.length = 0;
			this.mBackBtnCanvas.visibility = mw.SlateVisibility.Collapsed;
			//重新设置scrollsize
			this.mScrollBox.size = this.mItemCanvas.size;
			this.mScrollCanvas.position = new Vector2(0, this.mScrollCanvas.position.y);
		} else {
			this.mBackBtnCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
			//重新设置scrollsize
			this.mScrollBox.size = new Vector2(1568, 240);
			this.mScrollCanvas.position = new Vector2(0, this.mScrollCanvas.position.y);
		}

		const res = GameConfig.HomeDressType.getAllElement();
		res.forEach((e) => {
			if (e.parentTypeId == typeId) {
				types.push(e);
			}
		});

		this._openTypeList.push(types);
		if (types.length > 0) {
			this._showItem = false;
		} else {
			//TODO:没有子类型，直接显示物品
			for (const dress of GameConfig.HomeDress.getAllElement()) {
				if (dress.type == typeId && this._areas.includes(dress.installArea)) {
					this._showItemList.push(dress);
				}
			}
			this._showItem = true;
		}
	}

	public canvasHide(showMartialSure: boolean) {
		if (showMartialSure) {
			this.mBuyItemCanvas.visibility = mw.SlateVisibility.Collapsed;
			this.mChangeMartialCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		} else {
			this.mBuyItemCanvas.visibility = mw.SlateVisibility.Collapsed;
			this.mChangeMartialCanvas.visibility = mw.SlateVisibility.Collapsed;
		}
	}

	public canvasShow() {
		this.mBuyItemCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		this.mChangeMartialCanvas.visibility = mw.SlateVisibility.Collapsed;
	}

	private showTypeItems() {
		this._cacheItemUI.forEach((e) => {
			e.visible = false;
		});

		//有道具先显示道具
		if (this._showItemList.length > 0 || this._showItem) {
			for (let i = 0; i < this._showItemList.length; ++i) {
				let item: HomeDesignItemUI;
				if (i >= this._cacheItemUI.length) {
					item = mw.UIService.create(HomeDesignItemUI);
					this._cacheItemUI.push(item);
					this.mScrollCanvas.addChild(item.uiWidgetBase);
				} else {
					item = this._cacheItemUI[i];
				}
				const price = this._showItemList[i].price;
				item.show(
					this._showItemList[i].iconGuid,
					this._showItemList[i].name,
					price,
					this._showItemList[i].id,
					true,
					((itemId) => {
						const cfg = GameConfig.HomeDress.getElement(itemId);
						if ((!this._money && price > 0) || this._money < price) {
							Tips.show("家具币不足");
							return;
						}
						Place.Instance.initInstallGoByCfgId(itemId);
						this.canvasHide(cfg.isMartial != 0);
					}).bind(this, this._showItemList[i].id)
				);
				item.visible = true;
			}
		}

		//没有道具显示分类

		if (this._openTypeList.size() > 0 && !this._showItem) {
			const showData = this._openTypeList.peek();
			for (let i = 0; i < showData.length; ++i) {
				let item: HomeDesignItemUI;
				if (i >= this._cacheItemUI.length) {
					item = mw.UIService.create(HomeDesignItemUI);
					this._cacheItemUI.push(item);
					this.mScrollCanvas.addChild(item.uiWidgetBase);
				} else {
					item = this._cacheItemUI[i];
				}
				item.show(
					showData[i].icon,
					showData[i].name,
					0,
					showData[i].id,
					false,
					((typeId) => {
						this.setTypeItemDatas(typeId);
						this.showTypeItems();
					}).bind(this, showData[i].id)
				);

				item.visible = true;
			}
		}
	}

	private showItemScroll() {
		this.mScrollItemCanvasRoot.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		this.mShowBtnCanvas.visibility = mw.SlateVisibility.Collapsed;
		this.mHideBtnCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
	}

	private hideItemScroll() {
		this.mScrollItemCanvasRoot.visibility = mw.SlateVisibility.Collapsed;
		this.mShowBtnCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		this.mHideBtnCanvas.visibility = mw.SlateVisibility.Collapsed;
	}
}
