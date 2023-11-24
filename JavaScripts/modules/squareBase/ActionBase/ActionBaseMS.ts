import { GeneralManager, } from '../../../Modified027Editor/ModifiedStaticAPI';
import { SpawnManager, SpawnInfo, } from '../../../Modified027Editor/ModifiedSpawn';
import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
import { ActionBaseCfg, ActionDoubleType } from "./ActionBaseData";
import { ActionBaseMC } from "./ActionBaseMC";

//服务端
export abstract class ActionBaseMS<T extends ActionBaseMC<any, any>, S extends Subdata> extends ModuleS<T, S>{
    /**发起动作的人 */
    private actionPlayers: Map<number, number> = new Map<number, number>();
    /**交互的人*/
    public interactPlayers: Map<number, InteractPlayer> = new Map<number, InteractPlayer>();
    /**显示交互距离 */
    private showFlagDis = 400;
    private leftListener: any = null;

    public map: Map<number, ActionBaseCfg> = new Map<number, ActionBaseCfg>();

    public onStart(): void {
        //监听玩家离开房间
        this.leftListener = Player.onPlayerLeave.add(this.peopleLeft.bind(this));
        this.initConfig();
    }

    /**初始化配置 */
    protected abstract initConfig(): void;

    /**
     * 玩家离开
     * @param player 
     */
    private peopleLeft(player: mw.Player): void {
        for (let [id, interactData] of this.interactPlayers) {
            if (player.playerId == interactData.sendPlayerId || player.playerId == interactData.accectPlayerId) {
                let accectPlayer = Player.getPlayer(interactData.accectPlayerId);
                let sendPlayer = Player.getPlayer(interactData.sendPlayerId);
                if (accectPlayer) {
                    this.leaveCheck(sendPlayer);
                    //accectPlayer.character.collisionWithOtherCharacterEnabled = true;
                }
                if (sendPlayer) {
                    this.leaveCheck(accectPlayer);
                }
                interactData.reLoginLeave();
                this.interactPlayers.delete(id);
            }
        }
    }

    /**
     * 发起动作
     * @param guid 
     */
    public net_LuanchAction(guid: number, name: string, playerId?: number): boolean {
        let luanchPlayer = this.currentPlayer;
        let id = luanchPlayer.playerId;
        let succes = false;
        if (playerId) {
            if (this.isCanLuanch(luanchPlayer, playerId)) {
                this.actionPlayers.set(id, guid);
                this.getClient(playerId).net_GetPlayer(id, guid, name);
                succes = true;
            }
        } else {
            for (let player of Player.getAllPlayers()) {
                if (!this.isCanLuanch(luanchPlayer, player.playerId)) {
                    continue;
                }

                this.actionPlayers.set(id, guid);
                this.getClient(player).net_GetPlayer(id, guid, name);
                succes = true;
            }
        }
        return succes;
    }

    private isCanLuanch(luanchPlayer: mw.Player, playerId: number): boolean {
        let player = Player.getPlayer(playerId);
        if (!player) {
            return false;
        }
        if (playerId == luanchPlayer.playerId) {
            return false;
        }
        //距离判定
        if (mw.Vector.squaredDistance(player.character.worldTransform.position, luanchPlayer.character.worldTransform.position) > this.showFlagDis * this.showFlagDis) {
            return false;
        }
        //是否为接收者
        if (this.isAccepter(playerId)) {
            return false;
        }
        //是否可完成动作
        if (!this.isCanDo(playerId)) {
            return false;
        }
        return true;
    }

    /**
     * 检查是否为接收者
     * @param id 
     */
    private isAccepter(id: number): boolean {
        for (let [key, interactData] of this.interactPlayers) {
            if (id == interactData.accectPlayerId) {
                return true;
            }
        }
        return false;
    }

    /**
     * 发起强制动作
     * @param configId 
     * @returns 
     */
    public net_ForeceAction(configId: number, playerId?: number): void {
        let sendPlayer = this.currentPlayer;
        if (playerId) {
            if (this.isCanForece(sendPlayer, playerId)) {
                this.beginAction(configId, Player.getPlayer(playerId), sendPlayer);
                return;
            }
        } else {
            for (let player of Player.getAllPlayers()) {
                if (!this.isCanForece(sendPlayer, player.playerId)) {
                    continue;
                }
                this.beginAction(configId, player, sendPlayer);
                return;
            }
        }
        this.getClient(sendPlayer).net_ShowTips(0);
    }

