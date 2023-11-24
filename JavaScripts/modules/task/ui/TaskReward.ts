import TaskReward_Generate from "../../../ui-generate/task/TaskReward_generate";
import { MoneyType } from "../../bag/BagDataHelper";
import { MGSMsgHome } from "../../mgsMsg/MgsmsgHome";
import { TaskRewardItem } from "./TaskRewardItem";

export enum TaskRewardType {
    Building = 1,
    Money,
    Finish,
}

export class TaskReward extends TaskReward_Generate {
    private _callback: (...args: any[]) => void;
    private _buildings: number[];
    private _moneys: number[];
    private _buildingRewards: number[] = [];
    private _moneyReward: { count: number, type: MoneyType } = null;
    /**物品对象池 */
    private _itemPool: TaskRewardItem[] = [];
    /**物品使用池 */
    private _usePool: TaskRewardItem[] = [];
    private _index: number = 1;

    protected onShow(reward: { [key: string]: number[] }, callback: (...args: any[]) => void): void {
        this._callback = callback;
        this._buildingRewards.length = 0;
        this._moneyReward = null;
        if (!reward) {
            this._callback(this._buildingRewards, this._moneyReward);
            return;
        }
        const { buildings, moneys } = reward;
        this._buildings = buildings;
        this._moneys = moneys;
        this.nextReward(TaskRewardType.Building);
    }

    private nextReward(type: TaskRewardType) {
        switch (type) {
            case TaskRewardType.Building:
                if (!this._buildings || this._buildings.length === 0) {
                    this.nextReward(TaskRewardType.Money);
                    return
                }
                this.refreshReward(this._buildings, TaskRewardType.Building);
                break;
            case TaskRewardType.Money:
                if (!this._moneys || this._moneys.length === 0) {
                    this.nextReward(TaskRewardType.Finish);
                    return
                }
                this.refreshReward(this._moneys, TaskRewardType.Money);
                break;
            case TaskRewardType.Finish:
                this._callback(this._buildingRewards, this._moneyReward)
                break;
            default:
                break;
        }
    }

    private refreshReward(rewards: number[], type: TaskRewardType) {
        this.clearItemPool();
        for (const id of rewards) {
            let item: TaskRewardItem;
            if (this._itemPool.length > 0) {
                item = this._itemPool.shift();
            } else {
                item = mw.UIService.create(TaskRewardItem);
                item.clickBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
                this.rewardCanvas.addChild(item.uiObject);
                item.uiObject.size = item.rootCanvas.size;
                item.index = this._index++;
            }
            this._usePool.push(item);
            item.uiObject.visibility = mw.SlateVisibility.SelfHitTestInvisible;
            item.setData(id, type);
            item.clickBtn.onClicked.add(() => {
                if (type === TaskRewardType.Building) {
                    /**burial point */
                    MGSMsgHome.selectBuild(id);
                    this._buildingRewards.push(id);
                } else if (type === TaskRewardType.Money) {
                    this._moneyReward = { count: id, type: item.index };
                }
                this.nextReward(type + 1);
            });
        }
    }

    /** 
     * 清空对象池
     * @return 
     */
    private clearItemPool() {
        if (this._usePool.length === 0) {
            return;
        }
        for (const item of this._usePool) {
            this._itemPool.push(item);
            item.clickBtn.onClicked.clear();
            item.uiObject.visibility = mw.SlateVisibility.Collapsed;
        }
        this._itemPool.sort((a, b) => {
            return a.index - b.index;
        })
        this._usePool.length = 0;
    }
}