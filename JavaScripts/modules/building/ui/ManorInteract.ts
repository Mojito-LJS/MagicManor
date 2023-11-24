import { UIManager } from "../../../ExtensionType";
import { GameConfig } from "../../../config/GameConfig";
import ManorInteract_Generate from "../../../ui-generate/manor/ManorInteract_generate";
import { BagUtils } from "../../bag/BagUtils";
import { ResponseType } from "../../relation/RelationModuleC";
import BuildingModuleC, { RequestType } from "../BuildingModuleC";
import { ManorInvite } from "./ManorInvite";

export class ManorInteract extends ManorInteract_Generate {
    private _inviter: number;
    private _requestType: RequestType;
    private _timer: number;

    get buildingModuleC() {
        return ModuleService.getModule(BuildingModuleC);
    }

    protected onStart(): void {

    }

    protected initButtons(): void {
        super.initButtons();
        this.accept.onClicked.add(() => {
            this.buildingModuleC.responseRequest(this._inviter, this._requestType, ResponseType.Accept)
            if (this._timer) {
                clearInterval(this._timer);
                this._timer = null
            }
            this.hide();
        })

        this.refuse.onClicked.add(() => {
            this.buildingModuleC.responseRequest(this._inviter, this._requestType, ResponseType.Refuse)
            if (this._timer) {
                clearInterval(this._timer);
                this._timer = null
            }
            this.hide();
        })
    }

    protected onShow(inviter: number, type: RequestType): void {
        const visible = inviter ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed;
        const isInvited = inviter ? true : false
        this.bg.visibility = visible;
        this.accept.visibility = visible;
        this.refuse.visibility = visible;
        this.countDown(isInvited)
        if (inviter) {
            this._inviter = inviter;
            this._requestType = type;
            let text = ""
            if (type === RequestType.Invite) {
                text = "邀请你进入TA的庄园";
            } else if (type === RequestType.Visit) {
                text = "请求参观你的庄园";
            }
            const name = this.getPlayerName(inviter);
            this.desc.text = name + text;
            const manorInvite = UIManager.getUI(ManorInvite);
            if (manorInvite.visible) {
                manorInvite.hide();
            }
        }
    }

    protected onHide(): void {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null
        }
    }

    private countDown(isInvited: boolean) {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null
        }
        let count = 10;
        const text = GameConfig.SquareLanguage.Relation_04.Value;
        !isInvited && (this.desc.text = text + count)
        this._timer = setInterval(() => {
            count--;
            !isInvited && (this.desc.text = text + count)
            if (count <= 0) {
                isInvited && (this.buildingModuleC.responseRequest(this._inviter, this._requestType, ResponseType.Refuse));
                clearInterval(this._timer);
                this._timer = null
                this.hide();
            }
        }, 1000)
    }

    /**
     * 获取玩家姓名
     * @param playerID 
     * @returns 
     */
    private getPlayerName(playerID: number) {
        let str = BagUtils.getName(playerID);
        if (str.length > 5) {
            str = StringUtil.format("{0},{1}", str.substring(0, 5), "...");
        }
        return str;
    }
}