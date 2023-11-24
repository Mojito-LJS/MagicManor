import BagTips_Generate from "../../../ui-generate/bag/BagTips_generate";

export class BagTips extends BagTips_Generate {

    protected onStart(): void {
        this.initButtons()
    }

    protected initButtons(): void {
        super.initButtons();
        this.close.onClicked.add(() => {
            this.hide()
        })

        this.closeBtn.onClicked.add(() => {
            this.hide()
        })

    }
}