    /**
     * 是否可以强制动作
     * @param self 
     * @param playerId 
     */
    private isCanForece(sendPlayer: mw.Player, playerId: number): boolean {
        let player = Player.getPlayer(playerId);
        if (!player) {
            return false;
        }
        if (playerId == sendPlayer.playerId) {
            return false;
        }
        //距离判定
        if (mw.Vector.squaredDistance(player.character.worldTransform.position, sendPlayer.character.worldTransform.position) > this.showFlagDis * this.showFlagDis) {
            return false;
        }
        //角度判定
        let forwardV = sendPlayer.character.worldTransform.getForwardVector().normalized;
        let v = player.character.worldTransform.position.subtract(sendPlayer.character.worldTransform.position).normalized;
        let angle = Math.acos(forwardV.x * v.x + forwardV.y * v.y + forwardV.z * v.z);
        if (angle > Math.PI / 4) {
            return false;
        }
        //是否在交互中
        if (this.isInInteract(playerId)) {
            return false;
        }
        //是否与道具互斥
        if (!this.bagSkip(playerId)) {
            return false;
        }
        //是否为接收者
        if (this.isAccepter(playerId)) {
            return false;
        }
        //是否可完成动作
        if (!this.isCanDo(playerId)) {
            return false;
        }
        return true;
    }

    /**
     * 是否在交互中
     * @param playerId 
     */
    protected abstract isInInteract(playerId: number): boolean;

    /**
     * 接收者道具互斥，无互斥返回true
     * @param playerId 
     */
    protected abstract bagSkip(playerId: number): boolean;

    /**
     * 是否可完成动作
     * @param playerId 
     * @returns 
     */
    public isCanDo(playerId: number): boolean {
        return true;
    }

    /**
     * 开始动作
     * @param playerId 
     */
    public net_PlayAction(playerId: number): void {
        let accectPlayer = this.currentPlayer;
        //距离判断
        let sendPlayer = Player.getPlayer(playerId);
        if (mw.Vector.squaredDistance(sendPlayer.character.worldTransform.position, accectPlayer.character.worldTransform.position) > this.showFlagDis * this.showFlagDis) {
            this.getClient(accectPlayer).net_ShowTips(1);
            return;
        }
        //判断是否已经响应
        if (!this.actionPlayers.has(playerId)) {
            this.getClient(accectPlayer).net_ShowTips(2);
            return;
        }
        //是否为接收者
        if (this.isAccepter(accectPlayer.playerId)) {
            this.getClient(accectPlayer).net_ShowTips(3);
            return;
        }

        let id = this.actionPlayers.get(playerId);
        //移除响应状态
        this.actionPlayers.delete(playerId);
        this.beginAction(id, accectPlayer, sendPlayer);
    }

    /**
     * 开始动作
     * @param id 配置id 
     * @param accectPlayer 接收者
     * @param luanchPlayer 发起者
     */
    private beginAction(id: number, accectPlayer: mw.Player, luanchPlayer: mw.Player): void {
        let config = this.map.get(id);
        if (!config) {
            return;
        }
        if (config.doubleType == ActionDoubleType.Ordinary) {
            //简单动作
            accectPlayer.character.collisionWithOtherCharacterEnabled = false;
            setTimeout(() => {
                accectPlayer.character.worldTransform.position = mw.Vector.add(luanchPlayer.character.worldTransform.position, luanchPlayer.character.worldTransform.getForwardVector().clone().multiply(config.v.length))
                let r = mw.Rotation.zero;
                mw.Rotation.add(luanchPlayer.character.worldTransform.rotation, new mw.Rotation(config.r), r);
                accectPlayer.character.worldTransform.rotation = r;
            }, 100);
            this.getClient(luanchPlayer).net_PlayAction(config.sendStance);
            this.getClient(accectPlayer).net_PlayAction(config.accectStance);
        } else {
            //交互动作
            let interactData = new InteractPlayer();
            this.interactPlayers.set(luanchPlayer.playerId, interactData);
            interactData.start(luanchPlayer, accectPlayer, config);
            interactData.action.add(() => {
                this.getClient(luanchPlayer).net_Interact(luanchPlayer.playerId, false, id);
                this.getClient(accectPlayer).net_Interact(luanchPlayer.playerId, true, id);
            });
        }
        this.setActionMSG(id, accectPlayer);
        this.setActionMSG(id, luanchPlayer);
    }

    protected abstract setActionMSG(id: number, player: mw.Player): void;

