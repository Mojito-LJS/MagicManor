import { GeneralManager, } from '../../Modified027Editor/ModifiedStaticAPI';
import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';


import { UIManager } from "../../ExtensionType";
import { GameConfig } from "../../config/GameConfig";
import { INPCConfigElement } from "../../config/NPCConfig";
import { EventsName } from "../../const/GameEnum";
import GameUtils from "../../utils/GameUtils";
import { ManorState } from "../building/BuildingModuleS";
import { TaskLineType, TaskSate } from "../task/TaskData";
import TaskModuleC from "../task/TaskModuleC";
import SP_NPC, { NPC_Events } from "./NPC";
import { NPCDataHelper } from "./NPCData";
import { NPCHead } from "./NPCHead";
import { P_NPCPanel } from "./NPCPanel";

export class NPCClient {
	/**npc对象 */
	public npcObj: mw.Character = null;
	/**npc配置 */
	private config: INPCConfigElement = null;
	/**npc专属guid */
	private npcGuid = "";
	/**头顶UI */
	private head: NPCHead = null;
	/**触发器 */
	public trigger: mw.Trigger = null;
	/**默认对话cd */
	private cd = 0;
	/**自己 */
	private self: mw.Player = null;
	private scrpit: SP_NPC;
	/**这个NPC是否正在和玩家交互 */
	private isInteractive: boolean = false;
	/**npc最初始的位置 */
	private originPos: mw.Vector
	private originRot: mw.Rotation
	/**NPC的动画 */
	private animation: mw.Animation;
	private npcState: NPCStateC = NPCStateC.Day
	private _isTurn: boolean
	private resListener?: (...params: any[]) => void
	public constructor(npc: mw.Character, config: INPCConfigElement) {
		this.npcObj = npc;
		this.config = config;
		this.originPos = npc.worldTransform.position.clone();
		this.originRot = npc.worldTransform.rotation.clone();
	}

	/**
	 * 初始化
	 * @param triggerGuid 
	 * @param npcGuid 
	 */
	public async init(triggerGuid: string, npcGuid: string, scrpit: SP_NPC): Promise<void> {
		this.npcGuid = npcGuid;
		this.scrpit = scrpit;
		Event.addLocalListener(NPC_Events.NPC_OnClickItem + this.npcGuid, (id: number) => {
			this.onNPCClick(id);
		});
		Event.addLocalListener(NPC_Events.NPC_HidePanel, () => {
			P_NPCPanel.Instance.hideEvents();
		})
		Event.addLocalListener(EventsName.ManorChange, (state: ManorState) => {
			if (state === ManorState.Free) {
				this.updateVisible()
			} else if (state === ManorState.Visit) {
				this.setNPCVisible(false)
			}
		})
		let ui = this.npcObj.overheadUI;
		this.head = UIManager.create(NPCHead);
		ui.setTargetUIWidget(this.head.uiWidgetBase)
		ui.drawSize = new mw.Vector2(500, 200);
		ui.headUIMaxVisibleDistance = 5000;
		ui.distanceScaleFactor = 300;
		//ui.scaledByDistanceEnable = false
		ui.pivot = new mw.Vector2(0.5, 0.5);
		ui.localTransform.position = (this.config.NamePos)
		this.head.setName(this.config.NpcName.toString());
		const trigger = await GameObject.asyncFindGameObjectById(triggerGuid)
		if (!trigger) {
			console.error("error:NpcClient obj未找到")
			return;
		}
		this.trigger = trigger as mw.Trigger;
		this.trigger.onEnter.add(this.onTriggerEnter.bind(this));
		this.trigger.onLeave.add(this.onTriggerExit.bind(this));

		Player.asyncGetLocalPlayer().then((player: mw.Player) => {
			this.self = player;
			setInterval(this.updateDis.bind(this), 1000);
		});


		if (this.config.attitude) {
			PlayerManagerExtesion.changeStanceExtesion(this.npcObj,this.config.attitude)
		}

		if (this.config.action) {
			this.config.action.forEach(async action => {
				await GameUtils.downAsset(action)
			})
			setTimeout(() => {//延迟 不然播不了
				this.setDayAni();
			}, 5000);
		}

		this.updateVisible();
	}

