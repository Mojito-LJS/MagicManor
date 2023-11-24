import { ISquareActionConfigElement } from "../../config/SquareActionConfig";
import { ActionBaseCfg } from "../squareBase/ActionBase/ActionBaseData";

export default class ActionData {

	public static get(cfg: ISquareActionConfigElement): ActionBaseCfg {
		let data = new ActionBaseCfg();
		data.id = cfg.ID;
		data.name = cfg.name;
		data.type = cfg.type;
		data.icon = cfg.icon;
		data.actionId = cfg.actionId;
		data.singleType = cfg.singleType;
		data.doubleType = cfg.doubleType;
		data.v = cfg.v;
		data.r = cfg.r;
		data.sendStance = cfg.sendStance;
		data.accectStance = cfg.accectStance;
		data.time = cfg.time;
		data.visual1 = cfg.visual1;
		data.visual2 = cfg.visual2;
		data.circulate = cfg.circulate;
		return data;
	}
}
