import { SkillRun } from "../runtime/SkillRun";
import SkillBase, { registerSkill } from "./SkillBase";

@registerSkill(1013)
export class WindSkill3 extends SkillBase {
    public onHit(hitObj: string, buffName: string, damage: number, effect: number, music: number, hitLocation?: mw.Vector): boolean {
        const skill = this.component.findSkill(5001)
        skill.skillID = 500101
        skill.host = this.host
        if (hitObj != "") {
            if (!hitLocation) hitLocation = GameObject.findGameObjectById(hitObj).worldTransform.position
            SkillRun.cast(this.character, 5001 * 10 + this.State, { pos: hitLocation, diy: [this.State, skill.skillID] })
        }
        return true
    }
}
