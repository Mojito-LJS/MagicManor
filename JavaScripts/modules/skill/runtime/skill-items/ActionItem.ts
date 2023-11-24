import { PlayerManagerExtesion, } from '../../../../Modified027Editor/ModifiedPlayer';
import { BehaviorType, ISkillEntity, ISkillItemParam, ISkillLine, ISkillTimer, SkillItemType } from "../../define/SkillDefine";
import { RunTimeUtil } from "../RunTimeUtil";
import { SkillBaseItem } from "./BaseItem";

export class ActionItem extends SkillBaseItem {

    public res: string;
    public rate: number;
    public loop: number;
    public slot: number
    protected onParse(data: ISkillItemParam) {
        if (data.t == this.type) {
            this.res = data.p1;
            mw.AssetUtil.asyncDownloadAsset(this.res);
            this.rate = data.p2 ? data.p2 : 1;
            this.loop = data.p3 ? data.p3 : 1;
            this.slot = data.p4 ? data.p4 : 0
        }

    }
    public get type(): SkillItemType {
        return SkillItemType.Action;
    }
    protected onExcute(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer) {
        const character = RunTimeUtil.getCharacterBase(entity.host);
        if (character && this.res) {
            let anim = PlayerManagerExtesion.loadAnimationExtesion(character, this.res)
            if (anim) {
                anim.speed = this.rate;
                anim.loop = this.loop;
                anim.slot = this.slot
                anim.play();
                timer.params[0] = anim;
                if (this.life == 0) this.life = anim.length * anim.loop / Math.abs(anim.speed)
            }
            super.onLoaclBehavior(entity, BehaviorType.ItemStart, this.type, anim, this.life);
        }
    }
    protected onUpdate(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer): boolean {
        return timer.time >= this.life;
    }
    protected onLife(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer): void {
        let anim = timer.params[0] as mw.Animation;
        if (anim && anim.isPlaying)
            anim.pause();
    }
    protected onStop(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer): void {
        let anim = timer.params[0] as mw.Animation;
        if (anim && anim.isPlaying)
            anim.stop();
    }
    public end(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer): void {
        this.onStop(entity, line, timer);
    }
}
