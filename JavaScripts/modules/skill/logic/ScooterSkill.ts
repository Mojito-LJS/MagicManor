import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
import { GameConfig } from "../../../config/GameConfig";
import { EventsName, PlayerStateType, SkillState } from "../../../const/GameEnum";
import { GlobalData } from "../../../const/GlobalData";
import { GlobalModule } from "../../../const/GlobalModule";
import GameUtils from "../../../utils/GameUtils";
import { BagModuleC } from "../../bag/BagModuleC";
import SkillBase, { registerSkill } from "./SkillBase";

@registerSkill(2031)
export class ScooterSkill extends SkillBase {
    private _curStance: mw.SubStance

    public async init(): Promise<void> {
        this.disableState = PlayerStateType.Interaction
        await GameUtils.downAsset("151060")
        await GameUtils.downAsset("27399")
    }

    protected onStart(...params: any[]): boolean {
        if (this.Charge == 0 || GlobalData.skillCD > 0 || this.State < 0 || GlobalModule.MyPlayerC.State.getMyAction().includes(PlayerStateType.Interaction)) return false;
        if (this.State == SkillState.Enable) {
            this.attachPlayer()
        } else {
            this.onOver()
        }
        Event.dispatchToLocal(EventsName.UseSkill, this.itemID, this.skillID)
        GlobalData.skillCD = GlobalData.defaultCD
        return true;
    }

    /**将滑板挂到玩家身上 */
    private attachPlayer() {
        const config = GameConfig.Item.getElement(this.itemID);
        if (config) {
            Event.dispatchToServer(EventsName.UnloadProp, config.Resource)
        }
        this.State = SkillState.Using
        GlobalModule.MyPlayerC.State.setMyState(PlayerStateType.Fly, true)
        GlobalModule.MyPlayerC.Cloth.createStaticModel([28], false)
        GlobalModule.MyPlayerC.Cloth.createEffect([65])
        this._curStance = PlayerManagerExtesion.loadStanceExtesion(this.character, "151060")
        if (this._curStance) {
            this._curStance.blendMode = mw.StanceBlendMode.WholeBody;
            this._curStance.play()
        }
        this.character.maxWalkSpeed = 450 * 3
    }

    protected onOver(): void {
        super.onOver()
        this.detachPlayer()
    }

    /**取消滑板挂载 */
    private detachPlayer() {
        if (this._curStance) this._curStance.stop()
        GlobalModule.MyPlayerC.Cloth.clearModel(28)
        GlobalModule.MyPlayerC.Cloth.clearEffect()
        const curEquip = ModuleService.getModule(BagModuleC).curEquip
        const config = GameConfig.Item.getElement(this.itemID);
        GlobalModule.MyPlayerC.State.setMyState(PlayerStateType.Fly, false)
        this.character.maxWalkSpeed = 450
        if (config && Number(curEquip) === config.ID) {
            Event.dispatchToServer(EventsName.LoadProp, config.Resource)
        }
    }

    public onRemove(): void {
        if (this.State == SkillState.Using) this.onOver()
        super.onRemove();
    }
}