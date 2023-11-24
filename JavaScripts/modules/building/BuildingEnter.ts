import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';
import { EventsName } from "../../const/GameEnum";
import { GlobalData } from "../../const/GlobalData";
import { BuildingHelper, BuildingInfo } from "../home/BuildingHelper";
import { ManorState } from "./BuildingModuleS";

@Component
export default class BuildingEnter extends mw.Script {
    @mw.Property({ displayName: "建筑ID" })
    public BuildingID: number = 0;


    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        const playerId = Player.localPlayer.playerId;
        const handle = setInterval(() => {
            if (this.gameObject) {
                clearInterval(handle);
            } else {
                return;
            }
            const trigger = this.gameObject.getChildByName("trigger") as mw.Trigger;
            trigger.onEnter.add((go: mw.GameObject) => {
                if (PlayerManagerExtesion.isCharacter(go)) {
                    if (go.player.playerId !== playerId) return;
                    logI("玩家 : " + go.player.playerId + " 进入");
                    if (GlobalData.ManorState === ManorState.Visit) {
                        BuildingHelper.enterBuilding()
                        return;
                    }
                    const info = new BuildingInfo();
                    info.owner = go.player.playerId;
                    info.buildingID = this.BuildingID;
                    info.buildingGo = this.gameObject;
                    info.cfgId = this.BuildingID;
                    BuildingHelper.enterBuilding(info);
                    Event.dispatchToLocal(EventsName.EnterBuilding, true);
                }
            });
            trigger.onLeave.add((go: mw.GameObject) => {
                if (PlayerManagerExtesion.isCharacter(go)) {
                    if (go.player.playerId !== playerId) return;
                    BuildingHelper.enterBuilding()
                    Event.dispatchToLocal(EventsName.EnterBuilding, false);
                }
            });
        }, 100);
    }

    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    protected onUpdate(dt: number): void { }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void { }
}