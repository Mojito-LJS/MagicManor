import { GeneralManager, } from '../../../Modified027Editor/ModifiedStaticAPI';
import SkillUI_Generate from "../../../ui-generate/skill/SkillUI_generate";
import { MGSMsgHome } from "../../mgsMsg/MgsmsgHome";
import { skillItem } from "./SkillItem";

export default class SkillUI extends SkillUI_Generate {
	public skillItemArr: skillItem[] = [];
	private _pointOffset: mw.Vector2 = mw.Vector2.zero;
	private _aimPoint: mw.Vector2;
	protected onStart(): void {
		for (let i = 1; i < 5; i++) {
			this.skillItemArr.push(
				new skillItem(
					this["mSkill" + i],
					this["mBtn" + i],
					this["mMaskButton" + i],
					this["mCount" + i],
					this["mCD" + i],
					this["mDis" + i],
					this["mFire" + i],
					this["mDes" + i]
				)
			);
		}
	}

	protected onShow(): void {
		this.canUpdate = true;
	}

	protected onHide(): void {
		this.canUpdate = false;
	}

	protected onUpdate(dt: number): void {
		for (let i = 0; i < this.skillItemArr.length; i++) {
			const skillItem = this.skillItemArr[i];
			if (skillItem.uiObject.visible) {
				if (skillItem.skill.cd < 0) {
					skillItem.maskBtn.fanShapedValue = 1;
					skillItem.CD.visibility = mw.SlateVisibility.Collapsed;
				} else {
					skillItem.maskBtn.fanShapedValue = 1 - skillItem.skill.cd / skillItem.skill.cdTotol;
					skillItem.CD.visibility = mw.SlateVisibility.SelfHitTestInvisible;
					skillItem.CD.text = skillItem.skill.cd.toFixed(1);
				}
			}
		}
	}
	// private movePoint(targetPoint: mw.Vector) {
	// 	if (!targetPoint) {
	// 		this.mAim.position = mw.Vector2.zero;
	// 		return;
	// 	}
	// 	if (!this._aimPoint) {
	// 		this._aimPoint = this.mAim.size.subtract(this.mAimImage.position).subtract(this.mAimImage.size.divide(2));
	// 	}
	// 	GeneralManager.modifyProjectWorldLocationToWidgetPosition(Player.localPlayer, targetPoint, this._pointOffset, true);
	// 	this._pointOffset.subtract(this._aimPoint);
	// 	this.mAim.position = this._pointOffset;
	// }
}
