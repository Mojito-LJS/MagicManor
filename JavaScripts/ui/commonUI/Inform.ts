
import { Tween, UIManager } from "../../ExtensionType";
import Inform_Generate from "../../ui-generate/uiTemplate/common/Inform_generate";
/**
 * 系统提示
 * 一个顶一个向上跳动，然后消失，最多三条
 */

/**临时位置 */
const tempPosition = mw.Vector2.zero;

export default class Inform extends Inform_Generate {
    private static _instance: Inform;

    private static get instance(): Inform {
        if (this._instance == null) {
            this._instance = mw.UIService.create(Inform);
        }
        return this._instance;
    }

    private _canvasHight: number = 0;
    private _canvasPos: mw.Vector2 = mw.Vector2.zero;
    private _startTween: Tween<{ y: number }>;
    private _endTween: Tween<{ y: number }>;

    protected onAwake(): void {
        super.onAwake()
        this.layer = mw.UILayerDialog;
        Event.addServerListener("Event_ShowInform", (content: string, time: number) => {
            Inform.show(content, time);
        });
    }

    public onShow(...params: any[]): void {
    }

    onStart() {
        this._canvasHight = this.content.size.y;
        this._canvasPos = this.content.position;
        tempPosition.set(this._canvasPos.x, this._canvasPos.y);
        this._startTween = new Tween({ y: -this._canvasHight }).to({ y: this._canvasPos.y }, 500).onUpdate((obj) => {
            tempPosition.y = obj.y;
            this.content.position = tempPosition;
        }).easing(mw.TweenUtil.Easing.Bounce.Out);

        this._endTween = new Tween({ y: this._canvasPos.y }).to({ y: -this._canvasHight }, 500).onUpdate((obj) => {
            tempPosition.y = obj.y;
            this.content.position = tempPosition;
        }).easing(mw.TweenUtil.Easing.Back.In).onComplete(() => {
            this.hide();
        });
    }

    /**
     * 在客户端显示
     * @param player 玩家
     * @param content 内容
     */
    public static showToClient(player: mw.Player, content: string) {
        Event.dispatchToClient(player, "Event_ShowInform", content);
    }

    /**
     * 显示系统提示 (Client Only)
     * @param content 通知内容
     * @param time    停留时间(ms)
     */
    public static show(content: string, time: number, player?: mw.Player) {
        if (SystemUtil.isServer()) {
            if (player == null) {
                console.log("Inform:show:No player set!");
            } else {
                this.showToClient(player, content);
            }
        } else {
            UIManager.showUI(this.instance, mw.UILayerDialog);
            this.instance.rootCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
            this.instance.message.text = content;
            this.instance._startTween.start();
            setTimeout(() => {
                this.instance._endTween.start();
            }, time);
        }
    }


    protected onDestroy() {
        Inform._instance = null;
    }
}
