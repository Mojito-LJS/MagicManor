
import { myPlayerID } from "../../../../ExtensionType";
import { ISkillEntity, ISkillItemParam, ISkillLine, ISkillTimer, SkillItemType } from "../../define/SkillDefine";
import { SkillBaseItem } from "./BaseItem";


export class BuffItem extends SkillBaseItem {

    protected onExcute(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer) {
        let pid = myPlayerID
        if (entity.clientId == pid) {
            // entity.obj.behavior(entity, BehaviorType.AddBuff, this.id, this.value);
        }
        return true;
    }

    protected onParse(data: ISkillItemParam) {
        if (data.t == this.type) {
            this.id = data.p1 ? data.p1 : 0;
        }
    }

    public get type(): SkillItemType {
        return SkillItemType.None;
    }

}