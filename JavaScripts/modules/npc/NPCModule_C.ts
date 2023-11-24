import { TaskSate } from "../task/TaskData";
import SP_NPC from "./NPC";
import { NPCDataHelper } from "./NPCData";
import NPCModule_S from "./NPCModule_S";


export default class NPCModule_C extends ModuleC<NPCModule_S, NPCDataHelper> {
    private _npcMap: Map<number, SP_NPC> = new Map();

    public registerNPC(npc: SP_NPC) {
        if (!this._npcMap.has(npc.id)) {
            this._npcMap.set(npc.id, npc)
        }
    }

    /**
     * 改变任务NPC
     * @param hide 要隐藏NPC的ID
     * @param show 要显示NPC的ID
     */
    public changeTaskNPC(hide: number, show: number) {
        const hideNPC = this._npcMap.get(hide);
        const showNPC = this._npcMap.get(show);
        hideNPC && hideNPC.client.leave();
        if (showNPC) {
            showNPC.client.setNPCVisible(true);
            showNPC.client.refreshTaskState(TaskSate.Receive);
        }
    }

    public refreshNPCTaskState(id: number, state: TaskSate) {
        if (!this._npcMap.has(id)) {
            return
        }
        const npc = this._npcMap.get(id);
        npc.client.refreshTaskState(state);
    }

    public onStageChange() {
        for (const [id, npc] of this._npcMap) {
            npc.client.updateVisible()
        }
    }
}