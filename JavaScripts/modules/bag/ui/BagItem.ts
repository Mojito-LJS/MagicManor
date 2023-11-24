import { GameConfig } from "../../../config/GameConfig";
import { IItemElement } from "../../../config/Item";
import { GlobalData } from "../../../const/GlobalData";
import BagItem_Generate from "../../../ui-generate/bag/BagItem_generate";
import { ItemInfo, ItemType } from "../BagDataHelper";


export class BagItem extends BagItem_Generate {
    public info: ItemInfo;
    public id: string;
    public count: number;
    public config: IItemElement;
    public index: number;

    get clickBtn() {
        return this.mBtn;
    }

    get clickTips() {
        return this.mTips;
    }

    protected onStart(): void {
        this.restore();
    }

    protected onShow(...params: any[]): void {
    }

    public setData(info: ItemInfo, isBar: boolean = false) {
        if (!info) {
            this.restore();
            return;
        }
        const config = GameConfig.Item.getElement(info.configID);

        this.mItemInfo.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        this.mBottom.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        this.mBg.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        this.mInfoCon.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        this.mSelect.visibility = mw.SlateVisibility.Collapsed;
        this.durProgress.visibility = mw.SlateVisibility.Collapsed;
        if (isBar) {
            this.mRemove.visibility = mw.SlateVisibility.Visible;
            this.mName.visibility = mw.SlateVisibility.Collapsed;
        } else {
            this.mName.visibility = mw.SlateVisibility.Visible;
            this.mName.text = config.Name;
        }

        this.info = info;
        this.id = info.id;
        this.count = info.count;
        this.config = config
        this.mIcon.imageGuid = config.Icon;
        if ([ItemType.Inconsumable].includes(config.ItemType)) {
            this.mInfoCon.visibility = mw.SlateVisibility.Collapsed;
            // this.mItemInfo.text = "LV." + config.Level
        } else if (config.ItemType === ItemType.Durability) {
            this.durProgress.visibility = mw.SlateVisibility.SelfHitTestInvisible;
            this.durProgress.currentValue = info.curDurability / config.Durability
            this.mItemInfo.text = info.curDurability + "/" + config.Durability
        } else if ([ItemType.Consumable].includes(config.ItemType)) {
            this.mItemInfo.text = "x" + info.count
        } else if ([ItemType.Money].includes(config.ItemType)) {
            this.mItemInfo.text = "x" + info.count;
        }
    }

    public restore() {
        this.durProgress.visibility = mw.SlateVisibility.Collapsed;
        this.mItemInfo.visibility = mw.SlateVisibility.Collapsed;
        this.mInfoCon.visibility = mw.SlateVisibility.Collapsed;
        this.mBottom.visibility = mw.SlateVisibility.Collapsed;
        this.mBg.visibility = mw.SlateVisibility.Collapsed;
        this.mSelect.visibility = mw.SlateVisibility.Collapsed;
        this.mRemove.visibility = mw.SlateVisibility.Collapsed

        this.mIcon.imageGuid = GlobalData.blankSlotBg;
        this.info = null;
        this.config = null;
        this.id = "";
        this.count = 0;
    }
}