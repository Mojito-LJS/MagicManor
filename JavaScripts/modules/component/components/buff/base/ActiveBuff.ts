
import { AttrContextInfo, AttrSetSource } from '../../attribute/aggregator/AttrSetSource';
import { BuffDef } from './BuffDef';
import { regBuff } from './BuffRegister';
import { BuffConstant } from './BuffType';




/**
 * 除了实例化effect。其他buff都会生成一个对应的实例
 */
@regBuff('ActiveBuff', 'ActiveBuff')
export class ActiveBuff implements AttrSetSource {


    /**
     * 构建一个特效对象
     * @param def 
     * @param _level 
     */
    public constructor(public readonly def: Readonly<BuffDef>, private _level: number = -1) {
        this.sign = def.sign
    }
    sign: string;

    contextInfo: AttrContextInfo;

    public executeEventTime: number = 0;

    public pastTime: number;

    public isPendingRemove: boolean = false;

    /**buff启动时间 */
    public startTime: number;

    /**
     * 缓存值，外部传参进来
     */
    private _setByCallerMagnitude: { [key: string]: string | number } = {};

    /**
     * 是否被阻挡了
     */
    public isInhibited: boolean = false;

    /**
     *  instance类型buff的duration是 {@link BuffConstant.INFINITE_DURATION}
     */
    public duration: number = BuffConstant.INFINITE_DURATION;

    /**周期 */
    public period: number = BuffConstant.NO_PERIOD;


    /**
     * buff施加时的成功概率
     */
    public changeToApply: number = 1;

    /**
     * buff的叠加层数
     */
    public stackCount: number = 0;

    private assets: mw.GameObject;

    public set level(value: number) {
        if (this._level === value) {
            return;
        }
        this._level = value;
        this.updateDef();
    }

    public get level() {
        return this._level;
    }

    /**
     * 获取黑板的值
     * @param name 
     * @param defaultIfNotFound 
     */
    public getSetByCallerMagnitude(name: string, defaultIfNotFound: number = 1) {
        if (Object.prototype.hasOwnProperty.call(this._setByCallerMagnitude, name)) {
            return defaultIfNotFound
        }
        return this._setByCallerMagnitude[name] as number;
    }

    public setSetByCallerMagnitude(name: string, value: number | string) {
        this._setByCallerMagnitude[name] = value;
    }


    public getSetCaller() {
        return this._setByCallerMagnitude
    }


    /**
     * buff开始被使用
     */
    public async start() {

        if (this.def.assetId) {
            // this.assets = await AssetsManager.instance.spawnAssetAsync(this.def.assetId);
            // ((this.assets as AssetGameObject).assetScript as BuffAssetsScript).effectInfo = this;
            // this.contextInfo.to.getComponent(TransformComponent).addChild(this.assets, Gameplay.SlotType.Root);
            // this.assets.active();
        }
        this.onStart()
    }

    protected onStart() {
    }

    /**
     * buff被移除后调用
     */
    public remove() {
        if (this.assets) {
            // delete ((this.assets as AssetGameObject).assetScript as BuffAssetsScript)['effectInfo'];
            // this.assets.detachFromGameObject();
            // this.assets.unActive();
            // this.assets = null;
        }
        this._level = -1;
        this.onRemove()
    }

    protected onRemove() {
    }

    public clear() {
        this._setByCallerMagnitude = {};
        this.contextInfo = null
    }

    public updateDef() {
        this.duration = this.def.duration;
        if (this.def.calculateDuration) {
            this.duration = this.def.calculateDuration.call(this)
        }

        this.period = this.def.period;
        if (this.def.periodCalculate) {
            this.period = this.def.periodCalculate.call(this)
        }
    }


    public get host() {
        return this.contextInfo.to;
    }

}
