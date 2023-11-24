@Component
export default class MakeItem extends mw.Script {
    private _obj: mw.GameObject
    private _effect: mw.Effect

    public spawn() {
        if (!this._obj) this._obj = this.gameObject.getChildByName("物品")
        if (!this._effect) this._effect = this.gameObject.getChildByName("特效") as mw.Effect
        this._effect.play()
        this._obj.setVisibility(mw.PropertyStatus.Off);
        setTimeout(() => {
            this._obj.setVisibility(mw.PropertyStatus.On);
        }, (this._effect.timeLength * 0.5) * 1000);
    }

    public despawn() {
        this._effect.stop()
        this._obj.setVisibility(mw.PropertyStatus.Off);
    }
}