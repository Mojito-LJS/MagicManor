import { CameraCG } from "module_cameracg";
import { UIManager } from "../../ExtensionType";
import { GameConfig } from "../../config/GameConfig";
import GuidePoint from "../guide/GuidePoint";
import TaskData, { TaskLineType, TaskSate, TaskType } from "./TaskData";
import TaskModuleS from "./TaskModuleS";
import TaskMain from "./ui/TaskMain";
import { BagModuleC } from "../bag/BagModuleC";
import { GlobalData } from "../../const/GlobalData";
import BuildingModuleC from "../building/BuildingModuleC";
import { TaskReward } from "./ui/TaskReward";
import { MoneyType } from "../bag/BagDataHelper";
import NPCModule_C from "../npc/NPCModule_C";
import { EventsName } from "../../const/GameEnum";
import { MGSMsgHome } from "../mgsMsg/MgsmsgHome";
import { ManorState } from "../building/BuildingModuleS";
import FindGame from "../find/FindGame";
import { HomeState } from "../home/ui/HomeState";

export default class TaskModuleC extends ModuleC<TaskModuleS, TaskData>{

    public _cd: number = 1;

    public readonly onTaskDataChange: Action = new Action()

    public get curTaskLine() {
        return this.data.curTaskLine;
    }

    public get curTask() {
        return this.data.curTask;
    }

    public get taskTime() {
        return this.data.taskTime;
    }

    protected onStart(): void {
        Event.addLocalListener(EventsName.AddItem, (id: number, count: number) => {
            this.changeTaskData(TaskType.CollectItem, id, count);
        });
        Event.addLocalListener(EventsName.ManorChange, (state: ManorState) => {
            if (state === ManorState.Free) {
                UIManager.show(GuidePoint);
                UIManager.show(TaskMain);
            } else if (state === ManorState.Visit) {
                this.setTaskGuide()
            }
        })
    }

    protected onEnterScene(sceneType: number): void {
        if (this.curTaskLine === TaskLineType.Finish) {
            UIManager.show(HomeState);
        } else {
            UIManager.getUI(HomeState);
        }
        UIManager.show(GuidePoint);
        UIManager.show(TaskMain);
    }

    public checkTaskLineState(taskLine: TaskLineType) {
        let state = TaskSate.Receive;
        const task = this.data.curTask;
        if (task) {
            const config = GameConfig.Task.getElement(task.id);
            if (config.TaskLine === taskLine) {
                state = task.state;
            } else {
                state = TaskSate.Other
            }
        } else {
            const progress = this.data.getTaskLineProgress(taskLine);
            if (progress === -1) {
                state = TaskSate.Complete;
            }
        }
        return state;
    }

    public changeTaskData(type: TaskType, target: number, count: number) {
        const task = this.curTask;
        if (!task) {
            return;
        }
        const config = GameConfig.Task.getElement(task.id)
        if (config.TaskType !== type) {
            return;
        }
        if (config.TaskTarget !== target) {
            return;
        }
        if (task.count >= config.TaskTargetCount) {
            return
        }
        this.doTask(count);
    }

    public takeTask(taskLine: TaskLineType) {
        const id = this.data.takeTask(taskLine);
        this.server.net_TakeTask(taskLine);
        if (id) {
            /**burial point */
            MGSMsgHome.getTask(id);
            const task = GameConfig.Task.getElement(id);
            this.setTaskGuide(task.GuidePoint);
            SoundService.playSound("176453");
        }
    }

    public commitTask(taskLine: TaskLineType) {
        const index = this.data.commitTask(taskLine);
        this.server.net_CommitTask(taskLine);
        this.setTaskGuide();
        return index;
    }

    public doTask(count: number = 1) {
        const state = this.data.doTask(count);
        this.server.net_DoTask(count);
        this.onTaskDataChange.call();
        if (state === TaskSate.Commit) {
            const task = GameConfig.Task.getElement(this.curTask.id);
            UIManager.getUI(GuidePoint).setPointShow(task.CommitPoint);
            ModuleService.getModule(NPCModule_C).refreshNPCTaskState(task.NPC, state);
            SoundService.playSound("176454");
            /**burial point */
            MGSMsgHome.finishTask(task.ID, this.taskTime);
        }
    }

    public resetTaskLine(type: TaskLineType) {
        const res = this.data.resetTaskLine(type);
        this.server.net_resetTaskLine(type);
        if (res) {
            this.setTaskGuide()
        }
    }

    public resetTask() {
        this.data.resetTask();
        this.server.net_resetTask();
        this.setTaskGuide()
    }

    private refreshTaskTime(time: number) {
        this.data.refreshTaskTime(time);
        this.server.net_refreshTaskTime(time);
    }

    public setTaskGuide(point?: Vector) {
        UIManager.getUI(GuidePoint).setPointShow(point);
        UIManager.getUI(TaskMain).checkTask();
    }

    public getTaskReward() {
        if (!this.curTask) {
            return;
        }
        SoundService.playSound("176455");
        const task = GameConfig.Task.getElement(this.curTask.id);
        ModuleService.getModule(BagModuleC).removeShortcutBarItem(task.TaskTarget);
        UIManager.show(TaskReward, { buildings: task.Building, moneys: task.Money }, (buildings: number[], money: { count: number, type: MoneyType }) => {
            UIManager.hide(TaskReward);
            CameraCG.instance.play(GlobalData.buildingCG, async () => {
                if (money) {
                    ModuleService.getModule(BagModuleC).addMoney(money.count, money.type);
                }
                const buildingModuleC = ModuleService.getModule(BuildingModuleC);
                for (const id of buildings) {
                    await buildingModuleC.addBuilding(id);
                }
                buildingModuleC.addManorLevel();
                const index = this.commitTask(task.TaskLine);
                SoundService.playSound("176452");
                /**burial point */
                MGSMsgHome.createBuild(task.ID);
                setTimeout(() => {
                    CameraCG.instance.exitFreeCamera();
                    const config = GameConfig.TaskLine.getElement(this.curTaskLine);
                    const npcModuleC = ModuleService.getModule(NPCModule_C)
                    if (index === -1) {
                        npcModuleC.changeTaskNPC(task.NPC, config?.NPC);
                    }
                    if (this.curTaskLine === TaskLineType.Finish) {
                        npcModuleC.onStageChange();
                        FindGame.instance.startFindGame();
                        UIManager.show(HomeState);
                    }
                }, 2000);
            }, false)
        });
    }

    protected onUpdate(dt: number): void {
        this._cd -= dt;
        if (this._cd <= 0) {
            this._cd = 1;
            if (this.curTask && this.curTask.state !== TaskSate.Commit) {
                this.refreshTaskTime(this.taskTime + 1);
            }
        }
    }
}