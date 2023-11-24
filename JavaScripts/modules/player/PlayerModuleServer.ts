/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-05-18 14:28
 * @LastEditTime : 2023-05-18 15:11
 * @description  : 
 */
import IPlayerModuleBase from "./base/IPlayerModuleBase";
import { ClothModuleS } from "./modules/ClothModule";
import { HeadUIModuleS } from "./modules/HeadUIModule";
import { StateModuleS } from "./modules/StateModule";
import PlayerModuleClient from "./PlayerModuleClient";

/**
 * @Author       : 田可成
 * @Date         : 2023-05-08 16:50:26
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-05-09 11:04:59
 * @FilePath     : \mollywoodschool\JavaScripts\modules\player\PlayerModuleServer.ts
 * @Description  : 
 */
export default class PlayerModuleServer extends ModuleS<PlayerModuleClient, null> implements IPlayerModuleBase {
    public Cloth: ClothModuleS
    public HeadUI: HeadUIModuleS
    public State: StateModuleS

    protected onStart(): void {
        this.Cloth = new ClothModuleS(this)
        this.HeadUI = new HeadUIModuleS(this)
        this.State = new StateModuleS(this)
    }

    protected async onPlayerEnterGame(player: mw.Player): Promise<void> {
        await this.Cloth.onPlayerEnterGame(player)
        await this.HeadUI.onPlayerEnterGame(player)
        await this.State.onPlayerEnterGame(player)
        this.getAllClient().net_AddPlayer(player.playerId);
    }

    protected onPlayerLeft(player: mw.Player): void {
        this.Cloth.onPlayerLeft(player)
        this.HeadUI.onPlayerLeft(player)
        this.State.onPlayerLeft(player)
    }
}