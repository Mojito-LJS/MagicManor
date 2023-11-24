import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
import { EventsName } from "../../../const/GameEnum";
import { UIManager } from "../../../ExtensionType";
import { ActionBaseCfg, ActionDoubleType, ActionType } from "./ActionBaseData";
import { ActionBaseHud } from "./ActionBaseHud";
import { ActionBaseMS } from "./ActionBaseMS";
import { ActionBaseP } from "./ActionBaseP";
import { ActionLuanguage } from "./ActionLuangua";

//客户端
export abstract class ActionBaseMC<T extends ActionBaseMS<any, any>, S extends Subdata> extends ModuleC<T, S>{

    /**当前交互 */
    public curId = 0;
    /**是否为接收者 */
    public isAccepter = false;
    /**是否单人姿态 */
    public isSingleStance = false;
    /**默认相机位置 */
    public camerPos: mw.Vector = null;
    /**当前循环动作 */
    public curloop = "";

    public actionPanel: ActionBaseP = null;
    public actionHUD: ActionBaseHud = new ActionBaseHud();
    private self: mw.Player = null;

    public map: Map<number, ActionBaseCfg> = new Map<number, ActionBaseCfg>();

    /**初始化多语言 */
    protected abstract initLanguage(): void;
    /**当前简单双人动作 */
    private singleA: mw.Animation = null;

    /**清除姿态和循环动作 */
    public cleanStance(): void {
        if (this.isSingleStance) {
            PlayerManagerExtesion.changeStanceExtesion(this.self.character,"")
            this.isSingleStance = false;
        }
        if (this.curloop) {
            PlayerManagerExtesion.rpcStopAnimation(this.self.character, this.curloop)
            this.curloop = "";
        }
    }

    private initUI(): void {
        if (this.actionPanel == null) {
            this.actionPanel = mw.UIService.create(ActionBaseP);
            this.actionPanel.OnSet.add(this.luanchAction, this);
            this.actionPanel.setConfig(this.map);
        }
    }

    //进入场景
    async onEnterScene(sceneType: number): Promise<void> {
        this.actionHUD.onAccept.add(this.aceeptAction, this);
        this.actionHUD.onActive.add(() => {
            this.initUI();
            if (this.curId <= 0) {
                UIManager.showUI(this.actionPanel);
                this.setPageMGS("action");
            } else {
                this.server.net_LeaveInteract(Number(this.curId));
            }
        }, this);
        this.initLanguage();
        this.initConfig();
        this.self = Player.localPlayer;
        this.camerPos = Camera.currentCamera.localTransform.position;
        this.server.net_login();
        Event.addLocalListener(EventsName.CancelActive, () => {
            this.off()
        })
        this.actionHUD.onStart();
    }

    /**打开动作列表 */
    public showPanle(): void {
        this.initUI();
        UIManager.showUI(this.actionPanel, mw.UILayerOwn);
    }

    /**初始化配置 */
    protected abstract initConfig(): void;

    /**离开交互 */
    public off(): void {
        if (this.curId > 0) {
            this.server.net_LeaveInteract(Number(this.curId));
        }
    }

    /**
     * 飘字提示
     * @param str 
     */
    protected abstract showTips(str: string): void;

    /**在交互物时，是否可发起或接受双人动作，无互斥返回true */
    protected abstract interactiveSkip(): boolean;

    /**使用道具时，是否可发起动作，无互斥返回true */
    protected abstract bagLuanchSkip(): boolean;

    /**使用道具时，是否可接受双人动作，无互斥返回true */
    protected abstract bagAcceptSkip(): boolean;


