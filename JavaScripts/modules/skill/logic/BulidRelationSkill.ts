import { UIManager } from "../../../ExtensionType";
import { SkillState } from "../../../const/GameEnum";
import { GlobalData } from "../../../const/GlobalData";
import { Relationship } from "../../relation/ui/Relationship";
import SkillBase, { registerSkill } from "./SkillBase";

@registerSkill(2081)
export class BuildRelationSkill extends SkillBase {
    protected onStart(...params: any[]): boolean {
        if (this.Charge == 0 || GlobalData.skillCD > 0) return false;
        this.setState(SkillState.Relation, this.skillID)
        this.onOver()
        return true;
    }

    public onRemove(): void {
        UIManager.hide(Relationship)
        super.onRemove()
    }
}