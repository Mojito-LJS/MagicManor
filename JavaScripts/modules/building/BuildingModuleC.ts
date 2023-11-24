import { GeneralManager, } from '../../Modified027Editor/ModifiedStaticAPI';
import { CameraCG } from "module_cameracg";
import { UIManager } from "../../ExtensionType";
import { GameConfig } from "../../config/GameConfig";
import { EventsName } from "../../const/GameEnum";
import { GlobalData } from "../../const/GlobalData";
import { GlobalModule } from "../../const/GlobalModule";
import Tips from "../../ui/commonUI/Tips";
import { BagUtils } from "../bag/BagUtils";
import { ResponseType } from "../relation/RelationModuleC";
import { TaskReward } from "../task/ui/TaskReward";
import { Building } from "./Building";
import BuildingData, { BuildingType } from "./BuildingData";
import BuildingModuleS, { ManorState } from "./BuildingModuleS";
import { ManorInteract } from "./ui/ManorInteract";
import { HomeDressModuleC } from "../home/dress/HomeDressModuleC";

export type ManorInfo = {
    id: number,
    state: ManorState,
    manor: number,
    level: number,
}

export enum RequestType {
    Invite,
    Visit,
}

export default class BuildingModuleC extends ModuleC<BuildingModuleS, BuildingData>{
    public readonly refreshManorPlayerList: Action = new Action()
    /** 玩家建筑布局 */
    private _buildingMap: Map<BuildingType, Building> = new Map()
    /**建筑对象池 */
    private _buildingPool: Map<string, Building[]> = new Map()

    public get manorLevel() {
        return this.data.manorLevel;
    }

    public get lockBuildings() {
        return this.data.lockBuildings;
    }

    public get equipBuildings() {
        return this.data.equipBuildings;
    }

    protected onStart(): void {
    }

    protected onEnterScene(sceneType: number): void {
        GlobalData.ManorState = ManorState.Free;
    }

    public requestManorPlayerList() {
        this.server.net_RequestManorPlayerList();
    }

    public net_RequestManorPlayerList(playersId: number[], playersState: number[], playersManor: number[], playersLevel: number[]) {
        this.refreshManorPlayerList.call(playersId, playersState, playersManor, playersLevel);
    }

    public sendManorRequest(invitee: number, type: RequestType) {
        this.server.net_SendManorRequest(invitee, type);
    }

    public net_ReceiveManorRequest(inviter: number, type: RequestType) {
        UIManager.show(ManorInteract, inviter, type);
    }

    public responseRequest(inviter: number, requestType: RequestType, responseType: ResponseType) {
        this.server.net_ResponseRequest(inviter, requestType, responseType)
    }

    public net_OnResponse(invitee: number, responseType: ResponseType) {
        const name = BagUtils.getName(invitee)
        UIManager.hide(ManorInteract);
        if (responseType === ResponseType.Refuse) {
            Tips.show(name + GameConfig.SquareLanguage.Danmu_Content_1074.Value);
            return;
        }
        Tips.show(name + GameConfig.SquareLanguage.Danmu_Content_1073.Value);
    }

    public net_ChangeManor(manor: number, buildings: number[]) {
        GlobalData.ManorState = ManorState.Visit;
        this.localPlayer.character.worldTransform.position = GlobalData.globalPos;
        this.createBuildings(manor, buildings);
        Event.dispatchToLocal(EventsName.ManorChange, GlobalData.ManorState);
        Event.dispatchToLocal(EventsName.EnterBuilding, false);
    }

    public net_PlayerManorChange(playerId: number, manorPlayers: number[]) {
        /**对改变庄园的玩家进行处理 */
        if (playerId === this.localPlayerId) {
            for (const player of Player.getAllPlayers()) {
                const id = player.playerId
                if (id === this.localPlayerId) {
                    continue;
                }
                if (manorPlayers.includes(id)) {
                    GlobalModule.MyPlayerC.setPlayerVisible(id, true);
                } else {
                    GlobalModule.MyPlayerC.setPlayerVisible(id, false);
                }
            }
            return;
        }
        /**对其他玩家进行处理 */
        if (!manorPlayers.includes(this.localPlayerId)) {
            GlobalModule.MyPlayerC.setPlayerVisible(playerId, false);
        } else {
            GlobalModule.MyPlayerC.setPlayerVisible(playerId, true);
        }
    }

