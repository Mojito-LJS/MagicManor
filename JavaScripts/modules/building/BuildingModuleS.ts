import { ResponseType } from "../relation/RelationModuleC";
import BuildingData from "./BuildingData";
import BuildingModuleC, { RequestType } from "./BuildingModuleC";

export enum ManorState {
    /**在自己庄园 */
    Free = 1,
    /**在别人庄园 */
    Visit = 2,
}

export default class BuildingModuleS extends ModuleS<BuildingModuleC, BuildingData>{
    /**玩家所在庄园 */
    private _manorPlayers: Map<number, { state: ManorState, manor: number }> = new Map();

    protected onStart(): void {

    }

    protected onPlayerEnterGame(player: mw.Player): void {
        const playerId = player.playerId;
        if (!this._manorPlayers.has(playerId)) {
            this._manorPlayers.set(playerId, { state: ManorState.Free, manor: playerId });
        }
    }

    protected onPlayerLeft(player: mw.Player): void {
        const playerId = player.playerId;
        if (this._manorPlayers.has(playerId)) {
            this._manorPlayers.delete(playerId);
        }
    }

    public getManorPlayers(playerId: number) {
        const manorPlayers: number[] = [];
        for (const [id, info] of this._manorPlayers) {
            if (info.manor === playerId) {
                manorPlayers.push(id);
            }
        }
        return manorPlayers;
    }

    public net_RequestManorPlayerList() {
        const playersId: number[] = [];
        const playersState: number[] = [];
        const playersManor: number[] = [];
        const playersLevel: number[] = [];
        for (const [id, info] of this._manorPlayers) {
            if (id === this.currentPlayerId) {
                continue;
            }
            const level = this.getPlayerData(id).manorLevel;
            playersId.push(id);
            playersManor.push(info.manor);
            playersState.push(info.state);
            playersLevel.push(level);
        }
        this.getClient(this.currentPlayer).net_RequestManorPlayerList(playersId, playersState, playersManor, playersLevel);
    }

    public net_SendManorRequest(invitee: number, type: RequestType) {
        this.getClient(invitee).net_ReceiveManorRequest(this.currentPlayerId, type);
    }

    public net_ResponseRequest(inviter: number, requestType: RequestType, responseType: ResponseType) {
        if (responseType === ResponseType.Accept) {
            let manor = inviter;
            let player = this.currentPlayerId
            if (requestType === RequestType.Visit) {
                manor = this.currentPlayerId
                player = inviter
            }
            const manorPlayers: number[] = [];
            const info = this._manorPlayers.get(player)
            info.state = ManorState.Visit;
            info.manor = manor;
            for (const [id, info] of this._manorPlayers) {
                if (info.manor === manor) {
                    manorPlayers.push(id);
                }
            }
            const buildings = this.getPlayerData(manor).equipBuildings;
            this.getClient(player).net_ChangeManor(manor, buildings);
            this.getAllClient().net_PlayerManorChange(player, manorPlayers);
        }
        this.getClient(inviter).net_OnResponse(this.currentPlayerId, responseType);
    }

    public net_PlayerGoHome() {
        const manorPlayers: number[] = [];
        const info = this._manorPlayers.get(this.currentPlayerId)
        info.state = ManorState.Free;
        info.manor = this.currentPlayerId;
        for (const [id, info] of this._manorPlayers) {
            if (info.manor === this.currentPlayerId) {
                manorPlayers.push(id);
            }
        }
        this.getAllClient().net_PlayerManorChange(this.currentPlayerId, manorPlayers);
    }

    public net_CreateBuilding(buildingId: number) {
        for (const [playerId, info] of this._manorPlayers) {
            if (info.manor === this.currentPlayerId) {
                this.getClient(playerId).net_SyncManorChange(this.currentPlayerId, buildingId);
            }
        }
    }

    public net_AddManorLevel() {
        this.getPlayerData(this.currentPlayer).addManorLevel()
    }

    public net_AddBuilding(id: number) {
        this.getPlayerData(this.currentPlayer).addBuilding(id);
    }

    public net_SubBuilding(id: number) {
        this.getPlayerData(this.currentPlayer).subBuilding(id);
    }

    public net_LoadBuilding(id: number) {
        this.getPlayerData(this.currentPlayer).loadBuilding(id);
    }

    public net_UnloadBuilding(id: number) {
        this.getPlayerData(this.currentPlayer).unloadBuilding(id);
    }

    public net_ClearEquipBuildings() {
        this.getPlayerData(this.currentPlayer).clearEquipBuildings();
    }
}