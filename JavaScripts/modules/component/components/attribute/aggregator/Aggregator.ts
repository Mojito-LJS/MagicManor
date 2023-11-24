import { AttributeSet, ReadonlyAttrSet } from '../AttributeSet';
import { IAttributeSet } from '../IAttributeSet';
import { AggregatorModChannel } from './AggregatorModChannel';
import { AttrSetSource } from './AttrSetSource';
import { IModifiers, ModifierCal, ModifierOp } from './Modifier';


const MAX_BROADCAST_DIRTY = 10;

/**
 * 属性聚合器
 * 一个属性应该只有一个聚合器，所有对该属性的修改都会集合到聚合器中修改。
 * 最后再把聚合器计算的值作为真正的值返回到属性的currentValue中
 */
export class Aggregator {

    protected modChannel: AggregatorModChannel = new AggregatorModChannel();

    protected broadcastingDirtyCount = 0;

    public onDirtyRecursive: mw.Action1<Aggregator> = new mw.Action1();

    public onDirty: mw.Action1<Aggregator> = new mw.Action1();



    public get baseValue() {
        return this._baseValue;
    }

    constructor(public listenName: string, protected _ownerAttributeSet: IAttributeSet, protected _baseValue: number, public fromSign: string) {

    }

    public setBaseValue(newValue: number, broadcastDirtyEvent: boolean = true) {
        this._baseValue = newValue;
        if (broadcastDirtyEvent) {
            this.broadcastOnDirty();
        }
    }
    public getBaseValue() {
        return this.baseValue;
    }

    /**计算最终结果 */
    public evaluate(): number {
        return this.modChannel.evaluateWithBase(this._baseValue, this._ownerAttributeSet);
    }

    /**
     * 计算最终结果
     * @returns 新旧baseValue的差
     */
    public evaluateBonus(): number {
        return this.modChannel.evaluateBonus(this._baseValue, this._ownerAttributeSet);
    }


    /**
     * 添加一个修改器方式
     * @param modifierOp 修改类型
     * @param calculate 计算回调
     * @param effect buff来源
     */
    public addAggregatorMod(modifierOp: ModifierOp, calculate: ModifierCal, from: AttrSetSource) {
        this.modChannel.addMod(modifierOp, calculate, from);
        this.broadcastOnDirty();
    }

    public removeAggregatorMod(from: AttrSetSource) {
        this.modChannel.removeMod(from.sign);
        this.broadcastOnDirty();
    }

    public broadcastOnDirty() {
        if (this.broadcastingDirtyCount > MAX_BROADCAST_DIRTY) {

            this.onDirtyRecursive.call(this);
            return;
        }

        this.broadcastingDirtyCount++;
        this.onDirty.call(this);

        this.broadcastingDirtyCount--;
    }

    public clear() {
        this.onDirty.clear();
        this.onDirtyRecursive.clear();
        this.modChannel.clear()
    }

    private static execute(baseValue: number, magnitude: number, modifierOp: ModifierOp) {
        switch (modifierOp) {
            case ModifierOp.Override:
                {
                    return magnitude;
                }
            case ModifierOp.Add:
                {
                    baseValue += magnitude;
                    return baseValue
                }
            case ModifierOp.Multiply:
                {
                    baseValue *= 1 + magnitude;
                    return baseValue
                }
            case ModifierOp.Divide:
                {
                    if (magnitude >= MathUtil.FLT_MIN) {
                        baseValue /= 1 + magnitude;
                    }
                    return baseValue
                }
            default:
                return baseValue
        }
    }

    public static staticExecute(modifier: IModifiers, attributeSet: ReadonlyAttrSet<AttributeSet>, fromSign: string) {
        const { isBase, attributeName, calculate, modifierOp } = modifier
        const baseValue = isBase ? attributeSet.getBaseValue(attributeName) : attributeSet.getNumericValue(attributeName)
        const magnitude = calculate.call(this, attributeSet);
        const newValue = this.execute(baseValue, magnitude, modifierOp)
        if (isBase) {
            attributeSet.setBaseValue(newValue, attributeName, fromSign)
        } else {
            attributeSet.setNumericValue(newValue, attributeName, fromSign)
        }
        return newValue;
    }

    public static buffExecute(baseValue: number, buff: AttrSetSource, modifier: IModifiers, attributeSet: ReadonlyAttrSet<AttributeSet>) {
        const magnitude = modifier.calculate.call(buff, attributeSet.currentData) * buff.stackCount;
        baseValue = this.execute(baseValue, magnitude, modifier.modifierOp)
        return baseValue;
    }
}