    /**
     * 发起动作
     * @param config 
     * @returns 
     */
    private async luanchAction(config: ActionBaseCfg, playerId?: number): Promise<void> {
        this.cleanStance();
        //判断和交互物互斥
        if (!this.interactiveSkip()) {
            this.showTips(ActionLuanguage.interactiveTips);
            return;
        }
        //判断和道具互斥
        if (!this.bagLuanchSkip()) {
            this.showTips(ActionLuanguage.itemType);
            return;
        }
        //去除重复发起动作
        if (this.curId > 0) {
            this.showTips(ActionLuanguage.actionTips);
            return;
        }
        if (config.type == ActionType.Single) {//单人动作
            this.cleanStance();
            if (config.singleType) {
                PlayerManagerExtesion.changeStanceExtesion(this.self.character,config.actionId)
                this.isSingleStance = true;
            } else {
                if (config.circulate) {
                    this.curloop = config.actionId;
                }
                PlayerManagerExtesion.rpcPlayAnimation(this.self.character, config.actionId, config.circulate ? 0 : 1, config.time)
            }
            this.setMGS(config.id);
        } else {//双人动作
            if (config.doubleType == ActionDoubleType.Force) {//强制动作
                this.server.net_ForeceAction(config.id, playerId);
            } else {//交互动作
                let name = this.getSelfName();
                let succes = await this.server.net_LuanchAction(config.id, name, playerId);
                let str = succes ? ActionLuanguage.succes : ActionLuanguage.fail;
                this.showTips(str);
            }
        }
    }

    /**
     * 外部发起动作
     * @param configId 动作配置Id
     * @param playerId 指定某人
     */
    public luanchActionOut(configId: number, playerId?: number): void {
        let config = this.map.get(configId);
        this.luanchAction(config, playerId);
    }

    /**获取自己名字 */
    protected abstract getSelfName(): string;

    /**
     * 动作埋点
     * @param id 动作配置id
     */
    protected abstract setMGS(id: number): void;

    /**动作界面埋点 */
    protected setPageMGS(str: string): void {

    }

    /**
     * 收到发起动作的人
     * @param guid 
     */
    public net_GetPlayer(playerId: number, guid: number, name: string): void {
        this.actionHUD.addPlayer(playerId, guid, name);
    }

    /**
     * 接受动作
     * @param id 
     * @returns 
     */
    private aceeptAction(id: number): void {
        if (!this.interactiveSkip()) {
            this.showTips(ActionLuanguage.interactiveTips);
            return;
        }
        if (this.isSingleStance) {
            PlayerManagerExtesion.changeStanceExtesion(this.self.character,"")
            this.isSingleStance = false;
        }

        //道具互斥判断
        if (!this.bagAcceptSkip()) {
            this.showTips(ActionLuanguage.itemType);
            return;
        }

        this.server.net_PlayAction(id);
    }

    /**
     * 播放动作
     * @param actionId 
     */
    public net_PlayAction(actionId: string): void {
        this.self.character.collisionWithOtherCharacterEnabled = false;
        if (this.singleA) {
            this.singleA.stop();
        }
        this.singleA = PlayerManagerExtesion.rpcPlayAnimation(this.self.character, actionId)
        this.singleA.onFinish.add(() => {
            this.singleA = null;
            //this.self.character.collisionWithOtherCharacterEnabled = true;
        });
    }

    /**
     * 同步交互状态
     * @param playerId 
     */
    public net_Interact(playerId: number, isAccepter: boolean, configId: number): void {
        this.curId = playerId;
        this.isAccepter = isAccepter;
        let guid = playerId > 0 ? "115571" : "115581";
        let name = playerId > 0 ? ActionLuanguage.leave : ActionLuanguage.action;
        this.actionHUD.refreshBtnStr(name, guid);
        if (playerId <= 0) {
            PlayerManagerExtesion.changeStanceExtesion(this.self.character,"")
            Camera.currentCamera.localTransform.position = this.camerPos;
        } else {
            let config = this.map.get(configId);
            if (!config) {
                return;
            }
            if (isAccepter && config.visual2) {
                Camera.currentCamera.localTransform.position = config.visual2;
            }
            if (!isAccepter && config.visual1) {
                Camera.currentCamera.localTransform.position = config.visual1;
            }
        }
    }

    /**
     * 显示提示
     * @param str 
     */
    public net_ShowTips(num: number): void {
        let str = "";
        switch (num) {
            case 0:
                str = ActionLuanguage.fail;
                break;
            case 1:
                str = ActionLuanguage.toolong;
                break;
            case 2:
                str = ActionLuanguage.ing;
                break;
            case 3:
                str = ActionLuanguage.pleaseLeave;
                break;
            default:
                return;
        }
        this.showTips(str);
    }

    /**
     * 刷新按钮显示
     * @param bool true显示 false不显示
     */
    public refreshBtn(bool: boolean): void {
        this.actionHUD.refreshBtn(bool);
    }
}