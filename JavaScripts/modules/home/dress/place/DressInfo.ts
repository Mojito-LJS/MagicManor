import { SpawnManager,SpawnInfo, } from '../../../../Modified027Editor/ModifiedSpawn';
import { GameConfig } from "../../../../config/GameConfig";
import { InteractItem } from "../interact/InteractItem";
import { InteractMgr } from "../interact/InteractMgr";

export class DressInfo {
	public go: mw.GameObject;

	public id: number = 0;

	public cfgId: number = 0;

	public pos: Vector = Vector.zero;

	public rot: Rotation = Rotation.zero;

	public rotateVal: number = 0;

	public viewGo: mw.GameObject;

	public colorId: number = 0;

	private _interacts: InteractItem[] = [];

	public constructor(id: number, cfgId: number, pos: Vector, rot: Rotation, rotateVal: number, colorId: number) {
		this.id = id;
		this.cfgId = cfgId;
		this.pos = pos;
		this.rot = rot;
		this.rotateVal = rotateVal;
		this.colorId = colorId;
	}

	public updateColor(colorId: number) {
		if (this.go == null) {
			logI("装饰外观没初始化好");
			return;
		}
		if (this.cfgId == 0) {
			logI("装饰无效配置");
			return;
		}
		if (colorId == 0) {
			logI("装饰无效颜色");
			return;
		}
		this.colorId = colorId;
		const cfg = GameConfig.HomeDress.getElement(this.cfgId);
		const colorCfg = GameConfig.HomeColor.getElement(this.colorId);
		if (cfg && colorCfg && this.viewGo) {
			let go: mw.GameObject = this.viewGo;
			const childs = go.getChildren();
			if (childs.length > 0) {
				go = childs[0];
			}
			const mesh = go as mw.Model;
			mesh.createMaterialInstance(cfg.colorIndex);
			const mat = mesh.getMaterialInstance()[cfg.colorIndex];
			const colorNames = mat.getAllVectorParameterName();
			colorNames.forEach((e) => {
				mat.setVectorParameterValue(e, mw.LinearColor.colorHexToLinearColor(colorCfg.colorHex));
			});
		}
	}

	public async initGo(sign: string) {
		const cfg = GameConfig.HomeDress.getElement(this.cfgId);

		if (!AssetUtil.assetLoaded(cfg.guid)) {
			await AssetUtil.asyncDownloadAsset(cfg.guid);
		}

		if (!this.viewGo) {
			this.go = await SpawnManager.asyncSpawn({ guid: cfg.guid, replicates: false });
		}
		this.go.worldTransform.position = this.pos;
		this.go.worldTransform.rotation = this.rot;
		this.viewGo = this.go.getChildByName("view");
		if (!this.viewGo) {
			return;
		}
		this.viewGo.setCollision(mw.CollisionStatus.On);
		this.updateColor(this.colorId);
		if (!cfg.isInteract) return;
		const interact = this.viewGo.getChildByName("interact");
		if (!interact) return;
		const children = interact.getChildren();
		if (!children && children.length == 0) return;
		for (let index = 0; index < children.length; index++) {
			const element = children[index];
			if (element instanceof mw.Interactor) {
				const interact = InteractMgr.Instance.create(element, index);
				interact.init(this.id, this.cfgId, sign);
				this._interacts.push(interact);
			}
		}
	}

	destroy() {
		const interacts = this._interacts;
		if (interacts.length > 0) {
			for (const interact of interacts) {
				interact.destroy();
			}
			interacts.length = 0;
		}
		this.go.destroy();
		this.go = null;
	}
}
