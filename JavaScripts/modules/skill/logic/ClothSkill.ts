import { GeneralManager, } from '../../../Modified027Editor/ModifiedStaticAPI';
import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
/**
 * @Author       : 田可成
 * @Date         : 2023-04-24 10:45:00
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-05-14 11:33:13
 * @FilePath     : \mollywoodschool\JavaScripts\modules\skill\logic\ClothSkill.ts
 * @Description  : 
 */
import { GameConfig } from "../../../config/GameConfig";
import { EventsName } from "../../../const/GameEnum";
import { GlobalData } from "../../../const/GlobalData";
import { GlobalModule } from "../../../const/GlobalModule";
import { EffectManager, SoundManager } from "../../../ExtensionType";
import SkillBase, { registerSkill } from "./SkillBase";

@registerSkill(3021)
export class ClothSkill extends SkillBase {
    private _curClothID: number = 0
    private _guidList: string[] = []
    private _startChange: boolean = false

    constructor(skill: number, host: string) {
        super(skill, host)
        Event.addLocalListener(EventsName.PlayerResetCloth, () => { this._curClothID = 0; });
    }

    protected onStart(...params: any[]): boolean {
        if (super.onStart()) {
            if (this._startChange || !(PlayerManagerExtesion.isCharacter(this.character))) {
                return;
            }

            const humanV2 = this.character.getDescription() as mw.CharacterDescription;
            const sexStr = humanV2.advance.base.characterSetting.somatotype;
            let curClothConfigID: number = null;
            const clothIDs = this.skillLevelConfig.Param1.split("|")
            const clothModule = GlobalModule.MyPlayerC.Cloth

            //判断玩家性别，获取对应装扮ID
            if (sexStr == mw.SomatotypeV2.AnimeFemale || sexStr == mw.SomatotypeV2.LowpolyAdultFemale || sexStr == mw.SomatotypeV2.RealisticAdultFemale) {
                //女性
                curClothConfigID = Number(clothIDs[1])
            } else if (sexStr == mw.SomatotypeV2.LowpolyAdultMale || sexStr == mw.SomatotypeV2.AnimeMale || sexStr == mw.SomatotypeV2.RealisticAdultMale) {
                //男性
                curClothConfigID = Number(clothIDs[0])
            }
            if (!curClothConfigID || this._curClothID == curClothConfigID) {
                return;
            }
            const clothConfig = GameConfig.Cloth.getElement(curClothConfigID)
            //生成特效和静态模型
            if (clothConfig.Effects) {
                clothModule.createEffect(clothConfig.Effects)
            }
            if (clothConfig.Slots) {
                clothModule.createStaticModel(clothConfig.Slots)
            }

            this._guidList.length = 0;
            if (clothConfig.Jacket) {
                this._guidList.push(clothConfig.Jacket);
            }
            if (clothConfig.Underwear) {
                this._guidList.push(clothConfig.Underwear);
            }
            if (clothConfig.Hairstyle) {
                this._guidList.push(clothConfig.Hairstyle);
            }
            if (clothConfig.Gloves) {
                this._guidList.push(clothConfig.Gloves);
            }
            if (clothConfig.Shoe) {
                this._guidList.push(clothConfig.Shoe);
            }

            if (this._guidList.length > 0) {
                this._curClothID = curClothConfigID;

                this._startChange = true;

                GlobalData.clothConfigID = curClothConfigID;
                //清除上个装扮的特效和静态模型
                clothModule.clearAllModelAndEffect();

                this.character.setDescription(this._guidList);
                this.character.syncDescription();
                this._startChange = false;

                const anim = PlayerManagerExtesion.loadAnimationExtesion(this.character, "29772")
                anim.loop = 1;
                anim.play();

                GeneralManager.rpcPlayEffectOnPlayer("158079", Player.localPlayer, mw.HumanoidSlotType.LeftFoot)
                SoundManager.playSound("124713")
            }
        }
        return true;
    }
}