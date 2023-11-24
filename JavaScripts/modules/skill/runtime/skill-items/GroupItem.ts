
import { ISkillEntity, ISkillItemParam, ISkillLine, ISkillTimer } from "../../define/SkillDefine";
import { SkillBaseItem } from "./BaseItem";
import { BehaviorType, SkillItemType } from "../../define/SkillDefine";

export class GroupItem extends SkillBaseItem {
    private _count = 1;
    private _gap = 0;
    private _delay = 0;
    protected onExcute(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer) {
        //entity.lockTime = true;
        if (this._count > 0) {
            line.loopMax = this._count;
            line.loopGap = this._gap;
            line.delay = this._delay;
            this._count = 0;
        }
    }
    protected onUpdate(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer): boolean {
        return true;
    }
    protected onParse(data: ISkillItemParam) {
        this._count = data.p1 > 1 ? data.p1 : 1;
        this._gap = data.p2 ? data.p2 : 0;
        this._delay = this.delay;
        this.delay = 0;
    }

    public get type(): SkillItemType {
        return SkillItemType.Loop;
    }
}