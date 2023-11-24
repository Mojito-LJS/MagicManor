import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
import { EventsName, PlayerStateType, SkillState } from "../../../const/GameEnum";
import { GlobalData } from "../../../const/GlobalData";
import { GlobalModule } from "../../../const/GlobalModule";
import { MGSMsgHome } from "../../mgsMsg/MgsmsgHome";
import { BesomEvent } from "../skillObj/BesomMgr";
import SkillBase, { registerSkill } from "./SkillBase";

@registerSkill(2011)
export class FlySkill extends SkillBase {
    private _linsnter: mw.EventListener
    private _inGame: boolean
    private _flyTime: number = 0
    private _anitimer
    private _stance: mw.SubStance;

    public init(): void {
        this.disableState = PlayerStateType.Interaction
    }

    protected onStart(...params): boolean {
        if (this.Charge == 0 || GlobalData.skillCD > 0 || GlobalModule.MyPlayerC.State.getMyAction().includes(PlayerStateType.Interaction) || this.State < 0) return false;

        if (this.State == SkillState.Enable) {
            this.State = SkillState.Using
            this.character.switchToFlying()
            GlobalModule.MyPlayerC.State.setMyState(PlayerStateType.Fly, true)
            this._flyTime = TimeUtil.elapsedTime();


            Event.dispatchToServer(BesomEvent.spwanBesom, this.character.gameObjectId)

            const anim = PlayerManagerExtesion.loadAnimationExtesion(this.character, GlobalData.flyStandbyAnim, true)
            anim.loop = 1;
            anim.play()

            this._anitimer = setTimeout(() => {
                this._stance = PlayerManagerExtesion.loadStanceExtesion(this.character, GlobalData.flyAnim, true)
                this._stance.blendMode = mw.StanceBlendMode.WholeBody
                this._stance.play()
            }, anim.length * 1000);
        } else {
            this.onOver()
        }
        Event.dispatchToLocal(EventsName.UseSkill, this.itemID, this.skillID)
        GlobalData.skillCD = GlobalData.defaultCD
        return true;
    }

    protected onOver(): void {
        GlobalModule.MyPlayerC.State.setMyState(PlayerStateType.Fly, false)
        if (this._flyTime != 0) {
            super.onOver()
            if (this._stance) this._stance.stop()
            this.character.switchToWalking()
            this._flyTime = TimeUtil.elapsedTime() - this._flyTime;
            this._flyTime = 0
            PlayerManagerExtesion.rpcPlayAnimation(this.character, GlobalData.flyOverAnim)
            Event.dispatchToServer(BesomEvent.unspwanBesom, this.character.gameObjectId)
        }

        if (this._linsnter) this._linsnter.disconnect();
        if (this._anitimer) clearTimeout(this._anitimer)
    }

    public onRemove(): void {
        if (this.State == SkillState.Using) this.onOver()
        super.onRemove();
    }
}