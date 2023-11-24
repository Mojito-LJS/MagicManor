import { ActiveBuff } from "../base/ActiveBuff";
import { regBuff } from "../base/BuffRegister";


/**
 * 锁血buff
 */

@regBuff('DeathAwayEffect', 'DeathAwayEffect')
export class DeathAwayEffect extends ActiveBuff {

    public override async start(): Promise<void> {
        super.start();
    }

    private onExecute() {
    }
}