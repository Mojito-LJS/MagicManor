
import { SkillData } from "./SkillData";
import SkillModule_Client from "./SkillModule_Client";
import BesomMgr from "./skillObj/BesomMgr";

export default class SkillModule_Server extends ModuleS<SkillModule_Client, SkillData>{
    protected onStart(): void {

    }

    protected onPlayerJoined(player: mw.Player): void {
        BesomMgr.instance.onplayerJoin(player)
    }
}