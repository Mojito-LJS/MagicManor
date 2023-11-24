import { GeneralManager, } from '../../../Modified027Editor/ModifiedStaticAPI';
import { EventsName } from "../../../const/GameEnum";
import { GlobalData } from "../../../const/GlobalData";
import { Tween, UIManager } from "../../../ExtensionType";
import BagHub_Generate from "../../../ui-generate/bag/BagHub_generate";
import { ItemInfo } from "../BagDataHelper";
import { BagModuleC } from "../BagModuleC";
import { BagInteraction } from "./BagInteraction";
import { GoodsItem } from "./GoodsItem";

const creationViewPos = mw.Vector2.zero;

const outPixelPos = mw.Vector2.zero;

const outViewPos = mw.Vector2.zero;


export class BagHub extends BagHub_Generate {
    /**快捷栏物品 */
    private _equipItems: ItemInfo[];
    /**选中物品 */
    private _selectEquip: GoodsItem;
    /**UI激活状态 */
    private _active: boolean;
    /**插槽 */
    private _allSlot: GoodsItem[] = [];
    /**快捷栏状态 */
    private _isShow: boolean = true;

    private get bagModuleC() {
        return ModuleService.getModule(BagModuleC)
    }

    protected onStart(): void {
        this.initEvents();
        /**初始化快捷栏 */
        for (let index = 1; index <= GlobalData.maxShortcutBar; index++) {
            const item = mw.UIService.create(GoodsItem);
            item.clickBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
            this.mShortcutBar.addChild(item.uiObject);
            item.uiObject.size = item.rootCanvas.size;
            item.restore();
            item.clickBtn.onClicked.add(() => {
                if (GlobalData.skillCD > 0) {
                    return;
                }
                this.selectItem(item);
            })
            item.closeBtn.onClicked.add(() => {
                if (GlobalData.skillCD > 0 || !GlobalData.isChangeBar) {
                    return;
                }
                if (this._selectEquip && this._selectEquip.id === item.id) {
                    this.unloadItem(item);
                }
                this.bagModuleC.removeShortcutBarItem(item.id);
            })
            this._allSlot.push(item);


        }
        this.guideBtn.visibility = mw.SlateVisibility.Hidden;
        this.mGuideBtn.visibility = mw.SlateVisibility.Hidden;


    }

    protected initButtons(): void {
        super.initButtons();

        this.mClearBar.onClicked.add(() => {
            if (GlobalData.skillCD > 0 || !GlobalData.isChangeBar) {
                return;
            }
            this.bagModuleC.clearShortCutBar();
        })

        this.mHideBar.onClicked.add(() => {
            const angle = this._isShow ? 180 : 0
            const visibility = this._isShow ? mw.SlateVisibility.Collapsed : mw.SlateVisibility.SelfHitTestInvisible
            this.mBarCon.visibility = visibility
            this.mHideBar.renderTransformAngle = angle
            this._isShow = !this._isShow
        })


    }

    private initEvents() {
        /**刷新快捷栏 */
        this.bagModuleC.onRefreshBar.add(this.refreshShortcutBar, this)

        Event.addLocalListener(EventsName.CreationSkills, (itemID: number, loc: mw.Vector) => {
            this.creationFly(itemID, loc);
        })
    }

    protected onShow(...params: any[]): void {
        this.canUpdate = true
        this._active = true
        this.refreshShortcutBar();
    }

    protected onHide(): void {
        this.canUpdate = false
        this._active = false
    }