	/**
	 * 更新NPC得显隐状态
	 */
	public updateVisible(): void {
		const taskLine = this.config.taskLine;
		if (!taskLine) {
			return;
		}
		const taskModuleC = ModuleService.getModule(TaskModuleC)
		const curTaskLine = taskModuleC.curTaskLine;
		const curTask = taskModuleC.curTask;
		if (taskLine !== curTaskLine) {
			this.setNPCVisible(false);
		} else {
			this.setNPCVisible(true);
			if (taskLine !== TaskLineType.Finish) {
				const state = curTask ? curTask.state : TaskSate.Receive;
				this.refreshTaskState(state);
			}
		}
	}

	public setNPCVisible(isVisible: boolean) {
		const status = isVisible ? mw.PropertyStatus.On : mw.PropertyStatus.Off;
		this.npcObj.setCollision(status)
		this.npcObj.setVisibility(status)
		this.trigger.enabled = (isVisible);
	}

	public leave() {
		const location = this.npcObj.worldTransform.position;
		location.z -= 100
		GeneralManager.rpcPlayEffectAtLocation("146327", location, 1, mw.Rotation.zero, mw.Vector.one.multiply(2))
		this.showHeadMessage(this.config.leaveText);
		setTimeout(() => {
			this.setNPCVisible(false);
		}, 2000);
	}

	private setDayAni() {
		if (this.config.aniRoundTime[0] == 0) {
			this.playAni(true)
		} else {
			this.playAni(false)
		}
	}

	private aniTimer
	private playAni(loop: boolean) {
		if (this.npcState == NPCStateC.Game) return
		const actionId = this.config.action[MathUtil.randomInt(0, this.config.action.length)]
		this.animation = PlayerManagerExtesion.loadAnimationExtesion(this.npcObj, actionId, this.scrpit.isServerNpc)
		if (!loop) {
			let time = mw.MathUtil.randomFloat(this.config.aniRoundTime[0], this.config.aniRoundTime[1])
			this.aniTimer = setTimeout(() => {
				this.playAni(false)
			}, time * 1000);
		}
		this.animation.speed = this.config.time;
		this.animation.loop = loop ? 0 : 1
		this.animation.play();
	}


	private clicknumber: number

	/**
	 * 点击npc事件
	 * @param id 
	 */
	private onNPCClick(id: number): void {
		this.clicknumber = 0;
		let config = GameConfig.TalkEvent.getElement(id);
		if (config.state == 2) {
			Event.dispatchToServer(NPC_Events.NPC_On + this.npcGuid);
			return;
		}
		//MGSMsgHome.setNpc(id, this.config.ID);
		if (config.ActionGuid) {
			PlayerManagerExtesion.rpcPlayAnimation(this.npcObj, config.ActionGuid, 1, config.Actiontime)
			let ani = PlayerManagerExtesion.loadAnimationExtesion(this.npcObj, config.ActionGuid, this.scrpit.isServerNpc)
			ani.speed = config.Actiontime
			ani.play();
		}
		if (config.EffGuid) {
			GeneralManager.rpcPlayEffectAtLocation(config.EffGuid, this.npcObj.worldTransform.position.add(config.Pos));
		}
		if (config.soundGuid) {
			mw.SoundService.playSound(config.soundGuid, 1, config.Scale);
		}
		if (config.params) {
			this.extraParamsHelper(config.params)
		}
		if (config.TEXT) {
			this.clicknumber = config.TEXT;
		}
		if (config.TaskLine) {
			const state = ModuleService.getModule(TaskModuleC).checkTaskLineState(config.TaskLine);
			this.clicknumber = config.TaskText[state]
		}
		P_NPCPanel.Instance.showTxtPanel(this.clicknumber, config);
	}

	/**切换Npc状态 */
	private changeNpcState(state: NPCStateC) {
		if (this.npcState == state) return
		this.npcState = state;
	}


	extraParamsHelper(params: number) {
		switch (params) {
			case 1:
				break;
			case 2:
				break;
			case 3:
				break;
			default:
				break;
		}
	}

	//===================================被别的地方拿去使用或者归还============================================
	onUse(fun?: mw.GameObjectDelegateFuncType) {
		if (fun) {
			this.resListener = fun
			this.trigger.onEnter.add(this.resListener)
		}
		if (this.animation) this.animation.stop()
		clearTimeout(this.aniTimer)
		this.changeNpcState(NPCStateC.Game)
	}


	onReturn() {
		if (this.npcState != NPCStateC.Game) return
		if (this.resListener) this.trigger.onEnter.remove(this.resListener)
		this.playAni(this.config.aniRoundTime[0] == 0)
		this.npcObj.worldTransform.position = this.originPos.clone()
		this.npcObj.worldTransform.rotation = this.originRot.clone()
		this.changeNpcState(NPCStateC.Day)
	}
	//==========================================触发器监听=======================================

