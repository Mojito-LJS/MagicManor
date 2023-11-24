import { myCharacterGuid } from "../../ExtensionType";
import { MGSMsgHome } from "./MgsmsgHome";

@Component
export default class MsgTrigger extends mw.Script {

    @mw.Property({ displayName: "区域ID" })
    private record: number = 0;

    private time: number = 0;
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        if (SystemUtil.isClient()) {
            const id = setInterval(() => {
                if (this.gameObject) {
                    this.initMgsTrigger();
                    clearInterval(id)
                }
            }, 100)
        }
    }

    initMgsTrigger() {
        if (this.gameObject instanceof mw.Trigger) {
            this.gameObject.onEnter.add((go) => {
                if (go?.gameObjectId === myCharacterGuid) {
                    this.time = TimeUtil.elapsedTime()
                }
            })

            this.gameObject.onLeave.add((go) => {
                if (go?.gameObjectId === myCharacterGuid) {
                    let msgTime = (TimeUtil.elapsedTime() - this.time)
                    MGSMsgHome.areaStayTime(this.record, Math.ceil(msgTime))
                }
            })
        }
    }
}