@Component
export default class MakeItem2 extends mw.Script {
    private _sound: any;

    public spawn() {
        if (!this._sound) this._sound = this.gameObject.getChildByName("音效") as mw.Sound
        this._sound.enable = true
    }

    public despawn() {
        this._sound.enable = false
    }
}