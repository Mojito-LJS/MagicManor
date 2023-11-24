import { GeneralManager, } from '../../../Modified027Editor/ModifiedStaticAPI';
import { GameConfig } from "../../../config/GameConfig";
import { EventsName } from "../../../const/GameEnum";
import { GlobalData } from "../../../const/GlobalData";
import { EffectManager, GoPool } from "../../../ExtensionType";
import { ModuleBaseC, ModuleBaseS } from "../base/ModuleBase";

/**
 * @Author       : 田可成
 * @Date         : 2023-05-08 17:18:52
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-05-08 18:13:33
 * @FilePath     : \mollywoodschool\JavaScripts\modules\player\modules\ClothModule.ts
 * @Description  : 
 */
export enum EmFacadPart {
    /**套装 */
    Suit = 0,
    /**上衣 */
    BodyUpper = 1,
    /**下衣 */
    BodyLower,
    /**前发 */
    HairFront,
    /**后发 */
    HairBack,
    /**手套 */
    Gloves,
    /**鞋子 */
    Shoe,
}
enum ClothEvent {
    net_ClearAllCloth = "net_ClearAllCloth",
    net_CreateStaticModel = "net_CreateStaticModel",
    net_ClearModel = "net_ClearModel",
    net_CreateEffect = "net_CreateEffect",
    net_ClearEffect = "net_ClearEffect",
}

export class ClothModuleC extends ModuleBaseC {
    private _toolKey: Map<EmFacadPart, string> = new Map([
        [EmFacadPart.BodyUpper, "upperCloth"],
        [EmFacadPart.BodyLower, "lowerCloth"],
        [EmFacadPart.HairFront, "frontHair"],
        [EmFacadPart.HairBack, "behindHair"],
        [EmFacadPart.Gloves, "gloves"],
        [EmFacadPart.Shoe, "shoe"],
    ]);
    public meshChangeCloth(meshArr: string[]) {
        const v2 = this.localPlayer.character.getDescription() as mw.CharacterDescription
        if (!v2)
            return;
        this._toolKey.forEach((value, key) => {
            const meshGuid = meshArr[key]
            const mesh = v2[value]
            mesh.setMesh(meshGuid)
        });
        this.localPlayer.character.syncDescription();
    }
    public resetPlayerCloth(playerID: number) {
        Event.dispatchToServer(ClothEvent.net_ClearAllCloth, true)
        this.downloadData();
    }

    public downloadData() {
        Event.dispatchToLocal(EventsName.PlayerResetCloth);
        mw.AccountService.downloadData(this.localPlayer.character);
        GlobalData.clothConfigID = -1;
    }

    /**创建静态模型 */
    public createStaticModel(modelIDs: number[], isCloth: boolean = true) {
        Event.dispatchToServer(ClothEvent.net_CreateStaticModel, modelIDs, isCloth)
    }

    public clearModel(modelID: number) {
        Event.dispatchToServer(ClothEvent.net_ClearModel, modelID)
    }

    /**创建一个衣服挂件类型的特效 */
    public createEffect(effectIDs: number[]) {
        Event.dispatchToServer(ClothEvent.net_CreateEffect, effectIDs)
    }
    public clearEffect() {
        Event.dispatchToServer(ClothEvent.net_ClearEffect)
    }
    public clearAllModelAndEffect() {
        Event.dispatchToServer(ClothEvent.net_ClearAllCloth, true)
    }
}

export class ClothModuleS extends ModuleBaseS {
    /**存储玩家对应的特效ID */
    private savePlayerEffect: Map<number, number[]> = new Map();
    /**存储玩家对应的静态模型ID */
    private savePlayerModel: Map<number, { isCloth: boolean, modelID: number, obj: mw.GameObject }[]> = new Map();

    protected onStart() {
        DataCenterS.onPlayerLeave.add((player) => {
            this.net_ClearAllCloth(player.playerId, false);
        });
        Event.addClientListener(ClothEvent.net_ClearAllCloth, (player: mw.Player, isCloth: boolean) => {
            this.net_ClearAllCloth(player.playerId, isCloth)
        })
        Event.addClientListener(ClothEvent.net_CreateStaticModel, (player: mw.Player, modelIDs: number[], isCloth: boolean) => {
            this.net_CreateStaticModel(player.playerId, modelIDs, isCloth)
        })

        Event.addClientListener(ClothEvent.net_ClearModel, (player: mw.Player, modelID: number) => {
            this.net_ClearModel(player.playerId, modelID)
        })

        Event.addClientListener(ClothEvent.net_CreateEffect, (player: mw.Player, effectIDs: number[]) => {
            this.net_CreateEffect(player.playerId, effectIDs)
        })

        Event.addClientListener(ClothEvent.net_ClearEffect, (player: mw.Player) => {
            this.net_ClearEffect(player.playerId)
        })

    }

