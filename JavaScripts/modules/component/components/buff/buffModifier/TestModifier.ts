import { BaseAttributeData } from "../../attribute/AttributeData"
import { ModifierOp } from "../../attribute/aggregator/Modifier"
import { ActiveBuff } from "../base/ActiveBuff"
import { regEffectMod } from "../base/BuffRegister"


/** 
 * @Author       : peiwen.chen
 * @Date         : 2023-03-10 17:58:45
 * @LastEditors  : peiwen.chen
 * @LastEditTime : 2023-03-15 18:49:49
 * @FilePath     : \fantasymagicschool\JavaScripts\modules\fighting\core\buff\buffModifier\TestModifier.ts
 * @Description  : 修改描述
 */
class TestModifier {
    static effectName = 'DamageEffect'
    @regEffectMod(ModifierOp.Add, 'damage')
    damage(this: ActiveBuff, attr: BaseAttributeData) {
        return this.level * attr.atk
    }
}