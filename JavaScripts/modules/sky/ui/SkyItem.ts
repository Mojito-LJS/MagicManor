import { Tween } from "../../../ExtensionType";
import { ISkyChangeElement } from "../../../config/SkyChange";
import SkyItem_Generate from "../../../ui-generate/sky/SkyItem_generate";

const scale = mw.Vector2.zero;

export class SkyItem extends SkyItem_Generate {
    public id: number;
    public config: ISkyChangeElement;
    public anim: Tween<{ scale: number }>

    public get clickBtn() {
        return this.btn;
    }

    protected onStart(): void {
        this.anim = new Tween({ scale: 1 }).to({ scale: 1.5 }, 100).onUpdate((obj) => {
            scale.x = obj.scale;
            this.selectIcon.renderScale = scale;
            scale.y = obj.scale;
            this.icon.renderScale = scale;
        })
    }

    setData(config: ISkyChangeElement) {
        this.config = config;
        this.id = config.id;
        this.icon.imageGuid = config.icon;
        this.selectText.visibility = mw.SlateVisibility.Collapsed;
        this.selectIcon.visibility = mw.SlateVisibility.Collapsed;
    }

    onSelect() {
        this.selectText.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        this.selectIcon.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        this.anim.start();
    }

    restore() {
        this.selectIcon.renderScale = mw.Vector2.one;
        this.icon.renderScale = mw.Vector2.one;
        this.selectText.visibility = mw.SlateVisibility.Collapsed;
        this.selectIcon.visibility = mw.SlateVisibility.Collapsed;
    }
}