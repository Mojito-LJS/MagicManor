import { GameConfig } from "../../config/GameConfig";
import GuidePoint_Generate from "../../ui-generate/guide/GuidePoint_generate";
import { TaskSate } from "../task/TaskData";
import TaskModuleC from "../task/TaskModuleC";

export default class GuidePoint extends GuidePoint_Generate {
    /**目标点 */
    private _targetPos: mw.Vector = null;
    /**UI3D到2D位置缓存 */
    private _iconUIPos: mw.Vector2 = mw.Vector2.zero;
    /**UI 只显示在屏幕内的缓存 */
    private _iconInScreenPos: mw.Vector2 = mw.Vector2.zero;
    /**图标大小 */
    private _iconSize: mw.Vector2 = mw.Vector2.zero;
    /**箭头大小 */
    private _arrowSize: mw.Vector2 = mw.Vector2.zero;
    /**箭头位置缓存 */
    private _arrowPos: mw.Vector2 = mw.Vector2.zero;
    /**屏幕视口大小 */
    private _screenSize: mw.Vector2 = mw.Vector2.zero;
    /**箭头方向 */
    private _arrowDirction: mw.Vector2 = new mw.Vector2(0, -1);
    /**箭头位置偏移 */
    private _arrowPosOff: mw.Vector2 = mw.Vector2.zero;
    /**是否在屏幕内 */
    private _isInScreen: boolean = true;

    /**
     * 构造UI文件成功后，在合适的时机最先初始化一次
     */
    protected onStart() {
        //设置能否每帧触发onUpdate
        this.canUpdate = true;
        this.layer = mw.UILayerTop;
        this._iconSize = this.img_icon.size;
        this._arrowSize = this.img_arrow.size;
        this._arrowPosOff = new mw.Vector2(this._iconSize.x / 2 - this._arrowSize.x / 2, this._iconSize.y / 2 - this._arrowSize.y / 2);
        this._screenSize = mw.WindowUtil.getViewportSize();
    }

    /**
     * 每一帧调用
     * 通过canUpdate可以开启关闭调用
     * dt 两帧调用的时间差，毫秒
     */
    protected onUpdate(dt: number) {
        if (this._targetPos) {
            this._iconUIPos = mw.InputUtil.projectWorldPositionToWidgetPosition(this._targetPos, false).screenPosition;
            this._iconUIPos.x -= this._iconSize.x / 2;
            this._iconUIPos.y -= this._iconSize.y / 2;
            this.setMoveUIPos();
        }
    }

    /**设置移动UI位置 */
    setMoveUIPos() {
        this._isInScreen = true;
        this._iconInScreenPos.set(this._iconUIPos);
        if (this._iconUIPos.x > this._screenSize.x) {
            this._isInScreen = false;
            this._iconInScreenPos.x = this._screenSize.x - this._iconSize.x;
        } else if (this._iconUIPos.x < 0) {
            this._isInScreen = false;
            this._iconInScreenPos.x = this._iconSize.x;
        }

        if (this._iconUIPos.y > this._screenSize.y) {
            this._isInScreen = false;
            this._iconInScreenPos.y = this._screenSize.y - this._iconSize.y;
        } else if (this._iconUIPos.y < 0) {
            this._isInScreen = false;
            this._iconInScreenPos.y = this._iconSize.y;
        }
        this.canvas_move.position = this._iconInScreenPos;

        if (!this._isInScreen) {
            this.img_arrow.visibility = mw.SlateVisibility.SelfHitTestInvisible;
            this._arrowPos.set(this._iconUIPos);
            this._arrowPos.subtract(this._iconInScreenPos);
            this._arrowPos.normalize();
            let ro = mw.Vector2.signAngle(this._arrowDirction, this._arrowPos);
            this._arrowPos.multiply(this._iconSize.x / 2);
            this._arrowPos.add(this._arrowPosOff);
            this.img_arrow.position = this._arrowPos;
            this.img_arrow.renderTransformAngle = ro;
        } else {
            this.img_arrow.visibility = mw.SlateVisibility.Collapsed;
        }

        let playerPos = Player.localPlayer.character.worldTransform.position;
        let dis = Math.abs(this._targetPos.x - playerPos.x) + Math.abs(this._targetPos.y - playerPos.y);
        dis = Math.floor(dis / 100);
        this.txt_distance.text = dis + "m";
        const visible = dis > 2 ? mw.SlateVisibility.SelfHitTestInvisible : mw.SlateVisibility.Collapsed;
        this.canvas_move.visibility = visible;
    }

    setPointShow(point?: Vector) {
        if (!point) {
            this._targetPos = null;
            this.canvas_move.visibility = mw.SlateVisibility.Hidden;
            return
        }
        this._targetPos = point;
        this.canvas_move.visibility = mw.SlateVisibility.SelfHitTestInvisible;
    }

    /**
     * 设置显示时触发
     */
    protected onShow() {
        const task = ModuleService.getModule(TaskModuleC).curTask;
        if (task) {
            let point: mw.Vector
            const config = GameConfig.Task.getElement(task.id);
            if (task.state === TaskSate.Commit) {
                point = config.CommitPoint
            } else if (task.state === TaskSate.Proceed) {
                point = config.GuidePoint;
            }
            this.setPointShow(point);
        }
    }

    /**
     * 设置不显示时触发
     */
    protected onHide() {
        this._targetPos = null;
        this.canvas_move.visibility = mw.SlateVisibility.Hidden;
    }
}
