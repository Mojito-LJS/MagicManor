/** 
 * @Author       : pengwei.shi
 * @Date         : 2023-04-12 17:13:50
 * @LastEditors  : 陆江帅
 * @LastEditTime : 2023-05-19 17:50:04
 * @FilePath     : \MagicManor\JavaScripts\modules\action\ActionModuleClient.ts
 * @Description  : 
 */
import { GameConfig } from "../../config/GameConfig";
import Tips from "../../ui/commonUI/Tips";
import { MGSMsgHome } from "../mgsMsg/MgsmsgHome";
import { ActionBaseMC } from "../squareBase/ActionBase/ActionBaseMC";
import { ActionLuanguage } from "../squareBase/ActionBase/ActionLuangua";
import ActionData from "./ActionData";
import { ActionModuleServer } from "./ActionModuleServer";

//客户端
export class ActionModuleClient extends ActionBaseMC<ActionModuleServer, null>{

    protected initConfig(): void {
        let configs = GameConfig.SquareActionConfig.getAllElement();
        for (let config of configs) {
            this.map.set(config.ID, ActionData.get(config));
        }
    }
    //初始化多语言文本
    protected initLanguage(): void {
        ActionLuanguage.acceptText = GameConfig.SquareLanguage.Danmu_Content_1073.Value;
        ActionLuanguage.refuseText = GameConfig.SquareLanguage.Danmu_Content_1074.Value;
        ActionLuanguage.desc1 = GameConfig.SquareLanguage.Danmu_Content_1075.Value;
        ActionLuanguage.desc2 = GameConfig.SquareLanguage.Danmu_Content_1076.Value;
        // ActionLuanguage.acceptGuid = GameConfig.SquareLanguage[95788].Value;
        // ActionLuanguage.itemBg = GameConfig.SquareLanguage.getElement(86723).Value;
        ActionLuanguage.interactiveTips = GameConfig.SquareLanguage.Danmu_Content_1065.Value;
        ActionLuanguage.itemType = GameConfig.SquareLanguage.Danmu_Content_1064.Value;
        ActionLuanguage.actionTips = GameConfig.SquareLanguage.Danmu_Content_1060.Value;
        ActionLuanguage.succes = GameConfig.SquareLanguage.Danmu_Content_1071.Value;
        ActionLuanguage.fail = GameConfig.SquareLanguage.Danmu_Content_1072.Value;
        ActionLuanguage.leave = GameConfig.SquareLanguage.Danmu_Content_1054.Value;
        ActionLuanguage.action = GameConfig.SquareLanguage.Text_Text_589.Value;
        // ActionLuanguage.leaveIcon = GameConfig.SquareLanguage[94427].Value;
        ActionLuanguage.tab1 = GameConfig.SquareLanguage.Danmu_Content_1001.Value;
        ActionLuanguage.tab2 = GameConfig.SquareLanguage.Danmu_Content_1002.Value;
        // ActionLuanguage.tabBg = GameConfig.SquareLanguage.getElement(86265).Value;
        ActionLuanguage.toolong = GameConfig.SquareLanguage.Danmu_Content_1069.Value;
        ActionLuanguage.ing = GameConfig.SquareLanguage.Danmu_Content_1070.Value;
        ActionLuanguage.pleaseLeave = GameConfig.SquareLanguage.Danmu_Content_1053.Value;
    }

    protected setMGS(id: number): void {

    }

    protected setPageMGS(str: string): void {
    }

    protected bagAcceptSkip(): boolean {
        return true;
    }

    protected bagLuanchSkip(): boolean {
        return true;
    }

    protected interactiveSkip(): boolean {
        return true;
    }

    protected showTips(str: string): void {
        Tips.show(str);
    }

    private _SelfName = ""
    protected getSelfName(): string {
        if (StringUtil.isEmpty(this._SelfName))
            this._SelfName = mw.AccountService.getNickName() || "player"
        return this._SelfName
    }

    public changePanelState(isShow: boolean) {
        this.actionHUD.setVisible(isShow);
    }


    luanchActionOut(configId: number): void {
        super.luanchActionOut(configId);
    }

    public net_SetActionMSG(id: number) {
        this.setMGS(id);
    }


    /**
    * 是否在双人动作中
    * @param playerId 
    */
    public isInDoubleAction(playerId: number): boolean {
        return this.curId > 0;
    }
}