import { BaseAttributeData } from "../../attribute/AttributeData"
import { ModifierOp } from "../../attribute/aggregator/Modifier"
import { ActiveBuff } from "../base/ActiveBuff"
import { regEffectMod } from "../base/BuffRegister"

class TestModifier {
    static effectName = 'DamageEffect'
    @regEffectMod(ModifierOp.Add, 'damage')
    damage(this: ActiveBuff, attr: BaseAttributeData) {
        return this.level * attr.atk
    }
}