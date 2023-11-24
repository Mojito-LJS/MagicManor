import { EventsName } from "../../const/GameEnum";
import InteractObject, { InteractiveHelper } from "./interactLogic/InteractObject";
import InteractMgr from "./InteractMgr";
import { InteractModuleClient } from "./InteractModuleClient";

export class InteractModuleServer extends ModuleS<InteractModuleClient, null>  {
    onStart(): void {
        Player.onPlayerLeave.add((player: mw.Player) => {
            this.unActiveInteract(player.playerId)
        });
        Event.addClientListener(EventsName.CancelActive, (player) => {
            this.unActiveInteract(player.playerId)
        })
    }

    public net_EnterScene() {
        InteractMgr.instance.initInteract()
    }

    public unActiveInteract(playerID: number) {
        if (Player.getPlayer(playerID)) {
            this.getClient(playerID).net_UnActiveInteract()
            InteractiveHelper.onPlayInteract(playerID, false);
            let interacts = InteractMgr.instance.findInteract(playerID)
            if (interacts.length > 0) {
                for (const interact of interacts) {
                    interact.logic.onPlayerAction(playerID, false)
                    if (interact.own) {
                        interact.ownerPlayerIds[0] = 0
                    } else {
                        interact.ownerPlayerIds[interact.ownerPlayerIds.indexOf(playerID)] = 0
                    }
                }
            }
        }
    }

    public net_ActiveHandle(guid: string, flag: boolean, param?: any, player?: mw.Player) {
        const interact = InteractMgr.instance.getInteract(guid)
        if (!interact) return
        const playerId = player.playerId
        if (flag) {
            if (interact.own && interact.ownerPlayerIds[0] != 0) {
                return "有人了";
            }
            // if (InteractiveHelper.playInteractionEnable(player)) {
            //     return "不能同时交互两个交互物";
            // }
            // if (!StringUtil.isEmpty(interact.activeCondition) && !InteractiveHelper.activeConditions(interact.activeCondition)) {
            //     return "外部条件不满足";
            // }
            this.playerAction(interact, playerId, true, param)
        } else {
            // if (!interact.ownerPlayerIds.includes(playerId)) {
            //     return "未和此物交互";
            // }
            this.playerAction(interact, playerId, false, param)
        }
    }

    public playerAction(interact: InteractObject, playerId: number, active: boolean, param?: any) {
        if (!interact) return
        if (active) {
            if (interact.own) {
                InteractiveHelper.onPlayInteract(playerId, true);
                interact.ownerPlayerIds[0] = playerId
            } else {
                if (interact.ownerPlayerIds.includes(0)) {
                    interact.ownerPlayerIds[interact.ownerPlayerIds.indexOf(0)] = playerId
                } else {
                    interact.ownerPlayerIds.push(playerId)
                }
            }
        } else {
            if (interact.own) {
                InteractiveHelper.onPlayInteract(playerId, false);
                interact.ownerPlayerIds[0] = 0
            } else {
                interact.ownerPlayerIds[interact.ownerPlayerIds.indexOf(playerId)] = 0
            }
        }
        interact.logic.onPlayerAction(playerId, active, param)
        if (interact.nextInteractGuid != "" && !interact.blockInteractNext) {
            this.playerAction(InteractMgr.instance.getInteract(interact.nextInteractGuid), playerId, active, param)
        }
    }

}