    public goHome() {
        GlobalData.ManorState = ManorState.Free;
        this.localPlayer.character.worldTransform.position = GlobalData.globalPos;
        this.createBuildings(this.localPlayer.playerId);
        this.server.net_PlayerGoHome();
        Event.dispatchToLocal(EventsName.ManorChange, GlobalData.ManorState);
    }

    /**
     * 增加庄园等级
     */
    public addManorLevel() {
        this.data.addManorLevel();
        this.server.net_AddManorLevel();
    }

    /** 
     * 添加解锁建筑数据
     * @param  id
     * @return 
     */
    public async addBuilding(id: number, isSpawn: boolean = true) {
        const config = GameConfig.Building.getElement(id);
        if (!config) {
            console.error("配置表不存在此建筑: " + id);
            return;
        }
        this.data.addBuilding(id);
        this.server.net_AddBuilding(id);
        if (isSpawn) {
            await this.createBuilding(id);
        }
    }

    /** 
     * 删除解除建筑数据
     * @param  id
     * @return 
     */
    public subBuilding(id: number) {
        this.data.subBuilding(id);
        this.server.net_SubBuilding(id);
        if (this.equipBuildings.includes(id)) {
            this.destroyBuildingById(id);
        }
    }

    /** 
     * 添加场景建筑数据
     * @param  id
     * @return 
     */
    public loadBuilding(id: number) {
        this.data.loadBuilding(id);
        this.server.net_LoadBuilding(id);
    }

    /** 
     * 清除场景建筑数据
     * @param  id
     * @return 
     */
    public unLoadBuilding(id: number) {
        this.data.unloadBuilding(id);
        this.server.net_UnloadBuilding(id);
    }

    /** 
     * 清除场景所有建筑数据
     * @return 
     */
    public clearEquipBuildings() {
        this.data.clearEquipBuildings();
        this.server.net_ClearEquipBuildings();
    }

    private async spawnBuilding(id: number, guid: string) {
        let objPool: Building[]
        if (!this._buildingPool.has(guid)) {
            objPool = []
            this._buildingPool.set(guid, objPool)
        } else {
            objPool = this._buildingPool.get(guid);
        }
        let building: Building;
        let isNew: boolean = true
        for (let i = 0; i < objPool.length; i++) {
            const element = objPool[i]
            if (!element.isActive) {
                building = element;
                isNew = false;
                break;
            }
        }
        if (isNew) {
            building = new Building(id, guid);
            objPool.push(building)
        }
        await building.spawn(true);
        return building
    }

    /** 
     * 生成建筑群，不传默认为数据里的选择的，不对数据做改变
     * @param  manor
     * @param  buildings
     * @return 
     */
    public async createBuildings(manor: number, buildings?: number[]) {
        if (!buildings) {
            buildings = this.equipBuildings;
        }
        this.destroyBuildings();
        for (const id of buildings) {
            const config = GameConfig.Building.getElement(id);
            if (!config) {
                continue;
            }
            if (this._buildingMap.has(config.SlotType)) {
                const building = this._buildingMap.get(config.SlotType);
                building.despawn()
                this._buildingMap.delete(config.SlotType);
            }
            const buildingObj = await this.spawnBuilding(config.ID, config.Guid);
            this._buildingMap.set(config.SlotType, buildingObj);
            buildingObj.obj.worldTransform.position = config.Location;
            this.setGroundVisible(config.SlotType, false);
        }

        this.refreshBuildingDress(manor, buildings);
    }

    /** 
     * 生成建筑，对数据做改变
     * @param  id
     * @return 
     */
    public createBuilding(id: number) {
        this.server.net_CreateBuilding(id);
    }