    public async net_CreateStaticModel(playerID: number, modelIDs: number[], isCloth: boolean = true) {
        let char = Player.getPlayer(playerID).character;

        for (let i = 0; i < modelIDs.length; i++) {
            const modelID = modelIDs[i];
            if (!this.savePlayerModel.has(playerID)) {
                this.savePlayerModel.set(playerID, []);
            }
            let modelArr = this.savePlayerModel.get(playerID);
            for (const iterator of modelArr) {
                if (iterator.modelID == modelID) {
                    return;
                }
            }

            let modelConfig = GameConfig.Model.getElement(modelID);
            let modelObj = await GoPool.asyncSpawn(modelConfig.ModelGuid);
            modelArr.push({ isCloth: isCloth, modelID: modelID, obj: modelObj })

            char.attachToSlot(modelObj, modelConfig.ModelPoint);
            modelObj.localTransform.position = (modelConfig.ModelLocation);
            modelObj.localTransform.rotation = (modelConfig.ModelRotate.toRotation());
            modelObj.localTransform.scale = (modelConfig.ModelLarge);
            modelObj.setCollision(mw.PropertyStatus.Off);
        }
        Event.dispatchToAllClient(EventsName.LoadProp, playerID)
    }

    public net_CreateEffect(playerId: number, effectIDs: number[]) {
        let char = Player.getPlayer(playerId).character;
        effectIDs.forEach((effID) => {
            let effConfig = GameConfig.Effect.getElement(effID);
            let effNum = null;//特效播放方式 ==> 循环/次数
            let effIsTime: boolean = false;//特效是否到时间停止

            if (effConfig.EffectTime < 0) {//时间
                effNum = 0;
                effIsTime = true;
            } else if (effConfig.EffectTime > 0) {//次数
                effNum = effConfig.EffectTime;
                effIsTime = false;
            } else if (effConfig.EffectTime == 0) {//循环
                effNum = 0;
                effIsTime = false;
            }

            if (effNum == null) {
                console.error("特效播放次数有问题 effTime = " + effConfig.EffectTime);
                return;
            }
            let effectID = GeneralManager.rpcPlayEffectOnPlayer(
                effConfig.EffectID,
                char.player,
                effConfig.EffectPoint,
                effNum,
                effConfig.EffectLocation,
                effConfig.EffectRotate.toRotation(),
                effConfig.EffectLarge
            );

            if (!this.savePlayerEffect.has(playerId)) {
                this.savePlayerEffect.set(playerId, []);
            }

            let effArr = this.savePlayerEffect.get(playerId);
            if (!effArr.includes(effectID)) {
                effArr.push(effectID);
            }
            if (!effIsTime) { return; }

            setTimeout(() => {
                EffectService.stop(effectID);
            }, effConfig.EffectTime);
        })
    }

    public net_ClearEffect(playerId: number) {
        if (this.savePlayerEffect.has(playerId)) {
            this.savePlayerEffect.get(playerId).forEach((effID) => {
                EffectService.stop(effID);
            })
            this.savePlayerEffect.get(playerId).length = 0;
        }
    }

    public net_ClearModel(playerId: number, modelID: number) {
        if (this.savePlayerModel.has(playerId)) {
            const modelArr = this.savePlayerModel.get(playerId)
            for (let i = 0; i < modelArr.length; i++) {
                const model = modelArr[i];
                if (modelID == model.modelID) {
                    model.obj.parent = null
                    GoPool.despawn(model.obj);//静态物体回收至对象池
                    modelArr.splice(i, 1)
                    return;
                }
            }
        }
    }

    /**
     * @description: 清除所有绑定
     * @param {number} playerId
     * @return {*}
     */
    public net_ClearAllCloth(playerId: number, isCloth: boolean = true) {
        if (this.savePlayerEffect.has(playerId)) {
            this.savePlayerEffect.get(playerId).forEach((effID) => {
                EffectService.stop(effID);
            })
            this.savePlayerEffect.get(playerId).length = 0;
        }
        if (this.savePlayerModel.has(playerId)) {
            const models = this.savePlayerModel.get(playerId)
            if (isCloth) {
                for (let i = 0; i < models.length; i++) {
                    const element = models[i];
                    if (element.isCloth) {
                        element.obj.parent = null
                        GoPool.despawn(element.obj);//静 态物体回收至对象池
                        models.splice(i, 1)
                        i--;
                    }
                }
                Event.dispatchToLocal(EventsName.PlayerResetCloth, playerId);
            } else {
                models.forEach((model) => {
                    model.obj.parent = null
                    GoPool.despawn(model.obj);//静态物体回收至对象池
                })
                models.length = 0
            }
        }
    }
}