import { GameConfig } from "../../../config/GameConfig";
import { ITaskElement } from "../../../config/Task";
import { GlobalData } from "../../../const/GlobalData";
import TaskMain_Generate from "../../../ui-generate/task/TaskMain_generate";
import { ManorState } from "../../building/BuildingModuleS";
import { TaskSate } from "../TaskData";
import TaskModuleC from "../TaskModuleC";

export default class TaskMain extends TaskMain_Generate {
    private _nowCfg: ITaskElement;
    private _isShow: boolean;

    private get taskModuleC() {
        return ModuleService.getModule(TaskModuleC)
    }

    protected onStart(): void {
        this._isShow = false;
        this.taskCanvas.visibility = mw.SlateVisibility.Collapsed;
        this.taskDone.visibility = mw.SlateVisibility.Collapsed;

        this.taskModuleC.onTaskDataChange.add(() => {
            this.refreshTaskInfo();
        })

        setInterval(() => {
            if (this._isShow) {
                const location = Player.localPlayer.character.worldTransform.position;
                this.updateDistance(location);
            }
        }, 500);
    }

    protected initButtons(): void {
        super.initButtons()
    }

    protected onShow(): void {
        this.checkTask();
    }

    private updateDistance(pos: mw.Vector) {
        if (this._nowCfg?.GuidePoint) {
            this.distance.text = Math.floor(mw.Vector.distance(pos, this._nowCfg.GuidePoint) / 100).toString() + 'm';
        }
    }

    public checkTask() {
        const task = this.taskModuleC.curTask;
        const state = GlobalData.ManorState;
        if (!task || state === ManorState.Visit) {
            this._isShow = false;
            this.taskCanvas.visibility = mw.SlateVisibility.Collapsed;
            return;
        }
        this._nowCfg = GameConfig.Task.getElement(task.id);
        this._isShow = true;
        this.taskCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        this.taskName.text = this._nowCfg.Name;
        this.refreshTaskInfo()
    }

    private refreshTaskInfo() {
        if (!this._nowCfg) {
            return;
        }
        const info = this.taskModuleC.curTask;
        if (info.state === TaskSate.Commit) {
            this.taskCondition.text = "任务已完成";
            this.taskDone.visibility = mw.SlateVisibility.SelfHitTestInvisible;
            this.distance.visibility = mw.SlateVisibility.Collapsed;
        } else if (info.state === TaskSate.Proceed) {
            this.taskCondition.text = this._nowCfg.Describe + " : " + info.count + "/" + this._nowCfg.TaskTargetCount;
            this.taskDone.visibility = mw.SlateVisibility.Collapsed;
            this.distance.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        }
    }
}