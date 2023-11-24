import { BehaviorType, ISkillItemParam, ISkillLine, SkillItemType } from "../../define/SkillDefine";
import { ISkillEntity, ISkillTimer } from "../../define/SkillDefine";
import { SkillBaseItem } from "./BaseItem";


export class CastItem extends SkillBaseItem {

    private _lTime: number = 0;     //引导时长
    private _cTime: number = 0; //技能时长

    protected onExcute(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer) {
        entity.castTime = this._cTime;
        super.onBehavior(entity, BehaviorType.CastStart);
    }
    protected onUpdate(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer): boolean {
        entity.casting = timer.time < this._lTime;
        if (!entity.casting) {
            super.onBehavior(entity, BehaviorType.CastEnd);

        }
        return !entity.casting;
    }
    protected onParse(data: ISkillItemParam) {
        this._lTime = data.p1 ? data.p1 : 0;
        this._cTime = data.p2 ? data.p2 : 0;
    }
    public get type(): SkillItemType {
        return SkillItemType.Cast;
    }

}