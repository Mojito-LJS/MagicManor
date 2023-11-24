import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
import { GlobalData } from "../../../const/GlobalData";
import GameUtils from "../../../utils/GameUtils";
import { PropModuleC } from "../../prop/PropModuleC";
import SkillBase, { registerSkill } from "./SkillBase";

@registerSkill(2021)
export class SnowballSkill extends SkillBase {
    protected onStart(...params: any[]): boolean {
        if (super.onStart()) {
            this.makeSnowball()
        }
        return true;
    }

    private async makeSnowball() {
        await GameUtils.downAsset(GlobalData.creationAnim)
        const anim = PlayerManagerExtesion.rpcPlayAnimation(this.character, GlobalData.creationAnim, 1, 1)
        this.character.movementEnabled = false
        setTimeout(() => {
            this.character.movementEnabled = true
            ModuleService.getModule(PropModuleC).spawnPrefab("D52D7CF04E7448CCD43261B94313D911", 50, 10, false)
        }, (anim.length - 1.5) * 1000);
    }
}