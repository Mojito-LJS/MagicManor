import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';

import { INPCConfigElement } from "../../config/NPCConfig";
import SP_NPC, { NPC_Events } from "./NPC";

export enum NPCState {
    None = 1,
    Follow,
    Talk,
}

export class NPCServer {
    private npc: mw.Character = null;
    private config: INPCConfigElement = null;
    /**npc专属guid */
    private npcGuid = "";
    /**脚本 */
    private script: SP_NPC = null;
    /**当前跟随玩家 */
    private curPlayer: mw.Player = null;
    /**计时跟随 */
    private time = 0;
    /**计时同步 */
    private timer = 0.5;
    /**当前与之对话的玩家数量，玩家数量等于0的时候才继续寻路 */
    private curTalkPlay: number[] = []

    private state = NPCState.None;

    private curIndex = 0;
    private poss: mw.Vector[] = [];

    public constructor(npc: mw.Character, config: INPCConfigElement, script: SP_NPC, guid: string) {
        this.npcGuid = guid;
        this.npc = npc;
        this.config = config;
        this.script = script;
        if (this.config.coordinate) {
            for (let arr of this.config.coordinate) {
                let pos = new mw.Vector(arr[0], arr[1], arr[2]);
                this.poss.push(pos);
            }
        }


        /**监听停止 */
        Event.addClientListener(NPC_Events.NPC_Stop + this.npcGuid, (player: mw.Player) => {
            if (!this.curTalkPlay.includes(player.playerId)) {
                this.curTalkPlay.push(player.playerId)
                if (this.curTalkPlay.length > 0 && this.state != NPCState.Talk) {
                    this.state = NPCState.Talk;
                    this.curIndex--; //当前寻路索引减少，因为NPC在去下个路径点的途中被中断了，所以要重新去一次
                    this.stopMove()
                }
            }
        });
        /**监听开始继续寻路 */
        Event.addClientListener(NPC_Events.NPC_Start + this.npcGuid, (player: mw.Player) => {
            if (this.curTalkPlay.includes(player.playerId)) {
                this.curTalkPlay.splice(this.curTalkPlay.indexOf(player.playerId), 1)
                if (this.curTalkPlay.length == 0) {
                    this.state = NPCState.None;
                    this.moveTo()
                }
            }

        });
        /**监听跟随 */
        Event.addClientListener(NPC_Events.NPC_On + this.npcGuid, this.onNPCFollow.bind(this));
        /**监听脱离 */
        Event.addClientListener(NPC_Events.NPC_OnClickOff + this.npcGuid, this.onNPCOff.bind(this));
        /**监听抢夺 */
        Event.addClientListener(NPC_Events.NPC_OnClickRob + this.npcGuid, this.onNPCFollow.bind(this));

        this.init()
    }

    /**
     * npc跟随玩家
     * @param player 
     */
    private onNPCFollow(player: mw.Player): void {
        this.script.playerId = player.playerId;
        this.curPlayer = player;
        this.time = this.timer;
        this.state = NPCState.Follow;
    }

    /**npc脱离 */
    private onNPCOff(): void {
        this.state = NPCState.None;
        this.curPlayer = null;
        this.script.playerId = 0;
        this.moveTo();
    }

    public init(): void {
        if (this.poss.length > 0) {
            setTimeout(() => {
                this.moveTo();
            }, 8000);
        }

    }
    /**是否因为谈话中断了本次寻路 */
    private stopTimer

    /**自动寻路 */
    private moveTo(): void {
        if (this.poss.length > 0) {
            let stopTime = this.config.stopTime[this.curIndex] * 1000
            let ani = this.config.stopAni[this.curIndex]
            this.curIndex++;
            if (this.curIndex >= this.poss.length) {
                this.curIndex = 0;
            }
            Navigation.navigateTo(this.npc, this.poss[this.curIndex], 50, () => {
                if (ani > 0)
                    PlayerManagerExtesion.rpcPlayAnimation(this.npc, ani.toString())
                this.stopTimer = setTimeout(() => {
                    this.moveTo()
                }, stopTime);
            }, this.moveFail.bind(this));
        }

    }

    /**停止寻路 */
    private stopMove(): void {
        clearTimeout(this.stopTimer);
        Navigation.stopNavigateTo(this.npc);
    }

    /**跟随玩家 */
    private followPlayer(): void {
        this.time = this.timer;
        let pos = this.curPlayer.character.worldTransform.position;
        Navigation.navigateTo(this.npc, pos, 50, null, this.moveFail.bind(this));
    }

    private moveFail(): void {
        console.error("eason===move fail");
    }

    public onUpdate(dt: number): void {
        if (this.state == NPCState.None) {
            return;
        }
        this.time -= dt;
        if (this.time <= 0) {
            this.followPlayer();
        }
    }
}