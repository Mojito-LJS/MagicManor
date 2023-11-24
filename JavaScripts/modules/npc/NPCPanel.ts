/**
 * @Author       : songxing
 * @Date         : 2023-04-10 14:17:36
 * @LastEditors  : songxing
 * @LastEditTime : 2023-05-18 11:09:29
 * @FilePath     : \Projiecttest\JavaScripts\npc\NPCPanel.ts
 * @Description  : 
 */

import { GameConfig } from "../../config/GameConfig";
import { INPCConfigElement } from "../../config/NPCConfig";
import { INPCTalkElement } from "../../config/NPCTalk";
import { ITalkEventElement } from "../../config/TalkEvent";
import NPCPanel_Generate from "../../ui-generate/uiTemplate/NPC/NPCPanel_generate";
import BuildingModuleC from "../building/BuildingModuleC";
import TaskModuleC from "../task/TaskModuleC";
import { NPC_Events } from "./NPC";
import NPCItem from "./NPCItem";
export class P_NPCPanel extends NPCPanel_Generate {
	public static Instance: P_NPCPanel = null;
	private data: INPCConfigElement = null;
	private eventConfig: ITalkEventElement = null;

	private itemList: NPCItem[] = [];
	/**选中状态 */
	private selects: number[] = [];
	private npcGuid = "";
	private times: Map<number, number> = new Map<number, number>();
	private npcId: number;
	private _taskLine: number;
	private _reselect: number[];

	public onStart(): void {
		P_NPCPanel.Instance = this;
		this.layer = mw.UILayerMiddle;
		this.btn1.onClicked.add(this.onClickRob.bind(this));
		this.btn2.onClicked.add(this.onClickOff.bind(this));
		//this.btn2.text = (GameConfig.SquareLanguage.Danmu_Content_1054.Value);
		this.click.onClicked.add(() => {
			this.showTxtPanel(this.npcTalkData.nextTalk);
		})

		this.guideBtn.visibility = mw.SlateVisibility.Collapsed;
		this.guideBtn.onClicked.add(() => {
			this.guideBtn.visibility = mw.SlateVisibility.Collapsed;
		})

		this.scroll.visibility = (mw.SlateVisibility.Hidden);
		this.con1.visibility = (mw.SlateVisibility.Hidden);
		this.con2.visibility = (mw.SlateVisibility.Hidden);
		this.talkCanvas.visibility = (mw.SlateVisibility.Collapsed);
		this.canUpdate = true;
	}

	/**
	 * 显示事件
	 * @param data 
	 * @param npcGuid 
	 */
	public showEvents(data: INPCConfigElement, npcGuid: string, id: number): void {
		this.npcId = id;
		this.npcGuid = npcGuid;
		this.data = data;   //最原始的对话列
		this.createItemArr(this.data.FUNS)
	}

	/**显示脱离 */
	public showOff(npcGuid: string): void {
		this.npcGuid = npcGuid;
		this.con2.visibility = (mw.SlateVisibility.Visible);
	}

	/**显示抢夺 */
	public showRob(npcGuid: string): void {
		this.npcGuid = npcGuid;
		this.con1.visibility = (mw.SlateVisibility.Visible);
	}

	/**隐藏抢夺 */
	public hideRob(): void {
		this.con1.visibility = (mw.SlateVisibility.Hidden);
	}

	/**隐藏脱离 */
	public hideOff(): void {
		this.con2.visibility = (mw.SlateVisibility.Hidden);
	}

	private onClickRob(): void {
		Event.dispatchToServer(NPC_Events.NPC_OnClickRob + this.npcGuid);
	}

	private onClickOff(): void {
		Event.dispatchToServer(NPC_Events.NPC_OnClickOff + this.npcGuid);
	}


	createItemArr(list: number[]) {
		let scaleY = 0;

		for (let i = 0; i < list.length; i++) {   //创建新的对话选项
			let id = list[i];
			let config = GameConfig.TalkEvent.getElement(id);
			if (!this.itemList[i]) {
				this.createItem(i);
			}
			this.itemList[i].setData(config);
			this.itemList[i].show(true);
			scaleY += this.itemList[i].uiObject.size.y + 15;
		}

		this.scroll.scrollToStart()
		if (scaleY <= this.scroll.size.y) {
			this.scroll.visibility = mw.SlateVisibility.SelfHitTestInvisible;
			this.scroll.scrollBarVisibility = mw.SlateVisibility.Collapsed
			this.scroll.alwaysShowScrollBar = false;
		} else {
			this.scroll.visibility = mw.SlateVisibility.Visible
			this.scroll.scrollBarVisibility = mw.SlateVisibility.Visible
		}
	}

