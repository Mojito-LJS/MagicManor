import { GameConfig } from "../../../config/GameConfig";
import TaskRewardItem_Generate from "../../../ui-generate/task/TaskRewardItem_generate";
import { TaskRewardType } from "./TaskReward";


export class TaskRewardItem extends TaskRewardItem_Generate {
    public index: number;

    public get clickBtn() {
        return this.receiveBtn;
    }

    public setData(id: number, type: TaskRewardType) {
        if (type === TaskRewardType.Building) {
            const config = GameConfig.Building.getElement(id);
            this.buidingimage.imageGuid = config.Icon;
            this.name.text = config.Name;
        } else if (type === TaskRewardType.Money) {
            let icon = "";
            let name = "";
            if (this.index === 1) {
                icon = "120752";
                name = "金币";
            } else if (this.index === 2) {
                icon = "120763";
                name = "银币";
            } else if (this.index === 3) {
                icon = "164437";
                name = "月亮币";
            }
            this.receiveBtn.normalImageGuid = icon;
            this.name.text = name + "x" + id;
        }
    }
}