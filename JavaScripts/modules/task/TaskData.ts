import { GameConfig } from "../../config/GameConfig";


export enum TaskLineType {
    /**走廊 */
    Corridor = 1,
    /**水域 */
    Pond = 2,
    /**后庭 */
    BackPorch = 3,
    /**中庭 */
    Atrium = 4,
    /**休憩亭 */
    RestPavilion = 5,
    /**完成 */
    Finish = 6,
}

export enum TaskType {
    /**收集物品 */
    CollectItem = 1,
}

export enum TaskSate {
    /**可领取 */
    Receive = 0,
    /**进行中 */
    Proceed = 1,
    /**可提交 */
    Commit,
    /**已完成 */
    Complete,
    /**有其他 */
    Other,
}

export interface TaskInfo {
    id: number,
    count: number,
    state: TaskSate,

}

export default class TaskData extends Subdata {
    /**任务线进度 */
    @Decorator.persistence()
    public taskLineProgress: { [key: number]: number } = {};
    /**已完成任务 */
    @Decorator.persistence()
    public completedTasks: number[] = []
    /**当前任务线 */
    @Decorator.persistence()
    public curTaskLine: TaskLineType = TaskLineType.Corridor;
    /**当前任务信息 */
    @Decorator.persistence()
    public curTask: TaskInfo
    /**任务时间 */
    public taskTime: number = 0;

    protected initDefaultData(): void {
        this.taskLineProgress = {};
        this.completedTasks = [];
        this.curTaskLine = TaskLineType.Corridor;
        this.curTask = null;
        this.taskTime = 0;
        this.save(false);
    }

    protected onDataInit(): void {
        this.toTargetVersion();
    }

    protected toTargetVersion() {
        if (this.currentVersion === this.version) return;
        console.log(`update version: ${this.currentVersion} to version: ${this.version}`);
        switch (this.currentVersion) {
            case 1:
                break;
            case 2:
                break;
            default:
                break;
        }
        this.currentVersion = this.version;
        this.save(false);
    }

    /**
     * 获取任务线进度
     * @param type 
     * @returns 
     */
    public getTaskLineProgress(type: TaskLineType) {
        if (!this.taskLineProgress[type]) {
            this.taskLineProgress[type] = 0;
        }
        return this.taskLineProgress[type];
    }

    public takeTask(type: TaskLineType) {
        const index = this.getTaskLineProgress(type);
        if (index === -1) {
            console.error("该任务线已完成: " + type);
            return;
        }
        const taskLine = GameConfig.TaskLine.getElement(type);
        const task = taskLine.TaskArray[index];
        this.curTask = {
            id: task,
            count: 0,
            state: TaskSate.Proceed,
        }
        this.taskTime = 0;
        this.save(false);
        return task;
    }

    public commitTask(type: TaskLineType) {
        let index = this.getTaskLineProgress(type);
        if (index === -1) {
            console.error("该任务线已完成: " + type);
            return;
        }
        const taskLine = GameConfig.TaskLine.getElement(type);
        const task = taskLine.TaskArray[index];
        if (this.curTask.id === task && this.curTask.state === TaskSate.Commit) {
            index++;
            if (index === taskLine.TaskArray.length) {
                this.curTaskLine++;
                index = -1;
            }
            this.taskLineProgress[type] = index;
            this.curTask = null;
            this.completedTasks.push(task);
        }
        this.save(false);
        return index;
    }

    public doTask(count: number) {
        if (!this.curTask) {
            return
        }
        let num = this.curTask.count + count;
        this.curTask.count = num;
        const config = GameConfig.Task.getElement(this.curTask.id);
        if (num >= config.TaskTargetCount) {
            this.curTask.state = TaskSate.Commit;
        }
        this.save(false);
        return this.curTask.state;
    }

    public resetTaskLine(type: TaskLineType) {
        let flag = false
        this.taskLineProgress[type] = 0;
        if (this.curTask) {
            const taskLine = GameConfig.TaskLine.getElement(type).TaskArray;
            if (taskLine.includes(this.curTask.id)) {
                this.curTask = null;
                flag = true;
            }
        }
        this.save(false);
        return flag;
    }

    public resetTask() {
        this.curTask = null;
        this.save(false);
    }

    public refreshTaskTime(count: number) {
        this.taskTime = count;
        this.save(false);
    }
}