	/**
	 * 进入触发器
	 * @param obj 
	 * @returns 
	 */
	private onTriggerEnter(obj: mw.GameObject): void {
		if (this.npcState == NPCStateC.Game) return
		if (!GameUtils.isPlayerCharacter(obj)) return
		//寻路npc
		if (this.config.state == 2) {
			Event.dispatchToServer(NPC_Events.NPC_Stop + this.npcGuid);
		}
		this.isInteractive = true;
		P_NPCPanel.Instance.showEvents(this.config, this.npcGuid, this.scrpit.id);
		P_NPCPanel.Instance.setGoodWill()
		this.setGuide()
		const loc = (obj as mw.Character).worldTransform.position.clone().subtract(this.originPos)
		this.turn(loc);
	}

	/**
	 * 离开触发器
	 * @param obj 
	 * @returns 
	 */
	private onTriggerExit(obj: mw.GameObject): void {
		if (this.npcState == NPCStateC.Game) return
		if (!GameUtils.isPlayerCharacter(obj)) {
			return;
		}
		//寻路npc
		if (this.config.state == 2) {
			Event.dispatchToServer(NPC_Events.NPC_Start + this.npcGuid);
		}
		this.isInteractive = false;
		P_NPCPanel.Instance.hideEvents();
		this.scrpit.playerLeave?.call();
		this.refNPC();
	}

	private turn(v3: mw.Vector, callBack?: Function) {
		this.npcObj.maxWalkSpeed = 25;
		this.npcObj.rotateRate = 300
		this.npcObj.movementDirection = mw.MovementDirection.AxisDirection;
		this._isTurn = true;

		const rot = setInterval(() => {
			this.npcObj.addMovement(v3);
		}, 10)

		setTimeout(() => {
			clearInterval(rot);
			this.npcObj.maxWalkSpeed = 0;

			this._isTurn = false;
			if (callBack) {
				callBack();
			}
		}, 600)
	}

	/**
	* 刷新NPC
	*/
	private refNPC() {
		const bool = this.npcObj.worldTransform.position.z == this.originPos.z;
		this.npcObj.worldTransform.position = this.originPos.clone();
		if (!bool && this.npcObj.isJumping) {
			this.npcObj.switchToFlying();
			this.npcObj.switchToWalking();
		}
		// 表情的刷新为初始状态
		//(this.npcObj.getAppearance() as mw.HumanoidV2).head.setExpression(mw.ExpressionType.Default)
		const loc = this.originRot.rotateVector(new mw.Vector(100, 0, 0))
		this.turn(loc);
	}

	//============================================================引导==============================================
	private setGuide() {

	}

	//==================================================头顶上显示的对话====================================
	private static myPos: mw.Vector
	private static updateTime: number
	private _pos: mw.Vector
	/**根据距离来更新头顶上的随机对话*/
	private updateDis(): void {
		if (this.isInteractive || this.npcState == NPCStateC.Game) return

		if (this.cd > 0) {
			this.cd--;
		}
		if (!NPCClient.myPos || TimeUtil.elapsedTime() > NPCClient.updateTime + 0.2) {
			NPCClient.myPos = this.self.character.worldTransform.position;
			NPCClient.updateTime = TimeUtil.elapsedTime()
		}
		if (!this._pos)
			this._pos = this.npcObj.worldTransform.position
		if (mw.Vector.squaredDistance(this._pos, NPCClient.myPos) <= this.config.distance * this.config.distance && this.cd <= 0) {
			this.showDefalutMessage();
		}
	}

	//头顶随机冒话
	private showDefalutMessage(): void {
		this.cd = this.config.cd;
		let str: string;
		let index = mw.MathUtil.randomInt(0, this.config.text.length);//从对话表里面随机一句话
		str = GameConfig.SquareLanguage.getElement(this.config.text[index]).Value;
		this.showHeadMessage(str)
	}

	/**展示头顶对话 */
	public showHeadMessage(str: string) {
		this.head.showText(str);
	}

	/**刷新任务NPC头顶任务状态 */
	public refreshTaskState(state: TaskSate) {
		this.head.refreshTaskState(state);
	}
}



export enum NPCStateC {
	Day = 1,
	Night = 2,
	Game = 3
}