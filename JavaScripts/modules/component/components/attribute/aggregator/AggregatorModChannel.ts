

import { FightPool } from '../../../base/Pool';
import { IAttributeSet } from '../IAttributeSet';
import { AttrSetSource } from './AttrSetSource';
import { ModifierCal, ModifierOp } from './Modifier';

class InnerModifier {

    public activeBuff: AttrSetSource

    private _calculate: ModifierCal;

    public isDirty: boolean = true;

    public magnitude: number = 0

    public calculate<T extends IAttributeSet>(attributeSet: T): number {
        if (!this.isDirty) {
            return this.magnitude;
        }
        this.magnitude = this._calculate.call(this.activeBuff, attributeSet.currentData) * this.activeBuff.stackCount;
        return this.magnitude;
    }


    initWithConfig(effect: AttrSetSource, calculate: ModifierCal) {
        this.activeBuff = effect;
        this._calculate = calculate;
    }

    clear() {
        this.activeBuff = null;
        this._calculate = null;
    }
}

const defaultBias = [0, 1, 1];


function sumMods(modifiers: InnerModifier[], attributeSet: IAttributeSet) {
    let sum = 0;
    if (!modifiers.length) {
        return sum;
    }
    for (const modifier of modifiers) {
        sum += modifier.calculate(attributeSet)
    }
    return sum
}

export class AggregatorModChannel {


    private mods: Record<ModifierOp, InnerModifier[]> = {
        '0': [],
        '1': [],
        '2': [],
        '3': []
    } as any;


    /**
     * 计算最终结果
     * @param baseValue 
     */
    evaluateWithBase(baseValue: number, attributeSet: IAttributeSet): number {
        for (const overrideMod of this.mods[ModifierOp.Override]) {
            return overrideMod.calculate(attributeSet);
        }

        const additive = sumMods(this.mods[ModifierOp.Add], attributeSet);
        const multi = sumMods(this.mods[ModifierOp.Multiply], attributeSet) + 1;
        let division = sumMods(this.mods[ModifierOp.Divide], attributeSet) + 1;

        if (division <= MathUtil.FLT_MIN) {
            division = 1;
        }

        return ((baseValue + additive) * multi) / division

    }


    /**
     * 利用结果反推初始值
     * @param finalValue 
     */
    reverseEvaluate(finalValue: number, attributeSet: IAttributeSet): number {
        return 0;
    }

    /**
     * 计算最终结果
     * @param baseValue 
     * @param attributeSet 
     * @returns 新旧baseValue的差
     */
    evaluateBonus(baseValue: number, attributeSet: IAttributeSet): number {
        return this.evaluateWithBase(baseValue, attributeSet) - baseValue;
    }


    /**
     * 添加一个修改器方式
     * @param modifierOp 修改类型
     * @param calculate 计算回调
     * @param effect buff来源
     */
    addMod(modifierOp: ModifierOp, calculate: ModifierCal, effect: AttrSetSource) {
        const modifier: InnerModifier = FightPool.getItemByCreateFun('InnerModifier', () => {
            return new InnerModifier();
        })
        modifier.initWithConfig(effect, calculate);

        this.getOrCreatedMod(modifierOp).push(modifier);
    }

    removeMod(buffName: string) {
        for (let i = ModifierOp.Add; i < ModifierOp.Max; i++) {
            const modifierArr = this.mods[i];
            if (modifierArr) {
                for (let index = modifierArr.length - 1; index >= 0; index--) {

                    const modifier = modifierArr[index];
                    if (modifier.activeBuff.sign === buffName) {
                        modifierArr.splice(index, 1);
                    }

                }
            }
        }
    }

    private getOrCreatedMod(op: ModifierOp) {

        if (!this.mods[op]) {
            this.mods[op] = []
        }
        return this.mods[op];
    }

    public clear() {
        const mods = this.mods
        for (const key in this.mods) {
            if (Object.prototype.hasOwnProperty.call(mods, key)) {
                const element = mods[key] as [];
                element.length = 0
            }
        }
        this.mods = Object.create({});
    }


}