    public async net_SyncManorChange(manor: number, buildingId: number) {
        const config = GameConfig.Building.getElement(buildingId);
        if (!config) {
            console.error("配置表不存在此建筑: " + buildingId);
            return;
        }
        const isOwner = this.localPlayerId === manor
        if (config.Effect) {
            GeneralManager.rpcPlayEffectAtLocation(config.Effect, config.Location, 1, mw.Rotation.zero, config.EffectScale);
        }
        if (this._buildingMap.has(config.SlotType)) {
            const building = this._buildingMap.get(config.SlotType);
            if (building.id === buildingId) {
                return;
            }
            isOwner && this.unLoadBuilding(building.id);
            building.despawn()
            this._buildingMap.delete(config.SlotType);
        }
        isOwner && this.loadBuilding(config.ID);
        const buildingObj = await this.spawnBuilding(config.ID, config.Guid);
        this._buildingMap.set(config.SlotType, buildingObj);
        buildingObj.obj.worldTransform.position = config.Location;
        this.setGroundVisible(config.SlotType, false);

        const buildings: number[] = [];
        for (const [key, value] of this._buildingMap) {
            buildings.push(value.id);
        }
        this.refreshBuildingDress(manor, buildings);
    }

    public reselectBuilding(buildings: number[]) {
        UIManager.show(TaskReward, { buildings: buildings }, (buildings: number[]) => {
            UIManager.hide(TaskReward);
            CameraCG.instance.play(GlobalData.buildingCG, async () => {
                for (const id of buildings) {
                    await this.addBuilding(id);
                }
                SoundService.playSound("176452");
                setTimeout(() => {
                    CameraCG.instance.exitFreeCamera();
                }, 2000);
            }, false)
        });
    }

    /** 
     * 清空场景里的所有建筑
     * @param  isClear 是否清除数据
     * @return 
     */
    public destroyBuildings(isClear: boolean = false) {
        for (const [type, building] of this._buildingMap) {
            building.despawn();
            this._buildingMap.delete(type);
            this.setGroundVisible(type, true);
        }
        if (isClear) {
            this.clearEquipBuildings();
        }
    }

    /** 
     * 通过建筑ID销毁场景里的建筑
     * @param  id 建筑表ID
     * @return 
     */
    public destroyBuildingById(id: number) {
        const config = GameConfig.Building.getElement(id);
        if (!config) {
            console.error("配置表不存在此建筑: " + id);
            return;
        }
        for (const [type, building] of this._buildingMap) {
            if (building.id === id) {
                this.unLoadBuilding(id);
                building.despawn();
                this._buildingMap.delete(type);
                this.setGroundVisible(type, true);
                break;
            }
        }

        //TODO 卸载装饰同步
    }

    /** 
     * 通过建筑类型销毁场景里的建筑
     * @param  type 建筑类型
     * @return 
     */
    public destroyBuildingByType(type: BuildingType) {
        if (!this._buildingMap.has(type)) {
            console.error("场景没有此类型的建筑: " + type);
            return;
        }
        const building = this._buildingMap.get(type);
        this.unLoadBuilding(building.id);
        building.despawn();
        this._buildingMap.delete(type);
        this.setGroundVisible(type, true);
    }

    private refreshBuildingDress(manor: number, buildings: number[]) {
        const homeDressModuleC = ModuleService.getModule(HomeDressModuleC);
        homeDressModuleC.clearDress();
        homeDressModuleC.initDress(manor, buildings);
    }

    private async setGroundVisible(type: BuildingType, visible: boolean) {
        let ground: mw.GameObject
        switch (type) {
            case BuildingType.BackPorch:
                ground = await GameObject.asyncFindGameObjectById(GlobalData.GroundOne)
                break;
            case BuildingType.Atrium:
                ground = await GameObject.asyncFindGameObjectById(GlobalData.GroundTwo)
                break;
            case BuildingType.RestPavilion:
                ground = await GameObject.asyncFindGameObjectById(GlobalData.GroundThree)
                break;
            case BuildingType.Corridor:
                ground = await GameObject.asyncFindGameObjectById(GlobalData.GroundFour)
                break;
            case BuildingType.Pond:
                ground = await GameObject.asyncFindGameObjectById(GlobalData.GroundFive)
                break;
            default:
                break;
        }
        const status = visible ? mw.PropertyStatus.On : mw.PropertyStatus.Off;
        if (ground) {
            ground.setVisibility(status, true);
        }
    }
}

