import { CameraCG } from "module_cameracg";
import { PlayerStateType } from "../../const/GameEnum";
import { GlobalModule } from "../../const/GlobalModule";
import StationModuleS from "./StationModuleS";
import { GlobalData } from "../../const/GlobalData";
import GameUtils from "../../utils/GameUtils";
import MessageBox from "../../ui/commonUI/MessageBox";
import { UserMgr } from "../user/UserMgr";
import { MGSMsgHome } from "../mgsMsg/MgsmsgHome";
import FindGame from "../find/FindGame";
import TaskModuleC from "../task/TaskModuleC";
import { TaskLineType } from "../task/TaskData";
import { myCharacterGuid } from "../../ExtensionType";

export default class StationModuleC extends ModuleC<StationModuleS, null> {
    private _train: mw.GameObject
    private _trainPos: mw.Vector
    private _arriveEff: mw.Effect
    private _departEff: mw.Effect
    private _trainEff: mw.Effect
    private _departSky: mw.GameObject
    private _trigger: mw.Trigger
    private _isDepart: boolean = false;

    protected onStart(): void {
        /**电车 */
        GameObject.asyncFindGameObjectById("35CCDDC0").then(async obj => {
            this._train = obj
            this._trainPos = obj.worldTransform.position.clone()
            this._train.setVisibility(mw.PropertyStatus.Off)
        })
        //到站特效
        GameObject.asyncFindGameObjectById("2E5A5148").then(go => {
            if (!go) return;
            this._arriveEff = go as mw.Effect
            this._arriveEff.setVisibility(mw.PropertyStatus.Off)
        })
        //列车特效
        GameObject.asyncFindGameObjectById("3644149B").then(go => {
            if (!go) return;
            this._trainEff = go as mw.Effect
            this._trainEff.setVisibility(mw.PropertyStatus.Off)
        })
        //发车特效
        GameObject.asyncFindGameObjectById("06080C99").then(go => {
            if (!go) return;
            this._departEff = go as mw.Effect
            this._departEff.setVisibility(mw.PropertyStatus.Off)
        })
        //发车天空球
        GameObject.asyncFindGameObjectById("2529A99F").then(go => {
            if (!go) return;
            this._departSky = go
            this._departSky.setVisibility(mw.PropertyStatus.Off)
        })
        //车厢触发器
        GameObject.asyncFindGameObjectById("14FD0EFF").then(obj => {
            if (!obj) return;
            this._trigger = obj as mw.Trigger
            this._trigger.onEnter.add(go => {
                if (go && go.gameObjectId == myCharacterGuid) {
                    console.log("进入车厢");
                    this.onEnterTrain(true)
                }
            })
            this._trigger.onLeave.add(go => {
                if (go && go.gameObjectId == myCharacterGuid) {
                    console.log("离开车厢");
                    this.onEnterTrain(false)
                }
            })
        })

        /**设置跳主游戏触发器 */
        const returnTrigger = GameObject.findGameObjectById("0E426795") as mw.Trigger
        returnTrigger.onEnter.add((go: mw.GameObject) => {
            if (GameUtils.isPlayerCharacter(go)) {
                /**burial point */
                MGSMsgHome.triggerBack();
                this.showReturnPanel();
            }
        })
    }

    protected onEnterScene(sceneType: number): void {
        const id = setInterval(() => {
            if (this._train) {
                clearInterval(id);
                CameraCG.instance.play(GlobalData.trainCG, () => {
                    if (ModuleService.getModule(TaskModuleC).curTaskLine === TaskLineType.Finish) {
                        FindGame.instance.startFindGame();
                    }
                });
                this.arrive();
            }
        }, 10)
    }

    public showReturnPanel() {
        MessageBox.showTwoBtnMessage("返回学校", "是否结束本次旅行，乘坐列车返回校园", (res: boolean) => {
            if (res) {
                /**burial point */
                MGSMsgHome.backMain(Math.floor(TimeUtil.elapsedTime()));
                this.depart();
            } else {
                return
            }
        })
    }

    /**进入车厢 */
    private onEnterTrain(enter: boolean) {
        const character = Player.localPlayer.character
        if (!character) {
            logE("onEnterTrain:  character is null")
            return;
        }
        character.jumpEnabled = !enter
        GlobalModule.MyPlayerC.State.setMyState(PlayerStateType.Interaction, enter);
    }


    /**到站 */
    private arrive() {
        this._arriveEff.setVisibility(mw.PropertyStatus.On)
        this._train.setVisibility(mw.PropertyStatus.On)
        this._train.worldTransform.position = arrivePos
        new mw.Tween(this._train.worldTransform.position)
            .to(this._trainPos, departAnimTime)
            .easing(TweenUtil.Easing.Quadratic.Out)
            .onUpdate(v => { this._train.worldTransform.position = v })
            .onComplete(() => {
                this._arriveEff.setVisibility(mw.PropertyStatus.Off)
            })
            .start()
    }


    /**发车 */
    public depart() {
        if (this._isDepart) return;
        this._isDepart = true;
        const character = Player.localPlayer.character
        character.worldTransform.position = this._trigger.worldTransform.position.clone();
        this._departEff.setVisibility(mw.PropertyStatus.On)
        this._departSky.setVisibility(mw.PropertyStatus.On)
        this._train.setVisibility(mw.PropertyStatus.On)
        new mw.Tween(this._train.worldTransform.position)
            .to(departPos, departAnimTime)
            .easing(TweenUtil.Easing.Circular.In)
            .onUpdate(v => { this._train.worldTransform.position = v })
            .start()
        // setTimeout(() => {
        // this._isDepart = false;
        // UserMgr.Inst.jumpMainGame()
        // }, departAnimTime);
    }
}


/**停靠时间 */
export const departTime = 6 * 60 * 1000
/**发车动画时间 */
export const departAnimTime = 4000
/**到站位置 */
export const arrivePos = new mw.Vector(6820, -1400, 7550)
/**发车位置 */
export const departPos = new mw.Vector(6820, 18000, 7550)
