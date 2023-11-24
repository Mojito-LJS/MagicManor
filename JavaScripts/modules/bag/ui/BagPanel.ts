import { GameConfig } from "../../../config/GameConfig";
import { GlobalData } from "../../../const/GlobalData";
import { CloseAllUI, ShowAllUI, UIManager } from "../../../ExtensionType";
import BagPanel_Generate from "../../../ui-generate/bag/BagPanel_generate";
import Tips from "../../../ui/commonUI/Tips";
import { ContractType } from "../../relation/RelationData";
import { ItemInfo, ItemType, TagType } from "../BagDataHelper";
import { BagModuleC } from "../BagModuleC";
import { BagHub } from "./BagHub";
import { BagItem } from "./BagItem";
import { GoodsItem } from "./GoodsItem";

const selectTagColor = mw.LinearColor.colorHexToLinearColor("#000000")

export class BagPanel extends BagPanel_Generate {
    /**背包当前类型物品 */
    private _curItemLst: ItemInfo[];
    /**背包当前类型 */
    private _curType: TagType;
    /**战斗类型 */
    //private _fightingModel: FightingModel = FightingModel.None
    /**选中标签 */
    private _selectTag: mw.Button;
    /**选中物品 */
    private _selectItems: BagItem[];
    /**快捷栏插槽 */
    private _allSlot: GoodsItem[] = [];
    /**物品对象池 */
    private _itemPool: BagItem[] = [];
    /**物品使用池 */
    private _usePool: BagItem[] = [];
    /**下标 */
    private _index: number = 0;
    /**分帧执行数组 */
    private _delayLst: number[] = [];

    private get bagModuleC() {
        return ModuleService.getModule(BagModuleC)
    }

    protected onStart(): void {
        /**初始化快捷栏 */
        for (let index = 1; index <= GlobalData.maxShortcutBar; index++) {
            const item = mw.UIService.create(GoodsItem);
            item.clickBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
            this.mShortcutBar.addChild(item.uiObject);
            item.uiObject.size = item.rootCanvas.size;
            item.restore();
            this._allSlot.push(item);
        }
    }

    protected initButtons(): void {
        super.initButtons();
        this.mClose.onClicked.add(() => {
            this.refreshData();
            mw.UIService.show(BagHub);
            this.hide()
        })

        this.mCloseBtn.onClicked.add(() => {
            this.refreshData();
            mw.UIService.show(BagHub);
            this.hide()
        })

        this.mDetailClose.onClicked.add(() => {
            this.mDetail.visibility = mw.SlateVisibility.Collapsed;
        })

        for (let i = 1; i <= 4; i++) {
            this["mTypeBtn" + i].onClicked.add(() => {
                if (this._selectTag) {
                    this._selectTag.normalImageColor = mw.LinearColor.white;
                }
                this._selectTag = this["mTypeBtn" + i];
                this._selectTag.normalImageColor = selectTagColor;
                this.refreshContent(i);
            })
        }
    }

    protected onShow(...params: any[]): void {
        this._curType = null;
        this.mTypeBtn1.onClicked.broadcast()
        this.initShortcutBar();

        /**消息通知 */
        this.broadcastNotify()

        /**背包动画 */
        // const screenWidth = UIManager.canvas.size.x
        // const tempPos = this.mBagCon.position.clone();
        // tempPos.x = screenWidth
        // this.mBagCon.position = tempPos;
        // const targetX = screenWidth - this.mBagCon.size.x;
        // new Tween({ x: screenWidth }).to({ x: targetX }, 500).onUpdate(obj => {
        //     tempPos.x = obj.x;
        //     this.mBagCon.position = tempPos;
        // }).easing(TweenUtil.Easing.Circular.Out).start()
    }

    protected onHide(): void {
        this.clearItemPool();
    }

    public show(...params: unknown[]): void {
        CloseAllUI()
        UIManager.show(BagPanel, ...params);
    }

    public hide(): void {
        ShowAllUI()
        UIManager.hide(BagPanel);
    }

