import ManorPlayerItem_Generate from "../../../ui-generate/manor/ManorPlayerItem_generate";
import { BagUtils } from "../../bag/BagUtils";
import { ManorInfo } from "../BuildingModuleC";
import { ManorState } from "../BuildingModuleS";

export class ManorPlayerItem extends ManorPlayerItem_Generate {
    public id: number;
    public state: ManorState
    public manor: number;

    get clickInviteBtn() {
        return this.inviteBtn;
    }

    get clickVisitBtn() {
        return this.visitBtn
    }

    setData(info: ManorInfo) {
        const { id, state, manor, level } = info;
        this.id = id;
        this.state = state;
        this.manor = manor;
        let str = BagUtils.getName(id);
        if (str.length > 5) {
            str = StringUtil.format("{0},{1}", str.substring(0, 5), "...");
        }
        this.name.text = str;
        this.icon.imageGuid = BagUtils.getGender(id) == "1" ? "13774" : "13791";
        this.level.text = level + "级庄园";
    }
}