/** 
 * @Author       : peiwen.chen
 * @Date         : 2022-12-22 16:06:04
 * @LastEditors  : peiwen.chen
 * @LastEditTime : 2023-03-15 13:25:22
 * @FilePath     : \fantasymagicschool\JavaScripts\modules\fighting\core\buff\buffModifier\DeathAwayEffect.ts
 * @Description  : 修改描述
 */

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