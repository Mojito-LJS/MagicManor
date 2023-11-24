import { GameConfig } from "../../config/GameConfig";
import { EventsName } from "../../const/GameEnum";
import { GlobalData } from "../../const/GlobalData";
import { GlobalModule } from "../../const/GlobalModule";
import { myCharacterGuid, UIManager } from "../../ExtensionType";
import ComponentSystem from "../component/base/ComponentSystem";
import { MGSMsgHome } from "../mgsMsg/MgsmsgHome";
import BulletTrrigerMgr from "./bullettrriger/BulletTrrigerMgr";
import SkillBase from "./logic/SkillBase";
import { SkillComponent } from "./SkillComponent";
import { SkillData } from "./SkillData";
import SkillMgr from "./SkillMgr";
import SkillModule_Server from "./SkillModule_Server";
import BesomMgr from "./skillObj/BesomMgr";
import SkillUI from "./ui/SkillUI";

export default class SkillModule_Client extends ModuleC<SkillModule_Server, SkillData> {
	private _skillUI: SkillUI;
	private _curSkill: SkillBase[] = [null, null, null, null];
	protected onStart(): void {
		this._skillUI = UIManager.show(SkillUI);
		InputUtil.onKeyDown(mw.Keys.K, () => {
			console.log(GlobalModule.MyPlayerC.State)
			this.getSkill([208101, 208201])
		});


		playerScale.x = playerScale.y = playerScale.z = this.localPlayer.character.worldTransform.scale.x;
		Event.addLocalListener(EventsName.EquipProp, (itemID: number) => {
			if (itemID == 0) this.getSkill([]);
			else this.getSkill(GameConfig.Item.getElement(itemID).Skills, itemID);
		});
		this.registerSkill();
	}

	private registerSkill() {
		for (const config of GameConfig.Skill.getAllElement()) {
			if (!SkillMgr.Inst.skillClassMap.has(config.ID)) {
				SkillMgr.Inst.skillClassMap.set(config.ID, SkillBase);
			}
		}
	}

	public getSkill(skills: number[], itemID: number = 0) {
		if (!skills || !ComponentSystem.hasComponent(myCharacterGuid, SkillComponent)) {
			skills = [];
		}
		const skillComponent = ComponentSystem.getComponent(SkillComponent, myCharacterGuid)
		const skillItemArr = this._skillUI.skillItemArr;
		for (const iterator of skillItemArr) {
			iterator.hide();
		}
		for (let i = 0; i < this._curSkill.length; i++) {
			if (this._curSkill[i]) {
				this._curSkill[i].onRemove();
				this._curSkill[i] = null;
			}
		}
		for (let i = 0; i < skills.length; i++) {
			const ID = Number((skills[i] / 100).toFixed(0));
			const skill: SkillBase = skillComponent.findSkill(ID)
			if (skill) {
				skill.show(skills[i], itemID);
				skillItemArr[i].show(skill);
				this._curSkill[i] = skill;
			}
		}
	}

	protected onUpdate(dt: number): void {
		BulletTrrigerMgr.instance.update(dt);
		BesomMgr.instance.onUpdate(dt);
		if (GlobalData.skillCD >= 0) {
			GlobalData.skillCD -= dt;
		}
	}
}
export const playerScale: mw.Vector = new mw.Vector();
