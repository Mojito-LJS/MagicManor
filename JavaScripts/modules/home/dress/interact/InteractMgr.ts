import { HomeDressModuleC } from "../HomeDressModuleC";
import { InteractItem } from "./InteractItem";

export class InteractMgr {
	private static _instance: InteractMgr;
	public static get Instance() {
		if (!this._instance) {
			this._instance = new InteractMgr();
		}
		return this._instance;
	}

	private _interactItems: InteractItem[] = [];

	public get interactSign(): string[] {
		return this._interactItems.map((item) => `${item.sign}|${item.index}`);
	}

	private _nowInteractItem: InteractItem;

	public set nowInteractItem(v: InteractItem) {
		if (v) {
			ModuleService.getModule(HomeDressModuleC).startInteract(v.index, v.sign, true);
			this._nowInteractItem = v;
		} else {
			if (this._nowInteractItem) {
				this._nowInteractItem.endInteract();
				const now = this._nowInteractItem;
				ModuleService.getModule(HomeDressModuleC).startInteract(now.index, now.sign, false);
				this._nowInteractItem = v;
			}
		}
	}

	clear() {
		this._interactItems.forEach((item) => {
			item.destroy();
		});
		this._interactItems.length = 0;
	}

	create(interact: mw.Interactor, index: number) {
		if (!interact) return;
		const children = interact.getChildren();
		if (children.length == 0) return;
		const trigger = interact.getChildren()[0];
		if (!trigger) return;
		if (!(trigger instanceof mw.Trigger)) return;
		const interactItem = new InteractItem(interact, trigger, index);
		interactItem.onDestroy.add(() => {
			const index = this._interactItems.indexOf(interactItem);
			if (index != -1) {
				this._interactItems.splice(index, 1);
			}
		});
		this._interactItems.push(interactItem);
		return interactItem;
	}

	isInteract(index: number, sign: string, isActive: boolean) {
		const item = this._interactItems.find((item) => {
			return item.index == index && item.sign == sign;
		});
		if (!item) return;
		item.isActive = isActive;
	}
}
