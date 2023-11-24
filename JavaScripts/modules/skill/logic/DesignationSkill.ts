import { UIManager } from "../../../ExtensionType";
import { SkillState } from "../../../const/GameEnum";
import { GlobalData } from "../../../const/GlobalData";
import { Designation } from "../../relation/ui/Designation";
import { Relationship } from "../../relation/ui/Relationship";
import SkillBase, { registerSkill } from "./SkillBase";

@registerSkill(2082)
export class DesignationSkill extends SkillBase {
    protected onStart(...params: any[]): boolean {
        if (this.Charge == 0 || GlobalData.skillCD > 0) return false;
        this.setState(SkillState.Designation, this.skillID)
        this.onOver()
        return true;
    }

    public onRemove(): void {
        UIManager.hide(Designation)
        super.onRemove()
    }
}