    /** 
     * 刷新快捷栏
     * @return 
     */
    private refreshShortcutBar() {
        if (!this._active) {
            return;
        }
        let visible = mw.SlateVisibility.Collapsed
        const curEquip = this.bagModuleC.curEquip
        this._equipItems = this.bagModuleC.getEquipItems(false);
        if (!curEquip && this._selectEquip && this._selectEquip.id) {
            this.unloadItem(this._selectEquip)
        }

        for (let index = 0; index < this._equipItems.length; index++) {
            const info = this._equipItems[index];
            const item = this._allSlot[index];
            item.setData(info);
            if (curEquip && curEquip === item.id) {
                item.mSelect.visibility = mw.SlateVisibility.SelfHitTestInvisible;
                if (!this._selectEquip) {
                    this.selectItem(item);
                }
            }
            if (item.id && visible === mw.SlateVisibility.Collapsed) {
                visible = mw.SlateVisibility.SelfHitTestInvisible
            }
        }
        this.mContent.visibility = visible
        if (!this._isShow) {
            this.mHideBar.onClicked.broadcast()
        }
    }

    /** 
     * 选中物品
     * @param  item
     * @return 
     */
    private selectItem(item: GoodsItem) {
        if (!item.id) {
            return
        }
        this.bagModuleC.changEquipItem(item.id);
        if (this._selectEquip && this._selectEquip.id) {
            this._selectEquip.mSelect.visibility = mw.SlateVisibility.Collapsed;
            this.unloadItem(this._selectEquip, false);
            if (this._selectEquip.id === item.id) {
                UIManager.hide(BagInteraction);
                this._selectEquip = null
                this.bagModuleC.changEquipItem("");
                return
            }
        }
        this._selectEquip = item;
        this._selectEquip.mSelect.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        Event.dispatchToServer(EventsName.LoadProp, item.config.Resource)
        Event.dispatchToLocal(EventsName.EquipProp, item.config.ID)
        if (item.config.isCanGive) {
            UIManager.show(BagInteraction);
        } else {
            UIManager.hide(BagInteraction);
        }
    }

    public unloadItem(item: GoodsItem, isNull: boolean = true) {
        let prop = 0;
        const config = item?.config;
        if (config) {
            prop = config.Resource;
            if (config.isCanGive) {
                UIManager.hide(BagInteraction);
            }
        }
        Event.dispatchToLocal(EventsName.EquipProp, 0)
        prop && Event.dispatchToServer(EventsName.UnloadProp, prop)
        if (isNull) {
            this._selectEquip = null;
        }
    }

    private creationFly(itemID: number, loc: mw.Vector) {
        GeneralManager.modifyProjectWorldLocationToWidgetPosition(Player.localPlayer, loc, creationViewPos, true)
        creationViewPos.x -= this.mFlyCon.size.x / 2
        creationViewPos.y -= this.mFlyCon.size.y / 2
        for (const item of this._allSlot) {
            if (item.config?.ID === itemID) {
                mw.localToViewport(item.rootCanvas.cachedGeometry, mw.Vector2.zero, outPixelPos, outViewPos);
                this.mFlyCon.visibility = mw.SlateVisibility.SelfHitTestInvisible;
                this.mFlyHalo.visibility = mw.SlateVisibility.Collapsed;
                this.mFly.imageGuid = item.config.Icon;
                this.mFlyCon.position = creationViewPos;
                const tempPos = creationViewPos
                new Tween({ x: creationViewPos.x, y: creationViewPos.y }).to({ x: outViewPos.x, y: outViewPos.y }, 500).onUpdate(obj => {
                    tempPos.x = obj.x;
                    tempPos.y = obj.y;
                    this.mFlyCon.position = tempPos;
                }).start().onComplete(obj => {
                    this.mFlyHalo.visibility = mw.SlateVisibility.SelfHitTestInvisible;
                    const scale = this.mFlyHalo.renderScale.clone()
                    new Tween({ scale: 0, angle: -180 }).to({ scale: 1, angle: 180 }, 1000).yoyo(true).repeat(1).onUpdate(obj => {
                        scale.x = obj.scale
                        scale.y = obj.scale
                        this.mFlyHalo.renderScale = scale;
                        this.mFlyHalo.renderTransformAngle = obj.angle;
                    }).easing(TweenUtil.Easing.Circular.Out).start().onComplete(obj => {
                        this.mFlyCon.visibility = mw.SlateVisibility.Collapsed;
                    })
                })
                break;
            }
        }

    }
}