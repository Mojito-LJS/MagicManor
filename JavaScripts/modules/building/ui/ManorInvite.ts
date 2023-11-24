import { UIManager } from "../../../ExtensionType";
import ManorInvite_Generate from "../../../ui-generate/manor/ManorInvite_generate";
import Tips from "../../../ui/commonUI/Tips";
import BuildingModuleC, { ManorInfo, RequestType } from "../BuildingModuleC";
import { ManorState } from "../BuildingModuleS";
import { ManorInteract } from "./ManorInteract";
import { ManorPlayerItem } from "./ManorPlayerItem";


export class ManorInvite extends ManorInvite_Generate {
    /**自己庄园 */
    private _selfManor: number;
    /**物品对象池 */
    private _itemPool: ManorPlayerItem[] = [];
    /**物品使用池 */
    private _usePool: ManorPlayerItem[] = [];

    get buildingModuleC() {
        return ModuleService.getModule(BuildingModuleC);
    }

    protected onStart(): void {
        this.loading.visibility = mw.SlateVisibility.Collapsed;
        this.tips.visibility = mw.SlateVisibility.Collapsed;

        this._selfManor = Player.localPlayer.playerId;
        this.buildingModuleC.refreshManorPlayerList.add(this.refreshPlayerList, this);
    }

    protected initButtons(): void {
        super.initButtons();
        this.closeBG.onClicked.add(() => {
            this.hide();
        })
    }

    protected onShow(...params: any[]): void {
        this.tips.visibility = mw.SlateVisibility.Collapsed;
        this.loading.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        this.buildingModuleC.requestManorPlayerList();
        const level = this.buildingModuleC.manorLevel;
        this.manorLevel.text = `${level}级庄园`;
    }

    public refreshPlayerList(playersId: number[], playersState: number[], playersManor: number[], playersLevel: number[]) {
        this.loading.visibility = mw.SlateVisibility.Collapsed;
        this.clearItemPool();
        this.scrollPlayer.scrollToStart();
        if (!playersId || !playersId.length) {
            this.tips.visibility = mw.SlateVisibility.SelfHitTestInvisible;
            return
        }
        for (let index = 0; index < playersId.length; index++) {
            const info: ManorInfo = {
                id: playersId[index],
                state: playersState[index],
                manor: playersManor[index],
                level: playersLevel[index],
            }
            let item: ManorPlayerItem;
            if (this._itemPool.length > 0) {
                item = this._itemPool.shift();
            } else {
                item = UIManager.create(ManorPlayerItem);
                item.clickInviteBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
                item.clickVisitBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
                this.content.addChild(item.uiObject);
                item.uiObject.size = item.rootCanvas.size;
            }
            this._usePool.push(item);
            item.uiObject.visibility = mw.SlateVisibility.SelfHitTestInvisible;
            item.setData(info);
            item.clickInviteBtn.onClicked.add(() => {
                if (item.state === ManorState.Visit) {
                    if (item.manor === this._selfManor) {
                        Tips.show("该玩家已在你的庄园中");
                    } else {
                        Tips.show("该玩家已在其他庄园中");
                    }
                    return
                }
                this.buildingModuleC.sendManorRequest(item.id, RequestType.Invite);
                this.hide();
                UIManager.show(ManorInteract);
            })
            item.clickVisitBtn.onClicked.add(() => {
                this.buildingModuleC.sendManorRequest(item.id, RequestType.Visit);
                this.hide();
                UIManager.show(ManorInteract);
            })
        }
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
            item.clickInviteBtn.onClicked.clear();
            item.clickVisitBtn.onClicked.clear();
            item.uiObject.visibility = mw.SlateVisibility.Collapsed;
        }
        this._usePool.length = 0;
    }
}