	/**
	 * 创建item
	 * @param index 
	 */
	private createItem(index: number): void {
		let item = mw.UIService.create(NPCItem)
		item.clicked.add(this.onItemEvents, this);
		this.mBtnCon.addChild(item.uiObject);
		//item.uiObject.size = (new mw.Vector2(520, 100));
		this.itemList[index] = item;
	}

	/**隐藏事件 */
	public hideEvents(): void {
		this.showOrHideAllItem(false)
		this.scroll.visibility = (mw.SlateVisibility.Hidden);
		this.talkCanvas.visibility = (mw.SlateVisibility.Hidden);
	}

	private showOrHideAllItem(show: boolean) {
		this.selects = [];
		for (let item of this.itemList) {
			item.refreshSelect(this.selects);
			item.show(show);
		}
	}

	/**
	 * 点击NPC事件
	 * @param id 事件列表ID
	 */
	public onItemEvents(id: number): void {
		let config = GameConfig.TalkEvent.getElement(id);
		this.selects.push(id);
		this.times.set(id, config.stopTime);
		for (let item of this.itemList) {
			item.refreshSelect(this.selects);
		}
		Event.dispatchToLocal(NPC_Events.NPC_OnClickItem + this.npcGuid, id);
	}

	private npcTalkData: INPCTalkElement
	/**
	 * 
	 * @param npcTalkID 
	 * @param config 
	 * @returns 
	 */
	public async showTxtPanel(npcTalkID: number, config?: ITalkEventElement) {
		if (config) {
			this.eventConfig = config;   //保存事件config
		}
		if (!npcTalkID) {
			this.talkCanvas.visibility = (mw.SlateVisibility.Collapsed);
			this.showOrHideAllItem(false);
			if (this._taskLine) {
				ModuleService.getModule(TaskModuleC).getTaskReward();
				this._taskLine = null;
			} else if (this._reselect) {
				ModuleService.getModule(BuildingModuleC).reselectBuilding(this._reselect);
				this._reselect = null
			} else {
				this.showEvents(this.data, this.npcGuid, this.npcId)  //对话完了  恢复到最初始的对话去
			}
			return;
		}

		this.npcTalkData = GameConfig.NPCTalk.getElement(npcTalkID)
		this.click.enable = true;
		this.scroll.visibility = (mw.SlateVisibility.Hidden);
		this.talkCanvas.visibility = (mw.SlateVisibility.Visible);
		this.talkTxt.text = this.npcTalkData.language;
		this.onTalkComplete();

		if (this.npcTalkData.hide) {
			this.showOrHideAllItem(false)//先隐藏掉之前的对话选项
		}

		if (this.npcTalkData.jumpTalk) {
			this.showOrHideAllItem(false)//先隐藏掉之前的对话选项
			this.createItemArr([this.npcTalkData.jumpTalk]);
		}

		if (this.npcTalkData.nextTalk)
			return;

		if (this.npcTalkData.playerTalk) {
			this.click.enable = false;
			this.showOrHideAllItem(false)//先隐藏掉之前的对话选项
			this.createItemArr(this.npcTalkData.playerTalk);
		}
	}

	/**每个对话需要处理的事情 */

	onTalkComplete() {
		const taskLine = this.npcTalkData.taskLineId
		if (taskLine) {
			const state = this.npcTalkData.taskState;
			if (state === 1) {
				ModuleService.getModule(TaskModuleC).takeTask(taskLine);
			} else if (state === 2) {
				this._taskLine = taskLine;
			}
		}
		if (this.npcTalkData.buildings) {
			this._reselect = this.npcTalkData.buildings
		}
	}
	/**
	 * 设置好感度显示
	 */
	setGoodWill() {
		this.mGoodWillTxt.text = this.data.NpcName;
	}

	public onUpdate(dt: number): void {
		for (let [id, time] of this.times) {
			time -= dt;
			this.times.set(id, time);
			if (time <= 0) {
				this.times.delete(id);
				this.selects.splice(this.selects.indexOf(id), 1);
				for (let item of this.itemList) {
					item.refreshSelect(this.selects);
				}
			}
		}
	}
}
