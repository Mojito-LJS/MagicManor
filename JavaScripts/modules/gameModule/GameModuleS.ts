import { GameModuleData } from "./GameData";
import { IGameModuleC } from "./GameModuleC";

export interface IGameModuleS {
    net_ResetPos(pos: mw.Vector): void;
    net_PlayerLogin(nickName: string): void;
}
//服务端
export class GameModuleS extends ModuleS<IGameModuleC, GameModuleData> implements IGameModuleS {
    private jumpNum: number = 0;
    private playerNickNameMap: Map<number, string>;

    onStart() {
        this.playerNickNameMap = new Map<number, string>();
    }

    onUpdate(dt: number) {

    }
    onPlayerLeft(player: mw.Player): void {
        if (this.playerNickNameMap.has(player.playerId)) {
            this.playerNickNameMap.delete(player.playerId);
        }
    }
    /**
     * 重置位置
     */
    public net_ResetPos(pos: mw.Vector): void {
        this.currentPlayer.character.worldTransform.position = pos;
    }

    public net_PlayerLogin(nickName: string) {
        if (this.playerNickNameMap.has(this.currentPlayerId)) {
            return
        }
        this.playerNickNameMap.set(this.currentPlayerId, nickName)
    }

    public getAllPlayerNickName() {
        return this.playerNickNameMap;
    }
}