import { GameConfig } from "../../config/GameConfig";
import { BagModuleS } from "../bag/BagModuleS";
import PlayerModuleServer from "../player/PlayerModuleServer";
import { ActionBaseMS } from "../squareBase/ActionBase/ActionBaseMS";
import ActionData from "./ActionData";
import { ActionModuleClient } from "./ActionModuleClient";

//服务端
export class ActionModuleServer extends ActionBaseMS<ActionModuleClient, null>{

    public onStart(): void {
        super.onStart();
    }

    protected initConfig(): void {
        let configs = GameConfig.SquareActionConfig.getAllElement();
        for (let config of configs) {
            this.map.set(config.ID, ActionData.get(config));
        }
    }
    /**
     * 是否在双人动作中
     * @param playerId 
     */
    public isInDoubleAction(playerId: number): boolean {
        for (let [id, data] of this.interactPlayers) {
            if (playerId == id) {
                return true;
            }
            if (data.accectPlayerId == playerId) {
                return true;
            }
        }
        return false;
    }

    protected bagSkip(playerId: number): boolean {
        return ModuleService.getModule(BagModuleS).isCanDoElse(3, playerId);
    }

    public isInInteract(playerId: number): boolean {
        return ModuleService.getModule(PlayerModuleServer).State.playerIsBusy(playerId);
    }

    protected setActionMSG(id: number, player: mw.Player): void {
        this.getClient(player).net_SetActionMSG(id);
    }

}