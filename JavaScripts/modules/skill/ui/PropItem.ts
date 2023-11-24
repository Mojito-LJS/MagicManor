import { IItemElement } from "../../../config/Item";
import PropItem_Generate from "../../../ui-generate/skill/PropItem_generate";


export class PropItem extends PropItem_Generate {

    public itemID: number

    public config: IItemElement;

    get clickBtn() {
        return this.mBtn;
    }
    protected onStart(): void {
    }

    public setData(config: IItemElement) {
        this.config = config;
        this.itemID = config.ID;
        this.mIcon.imageGuid = config.Icon;
        this.mName.text = config.Name
    }
}