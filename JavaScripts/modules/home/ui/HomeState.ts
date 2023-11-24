import { Tween, UIManager } from "../../../ExtensionType";
import { EventsName } from "../../../const/GameEnum";
import HomeState_Generate from "../../../ui-generate/home/HomeState_generate";
import { BagModuleC } from "../../bag/BagModuleC";
import { ManorState } from "../../building/BuildingModuleS";
import { TaskLineType } from "../../task/TaskData";
import TaskModuleC from "../../task/TaskModuleC";


export class HomeState extends HomeState_Generate {

    private _tween: Tween<{ scale: number, y: number }>

    protected onStart(): void {
        const taskModuleC = ModuleService.getModule(TaskModuleC)
        Event.addLocalListener("BuyHomeDress", (count: number) => {
            this.refreshMoney();
        })
        Event.addLocalListener("SellHomeDress", (count: number) => {
            this.refreshMoney();
        })
        Event.addLocalListener("AddHomeMoney", (count: number) => {
            const money = parseInt(this.homeMoneyNum.text);
            this.homeMoneyNum.text = money + " + " + count;
            this._tween.start().onComplete(() => { this.homeMoneyNum.text = money + count + ""; });
        })
        Event.addLocalListener(EventsName.ManorChange, (state: ManorState) => {
            const visible = this.visible;
            let name = ""
            if (state === ManorState.Visit) {
                name = "别人的庄园"
                !visible && UIManager.show(HomeState)
            } else {
                name = "我的庄园"
                taskModuleC.curTaskLine !== TaskLineType.Finish && visible && UIManager.hide(HomeState)
            }
            this.manorName.text = name;
        })

        const position = this.homeMoneyNum.position.clone();
        const scale = this.homeMoneyNum.renderScale.clone();
        this._tween = new Tween({ scale: 1, y: position.y }).to({ scale: 1.2, y: position.y - 25 }, 500).yoyo(true).repeat(1).onUpdate((obj) => {
            position.y = obj.y;
            scale.set(obj.scale, obj.scale)
            this.homeMoneyNum.position = position;
            this.homeMoneyNum.renderScale = scale;
        }).easing(mw.TweenUtil.Easing.Cubic.Out)
    }

    protected onShow(...params: any[]): void {
        this.refreshMoney();
    }

    private refreshMoney() {
        const item = ModuleService.getModule(BagModuleC).getItem(90005);
        const money = item ? item.count : 0;
        this.homeMoneyNum.text = money.toString();
    }
}