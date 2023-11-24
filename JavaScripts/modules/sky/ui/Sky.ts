/** 
 * @Author       : 陆江帅
 * @Date         : 2023-05-28 14:09:05
 * @LastEditors  : 陆江帅
 * @LastEditTime : 2023-06-01 17:49:31
 * @FilePath     : \magicmanor\JavaScripts\modules\sky\ui\Sky.ts
 * @Description  : 
 */
import { UIManager } from "../../../ExtensionType";
import { GameConfig } from "../../../config/GameConfig";
import Sky_Generate from "../../../ui-generate/sky/Sky_generate";
import { MGSMsgHome } from "../../mgsMsg/MgsmsgHome";
import SkyModuleC from "../SkyModuleC";
import { SkyItem } from "./SkyItem";


export class Sky extends Sky_Generate {
    private _callBack: (guid: string) => void;
    private _skyMap: Map<number, SkyItem> = new Map<number, SkyItem>();
    private _selectItem: SkyItem;
    protected onStart(): void {
        const skyList = GameConfig.SkyChange.getAllElement();
        for (const sky of skyList) {
            const item = UIManager.create(SkyItem);
            item.setData(sky);
            this.content.addChild(item.uiObject);
            item.uiObject.size = item.rootCanvas.size;
            item.clickBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;;
            item.clickBtn.onClicked.add(() => {
                if (this._selectItem) {
                    if (this._selectItem.id === item.id) {
                        return;
                    }
                    this._selectItem.restore();
                }
                item.onSelect();
                this._selectItem = item;
                this.description.text = sky.description;
                this._callBack && this._callBack(sky.icon);
                ModuleService.getModule(SkyModuleC).changeSky(sky.id);
            })
            this._skyMap.set(sky.id, item);
        }
    }

    protected initButtons(): void {
        super.initButtons()
        this.close.onClicked.add(() => {
            /**burial point */
            MGSMsgHome.selectWeather(this._selectItem.id);
            this.hide();
        });
    }

    protected onShow(callBack: (guid: string) => void): void {
        this._callBack = callBack;
        const curSky = ModuleService.getModule(SkyModuleC).curSkyType;
        for (const [id, item] of this._skyMap) {
            if (id === curSky) {
                item.onSelect();
                this._selectItem = item;
                this.description.text = item.config.description;
            } else {
                item.restore();
            }
        }
    }
}