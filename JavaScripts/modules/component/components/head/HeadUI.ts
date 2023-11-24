import { IFightMonsterElement } from "../../../../config/FightMonster";
import { GameConfig } from "../../../../config/GameConfig";
import HeadUI_Generate from "../../../../ui-generate/fighting/HeadUI_generate";
import { TimeTool } from "../../../../utils/TimeTool";
import ComponentSystem from "../../base/ComponentSystem";
import { UIWidgetBase } from "../../base/UIWidgetBase";
import { AttributeEvent, AttributeComponent } from "../attribute/AttributeComponent";

/**
 * @Author       : peiwen.chen
 * @Date         : 2023-03-27 14:42:20
 * @LastEditors  : peiwen.chen
 * @LastEditTime : 2023-03-28 08:59:28
 * @FilePath     : \mollywoodschool\JavaScripts\modules\fighting\ui\HeadUI.ts
 * @Description  : 修改描述
 */
export class HeadUIManager {
	private static _array: HeadUI[] = [];
	public static getHeadUI(entity: string, uiWidget?: mw.UIWidget, config?: IFightMonsterElement): HeadUI {
		if (this._array.length > 0) {
			const headUI = this._array.pop();
			headUI.reset(entity, config);
			return headUI;
		}
		return new HeadUI(entity, uiWidget, config);
	}
	public static recover(headUI: HeadUI) {
		if (headUI.isNpc) {
			return;
		}
		headUI.recover();
		this._array.push(headUI);
	}
}
export enum MonsterHp {
	Max,
	Hp80,
	Hp50,
	Hp20,
	Dead,
}
export class HeadUI extends UIWidgetBase<HeadUI_Generate> {
	private _talkDebounce: TimeTool.ReturnTimeObject<() => void>;

	private _talk: number[] = [];
	isNpc: boolean;
	private _attribute: AttributeComponent;

	constructor(public ownerSign: string, uiWidget?: mw.UIWidget, private _config?: IFightMonsterElement) {
		super(HeadUI_Generate, uiWidget, false);
		if (uiWidget) {
			this.isNpc = true;
			uiWidget.tag = "NPC";
			uiWidget["__headUI"] = this;
		}
	}

	protected onInit() {
		this._attribute = ComponentSystem.getComponent(AttributeComponent, this.ownerSign)
		const attribute = this._attribute;
		const { headMaxD, headScaleFactor, posOffset } = this._config;
		this.uiWidget.headUIMaxVisibleDistance = headMaxD;
		// this.uiWidget.scaledByDistanceEnable = false;
		if (posOffset) {
			this.uiWidget.localTransform.position = posOffset;
		}
		this.view.talkCanvas.visibility = mw.SlateVisibility.Collapsed;
		this._talkDebounce = TimeTool.Global.debounce(
			this,
			() => {
				this.view.talkCanvas.visibility = mw.SlateVisibility.Collapsed;
				if (this.view.textHp.text === "0") {
					this.hide();
				}
			},
			this._config.time
		);
		this.uiWidget.distanceScaleFactor = headScaleFactor;
		const hp = attribute.getAttributeValue("hp");
		if (hp <= 0) {
			this.hide();
		} else {
			this.show();
		}
		this.view.textHp.text = hp.toString();
		attribute.addListen(AttributeEvent.attributeChange, this, this.updateBar);
	}

	public reset(sign: string, config: IFightMonsterElement) {
		this.ownerSign = sign;
		const attribute = this._attribute = ComponentSystem.getComponent(AttributeComponent, sign)
		const { headMaxD, headScaleFactor, posOffset } = config;
		this.uiWidget.headUIMaxVisibleDistance = headMaxD;
		// this.uiWidget.scaledByDistanceEnable = false;
		if (posOffset) {
			this.uiWidget.localTransform.position = posOffset;
		}
		this.view.talkCanvas.visibility = mw.SlateVisibility.Collapsed;
		this._talkDebounce = TimeTool.Global.debounce(
			this,
			() => {
				this.view.talkCanvas.visibility = mw.SlateVisibility.Collapsed;
				if (this.view.textHp.text === "0") {
					this.hide();
				}
			},
			this._config.time
		);
		this.uiWidget.distanceScaleFactor = headScaleFactor;
		const hp = attribute.getAttributeValue("hp");
		if (hp <= 0) {
			this.hide();
		} else {
			this.show();
		}
		this.view.textHp.text = hp.toString();
		attribute.addListen(AttributeEvent.attributeChange, this, this.updateBar);
	}

	private updateBar = (attribute: AttributeComponent, attributeName: string, oldValue: number, newValue: number, fromSign: string, isS: boolean) => {
		if (attributeName === "hp") {
			this.view.textHp.text = newValue.toString();
			const hp = newValue / attribute.getAttributeValue("maxHp");
			let index = 0;
			if (hp > 0.5) {
				index = MonsterHp.Hp80;
			} else if (hp > 0.2) {
				index = MonsterHp.Hp50;
			} else if (hp > 0) {
				index = MonsterHp.Hp20;
			} else {
				index = MonsterHp.Dead;
			}
			this.changeTalk(index);
		}
	};

	private changeTalk(type: MonsterHp) {
		if (this._talk.includes(type)) {
			return;
		}
		this._talk.push(type);
		const lId = this._config?.inform[type];
		const lCfg = GameConfig.SquareLanguage.getElement(lId);
		if (lCfg) {
			this.view.talkCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
			this.view.talkText.text = lCfg?.Value;
			this._talkDebounce.run();
		}
	}
	onDestroy(): void {
		this.detachFromGameObject();
	}

	public recover() {
		this._attribute.clearAgentOfCaller(this);
		this.hide();
		this.detachFromGameObject();
	}
}