    /** 
     * 更新背包
     * @param  type
     * @return 
     */
    private refreshContent(type: TagType) {
        this.mDescription.visibility = mw.SlateVisibility.Collapsed;
        this.mDetail.visibility = mw.SlateVisibility.Collapsed;
        if (this._curType === type) {
            return;
        }
        this._curType = type;
        this._curItemLst = this.bagModuleC.getItemsByTag(type, true);
        const equipSlots = this.bagModuleC.equipSlots;
        this.clearDelay()
        this.clearItemPool();
        this.mScroll.scrollToStart();
        for (let index = 0; index < this._curItemLst.length; index++) {
            const delayID = TimeUtil.delayExecute(() => {
                const info = this._curItemLst[index]
                let item: BagItem;
                if (this._itemPool.length > 0) {
                    item = this._itemPool.shift();
                } else {
                    item = mw.UIService.create(BagItem);
                    item.clickBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
                    this.mContent.addChild(item.uiObject);
                    item.uiObject.size = item.rootCanvas.size;
                    item.index = this._index++;
                }
                this._usePool.push(item);
                item.uiObject.visibility = mw.SlateVisibility.SelfHitTestInvisible;
                item.setData(info);
                item.clickBtn.onClicked.add(() => {
                    if ([ItemType.Money].includes(item.config.ItemType)) {
                        Tips.show("货币不可放入快捷栏")
                        return
                    }
                    const select = item.mSelect.visible
                    if (select) {
                        this.refreshShortcutBar(item);
                    } else {
                        this.findPlace(item);
                    }
                })
                item.clickTips.onClicked.add(() => {
                    this.showDetail(item)
                })
                if (equipSlots.includes(item.id)) {
                    item.mSelect.visibility = mw.SlateVisibility.SelfHitTestInvisible
                }
            }, index)
            this._delayLst.push(delayID);
        }
    }

    /**
     * 清除分帧数组
     * @returns 
     */
    private clearDelay() {
        if (this._delayLst.length === 0) {
            return
        }
        for (const id of this._delayLst) {
            TimeUtil.clearDelayExecute(id)
        }
        this._delayLst.length = 0;
    }

    /** 
     * 清空对象池
     * @return 
     */
    private clearItemPool() {
        if (this._usePool.length === 0) {
            return;
        }
        for (const item of this._usePool) {
            this._itemPool.push(item);
            item.clickBtn.onClicked.clear();
            item.clickTips.onClicked.clear();
            item.uiObject.visibility = mw.SlateVisibility.Collapsed;
        }
        this._itemPool.sort((a, b) => {
            return a.index - b.index;
        })
        this._usePool.length = 0;
    }

    /** 
     * 初始化快捷栏插槽
     * @return 
     */
    public initShortcutBar() {
        const slots = this.bagModuleC.getEquipItems(false);
        for (let index = 0; index < slots.length; index++) {
            const info = slots[index];
            const item = this._allSlot[index];
            item.setData(info);
        }
    }

    /** 
     * 显示详情
     * @param  item
     * @return 
     */
    private showDetail(item: BagItem) {
        this.mDescription.visibility = mw.SlateVisibility.Collapsed;
        this.mDetail.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        this.mDetailName.text = item.config.Name;
        this.mDetailText.text = item.config.description;
        this.mDetailIcon.imageGuid = item.config.Icon;
        //this.setTextColor(this.mDetailName, item.config)
    }

    /**
     * 欢乐校园功能自动找位置放入快捷栏
     * @return 
     */
    findPlace(item: BagItem) {
        let index = -1
        for (let i = 0; i < this._allSlot.length; i++) {
            const slot = this._allSlot[i];
            if (!slot.id && index === -1) {
                index = i
            }
            if (slot.id === item.id) {
                return
            }
        }
        if (index !== -1) {
            this._allSlot[index].setData(item.info);
            item.mSelect.visibility = mw.SlateVisibility.SelfHitTestInvisible
        } else {
            Tips.show(GameConfig.SquareLanguage.Danmu_Content_1367.Value)
        }
    }

    /** 
     * 更新快捷栏
     * @param  item
     * @return 
     */
    private refreshShortcutBar(item: BagItem) {
        for (const slot of this._allSlot) {
            if (slot.id === item.id) {
                item.mSelect.visibility = mw.SlateVisibility.Collapsed;
                slot.restore();
                break;
            }
        }
    }

    /** 
     * 更新快捷栏数据
     * @return 
     */
    private refreshData() {
        const equips: string[] = []
        for (const slot of this._allSlot) {
            equips.push(slot.id);
        }
        this.bagModuleC.refreshShortcutBar(equips);
    }

    broadcastNotify() {
        const notifyList = this.bagModuleC.notifyList;
        if (!notifyList.length) {
            return
        }
        for (const type of notifyList) {
            switch (type) {
                case ContractType.Ring:
                    Tips.show("契约之戒已失效，请重新购买签订契约")
                    break;
                default:
                    break;
            }
        }
        notifyList.length = 0
    }
}