    /**
     * 离开交互
     * @param id 
     * @returns 
     */
    public net_LeaveInteract(id: number): void {
        let interactData = this.interactPlayers.get(id);
        if (!interactData) {
            this.getClient(this.currentPlayer).net_Interact(0, false, 0);
            return;
        }

        let sendPlayer = Player.getPlayer(interactData.sendPlayerId);
        let accectPlayer = Player.getPlayer(interactData.accectPlayerId);
        //accectPlayer.character.collisionWithOtherCharacterEnabled = true;
        interactData.leave();
        this.interactPlayers.delete(id);
        this.leaveCheck(sendPlayer);
        this.leaveCheck(accectPlayer);
    }

    /**
     * 判断离开当前交互的发起者，是否仍为其他交互发起或接收者
     * @param player 
     * @returns 
     */
    private leaveCheck(player: mw.Player): void {
        for (let [id, interactData] of this.interactPlayers) {
            if (player.playerId == interactData.sendPlayerId) {
                //仍为发起者
                this.getClient(interactData.sendPlayerId).net_Interact(id, false, interactData.configId);
                return;
            }
            if (player.playerId == interactData.accectPlayerId) {
                //仍为接收者
                this.getClient(interactData.accectPlayerId).net_Interact(id, true, interactData.configId);
                return;
            }
        }
        //完全脱离任何交互动作
        this.getClient(player).net_Interact(0, false, 0);
    }

    /**玩家登录 */
    public net_login(): void {
        let playerId = this.currentPlayer.playerId;
        for (let [id, data] of this.interactPlayers) {
            if (data.sendPlayerId == playerId || data.accectPlayerId == playerId) {
                let accectPlayer = Player.getPlayer(data.accectPlayerId);
                let sendPlayer = Player.getPlayer(data.sendPlayerId);
                //accectPlayer.character.collisionWithOtherCharacterEnabled = true;
                data.reLoginLeave();
                this.interactPlayers.delete(id);
                this.leaveCheck(sendPlayer);
                this.leaveCheck(accectPlayer);
            }
        }
    }
}

export class InteractPlayer {
    public sendPlayerId: number = 0;
    public accectPlayerId: number = 0;
    public interactObj: mw.Interactor = null;
    public action: mw.Action = new mw.Action();
    public configId = 0;

    public start(player1: mw.Player, player2: mw.Player, config: ActionBaseCfg): void {
        this.configId = config.id;
        this.interactObj = SpawnManager.wornSpawn("116") as mw.Interactor;
        this.sendPlayerId = player1.playerId;
        this.accectPlayerId = player2.playerId;
        player1.character.attachToSlot(this.interactObj, mw.HumanoidSlotType.FaceOrnamental);
        player2.character.collisionWithOtherCharacterEnabled = false;
        GeneralManager.modiftEnterInteractiveState(this.interactObj, player2.character).then((suc: boolean) => {
            if (!suc) {
                return;
            }
            this.action.call();
            PlayerManagerExtesion.changeStanceExtesion(player2.character, config.accectStance)
            PlayerManagerExtesion.changeStanceExtesion(player1.character, config.sendStance)
            this.interactObj.localTransform.position = (config.v);
            this.interactObj.localTransform.rotation = (new mw.Rotation(config.r));
        });
    }

    public leave(): void {
        let accectPlayer = Player.getPlayer(this.accectPlayerId);
        let sendPlayer = Player.getPlayer(this.sendPlayerId);
        GeneralManager.modifyExitInteractiveState(this.interactObj, accectPlayer.character.worldTransform.position.add(accectPlayer.character.worldTransform.getForwardVector().multiply(100)));
        PlayerManagerExtesion.changeStanceExtesion(sendPlayer.character, "")
        PlayerManagerExtesion.changeStanceExtesion(accectPlayer.character, "")
        this.interactObj.onLeave.add(() => {
            PlayerManagerExtesion.changeStanceExtesion(sendPlayer.character, "")
            PlayerManagerExtesion.changeStanceExtesion(accectPlayer.character, "")
        });
        setTimeout(() => {
            this.interactObj.destroy();
        }, 5000);
    }

    public reLoginLeave(): void {
        let accectPlayer = Player.getPlayer(this.accectPlayerId);
        let sendPlayer = Player.getPlayer(this.sendPlayerId);
        if (accectPlayer) {
            GeneralManager.modifyExitInteractiveState(this.interactObj, accectPlayer.character.worldTransform.position.add(accectPlayer.character.worldTransform.getForwardVector().multiply(100)));
            PlayerManagerExtesion.changeStanceExtesion(accectPlayer.character, "")
        }
        if (sendPlayer) {
            PlayerManagerExtesion.changeStanceExtesion(sendPlayer.character, "")
        }

        setTimeout(() => {
            this.interactObj.destroy();
        }, 5000);
    }
}