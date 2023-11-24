import { EventsName } from "../../const/GameEnum";
import IPlayerModuleBase from "./base/IPlayerModuleBase";
import { ClothModuleC } from "./modules/ClothModule";
import { HeadUIModuleC } from "./modules/HeadUIModule";
import { StateModuleC } from "./modules/StateModule";
import PlayerModuleServer from "./PlayerModuleServer";

export default class PlayerModuleClient extends ModuleC<PlayerModuleServer, null> implements IPlayerModuleBase {
    public Cloth: ClothModuleC
    public HeadUI: HeadUIModuleC
    public State: StateModuleC

    protected onStart(): void {
        this.Cloth = new ClothModuleC(this)
        this.HeadUI = new HeadUIModuleC(this)
        this.State = new StateModuleC(this)
    }

    protected async onEnterScene(sceneType: number): Promise<void> {
        await Player.asyncGetLocalPlayer();
        if (!this.localPlayer) {
            console.error("玩家初始化可能失败了")
            return;
        }
        await this.Cloth.onEnterScene(sceneType)
        await this.HeadUI.onEnterScene(sceneType)
        await this.State.onEnterScene(sceneType)

        /**设置玩家碰撞 */
        const character = Player.localPlayer.character
        character.collisionWithOtherCharacterEnabled = false;
        /**设置玩家隐藏 */
        for (const player of Player.getAllPlayers()) {
            if (this.localPlayerId !== player.playerId) {
                player.character.setVisibility(mw.PropertyStatus.Off);
            }
        }

        Event.addLocalListener(EventsName.LoadProp, (playerId: number) => {
            if (playerId === this.localPlayerId) return;
            this.refreshPlayerVisible(playerId);
        })
        Event.addServerListener(EventsName.LoadProp, (playerId: number) => {
            if (playerId === this.localPlayerId) return;
            this.refreshPlayerVisible(playerId);
        })

        setTimeout(() => {
            let humanV2 = Player.localPlayer.character.getDescription()
            if (humanV2.advance.bodyFeatures.body.height > 1.2)
                humanV2.advance.bodyFeatures.body.height = 1.2, true;
        }, 3000);
    }

    public net_AddPlayer(playerId: number) {
        if (playerId !== this.localPlayerId) {
            const player = Player.getPlayer(playerId)
            if (!player) {
                return
            }
            player.character.setVisibility(mw.PropertyStatus.Off);
        }
    }

    /**
     * 对某个玩家角色显隐
     * @param playerId 
     * @param visible 
     */
    public setPlayerVisible(playerId: number, visible: boolean) {
        const status = visible ? mw.PropertyStatus.On : mw.PropertyStatus.Off
        const player = Player.getPlayer(playerId)
        if (!player) {
            return
        }
        player.character.setVisibility(status);
    }

    private refreshPlayerVisible(playerId: number) {
        TimeUtil.delayExecute(() => {
            const player = Player.getPlayer(playerId)
            if (!player) {
                return
            }
            const character = player.character
            if (!character.getVisibility()) {
                character.setVisibility(mw.PropertyStatus.Off);
            }
        }, 3)
    }
}
