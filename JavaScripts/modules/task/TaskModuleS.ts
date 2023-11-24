import TaskData, { TaskLineType } from "./TaskData";
import TaskModuleC from "./TaskModuleC";

export default class TaskModuleS extends ModuleS<TaskModuleC, TaskData>{
    protected onStart(): void {

    }

    public net_TakeTask(taskLine: TaskLineType) {
        this.getPlayerData(this.currentPlayer).takeTask(taskLine);
    }

    public net_CommitTask(taskLine: TaskLineType) {
        this.getPlayerData(this.currentPlayer).commitTask(taskLine);
    }

    public net_DoTask(count: number) {
        this.getPlayerData(this.currentPlayer).doTask(count);
    }

    public net_resetTaskLine(type: TaskLineType) {
        this.getPlayerData(this.currentPlayer).resetTaskLine(type);
    }

    public net_resetTask() {
        this.getPlayerData(this.currentPlayer).resetTask();
    }

    public net_refreshTaskTime(time: number) {
        this.getPlayerData(this.currentPlayer).refreshTaskTime(time);
    }
}