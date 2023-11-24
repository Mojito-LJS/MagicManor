/**
 * @Author       : peiwen.chen
 * @Date         : 2023-03-22 17:34:28
 * @LastEditors  : peiwen.chen
 * @LastEditTime : 2023-03-22 17:39:36
 * @FilePath     : \mollywoodschool\JavaScripts\modules\fighting\ui\FightUI.ts
 * @Description  : 修改描述
 */
import { EventsName } from "../../../const/GameEnum";
import FightUI_Generate from "../../../ui-generate/fighting/FightUI_generate";

export default class FightUI extends FightUI_Generate {
	// private _initBarEvent: mw.EventListener;
	protected onStart(): void {
		this.init();
		Event.addLocalListener(EventsName.MyPlayerAttributeChange, this.changeBar);
	}
	init() {
		// const my = PlayerManagerC.instance.myEntity;
		// if (my) {
		// 	this.changeAllBar(my);
		// } else {
		// 	Event.addLocalListener(EventsName.PlayerFightInit, this.changeAllBar);
		// }
	}

	// private changeAllBar = (my: string) => {
	// 	const attribute = my.attribute.defaultAttributeSet.currentData as PlayerAttr;
	// 	this.hpBar.sliderMaxValue = attribute.maxHp;
	// 	this.hpBar.currentValue = attribute.hp;
	// 	// this.mpBar.sliderMaxValue = attribute.maxMp;
	// 	// this.mpBar.currentValue = attribute.mp;
	// 	// if (this._initBarEvent) {
	// 	//     this._initBarEvent.disconnect()
	// 	// }
	// };

	private changeBar = (attributeName: string, newValue: number) => {
		switch (attributeName) {
			case "maxHp":
				this.hpBar.sliderMaxValue = newValue;
				break;
			case "hp":
				this.hpBar.currentValue = newValue;
				break;
			case "maxMp":
				this.mpBar.sliderMaxValue = newValue;
				break;
			case "mp":
				this.mpBar.currentValue = newValue;
				break;
			default:
				break;
		}
	};
}
