import { GeneralManager, } from '../../Modified027Editor/ModifiedStaticAPI';
import { SpawnManager, SpawnInfo, } from '../../Modified027Editor/ModifiedSpawn';
/** 
 * @Author       : 陆江帅
 * @Date         : 2023-06-13 16:12:12
 * @LastEditors  : 陆江帅
 * @LastEditTime : 2023-06-29 10:25:26
 * @FilePath     : \magicmanor\JavaScripts\modules\find\FindGame.ts
 * @Description  : 
 */
import { myCharacterGuid } from "../../ExtensionType";
import { GameConfig } from "../../config/GameConfig";
import Inform from "../../ui/commonUI/Inform";
import Tips from "../../ui/commonUI/Tips";
import GameUtils from "../../utils/GameUtils";
import { BagModuleC } from "../bag/BagModuleC";
import { MGSMsgHome } from "../mgsMsg/MgsmsgHome";

const resetTime = 10 * 30000

const MaxSilverCoinNum = 56;

export enum FindType {
	Ground = 1,
}

export default class FindGame {

	private static _instance: FindGame;
	public static get instance() {
		if (!this._instance) this._instance = new FindGame();
		return this._instance;
	}
	/**find对象池 */
	private _findItemPool: Map<string, FindItem[]> = new Map();
	/**场景中find物体 */
	private _findItemArr: FindItem[] = [];
	/**计时器 */
	private _timer: number;
	/**是否在游戏中 */
	private _inGame: boolean = false;

	public get inGame(): boolean {
		return this._inGame;
	}

	public startFindGame() {
		this.randomCreatePoint();
		if (this._timer) {
			clearInterval(this._timer);
			this._timer = null;
		}
		this._timer = setInterval(() => {
			this.randomCreatePoint();
		}, resetTime)
		this._inGame = true;
	}

	public endFindGame() {
		clearInterval(this._timer);
		for (const item of this._findItemArr) {
			if (item.isActive) {
				item.despawn();
			}
		}
		this._findItemArr = [];
		this._inGame = false;
	}

	private async randomCreatePoint() {
		Inform.show("蓝鲸小镇上出现了家具币！", 3000);
		for (const item of this._findItemArr) {
			if (item.isActive) {
				item.despawn();
			}
		}
		this._findItemArr = [];
		const points = GameConfig.Find.getAllElement();
		const randomPoints = GameUtils.getRandomArr(points, MaxSilverCoinNum);
		for (const point of randomPoints) {
			const item = await this.spawnFindItem(point.id, point.guid);
			this._findItemArr.push(item);
		}
	}

	private async spawnFindItem(id: number, guid: string) {
		let objPool: FindItem[]
		if (!this._findItemPool.has(guid)) {
			objPool = []
			this._findItemPool.set(guid, objPool)
		} else {
			objPool = this._findItemPool.get(guid);
		}
		let findItem: FindItem;
		let isNew: boolean = true
		for (let i = 0; i < objPool.length; i++) {
			const element = objPool[i]
			if (!element.isActive) {
				findItem = element;
				isNew = false;
				break;
			}
		}
		if (isNew) {
			findItem = new FindItem(guid);
			objPool.push(findItem)
		}
		await findItem.spawn(id);
		return findItem
	}
}

class FindItem {
	public findType: FindType;
	public guid: string;
	public itemObj: mw.GameObject;
	public trigger: mw.Trigger;
	public isActive: boolean = false;

	constructor(guid: string) {
		this.guid = guid;
	}

	public async spawn(id: number) {
		if (!this.itemObj) {
			this.itemObj = await SpawnManager.asyncSpawn({ guid: this.guid, replicates: false })
			this.trigger = this.itemObj.getChildByName("trigger") as mw.Trigger;
			this.trigger.onEnter.add((object: mw.GameObject) => {
				if (object.gameObjectId === myCharacterGuid) {
					/**捡到find物品 */
					GeneralManager.rpcPlayEffectAtLocation("151739", this.itemObj.worldTransform.position.add(mw.Vector.up.multiply(50)), 1, mw.Rotation.zero, mw.Vector.one.multiply(3));
					SoundService.playSound("177709");
					ModuleService.getModule(BagModuleC).addItem(90005, this.findType, false, false);
					Event.dispatchToLocal("AddHomeMoney", this.findType);
					Tips.show("家具币 + " + this.findType);
					this.despawn();
					/**埋点 */
					MGSMsgHome.getHomeMoney(this.findType);
				}
			})
		}
		this.trigger.enabled = (true);
		this.itemObj.setCollision(mw.CollisionStatus.QueryOnly, true)
		this.itemObj.setVisibility(mw.PropertyStatus.On)
		this.isActive = true
		const config = GameConfig.Find.getElement(id);
		this.findType = config.type;
		this.itemObj.worldTransform.position = config.point;
	}

	public despawn() {
		this.trigger.enabled = (false);
		this.itemObj.setCollision(mw.CollisionStatus.Off, true)
		this.itemObj.setVisibility(mw.PropertyStatus.Off)
		this.isActive = false;
		this.itemObj.worldTransform.position = despawnLocation;
	}
}

const despawnLocation = new mw.Vector(9999, 9999, 9999)

