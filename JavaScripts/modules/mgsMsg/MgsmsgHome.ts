import { EventsName } from "../../const/GameEnum";

@Decorator.autoExecute("init")
export abstract class MGSMsgHome {
	private static msgMap: Map<string, MsgClass> = new Map();
	/** 初始化*/
	public static init() {
		if (SystemUtil.isClient()) {
			Event.addServerListener(EventsName.NetMsg_MGSMsg_Send, (eventName: string, eventDesc: string, jsonData: string) => {
				console.warn("统计", eventName, eventDesc, jsonData);
				mw.RoomService.reportLogInfo(eventName, eventDesc, jsonData);
			});
		}
	}

	public static get(eventName: string): MsgClass {
		if (this.msgMap == null) {
			this.msgMap = new Map();
		}
		if (!this.msgMap.has(eventName)) {
			this.msgMap.set(eventName, new MsgClass(eventName));
		}
		return this.msgMap.get(eventName);
	}

	/////////////////////////////////////下面写法比较方便，但每次都会传个新的data体////////////////////////////
	/**
	 * @description: 上传埋点数据
	 * @param {string} key: 事件名
	 * @param {string} des: 事件描述
	 * @param {any} data: 参数域（包含参数名及取值）
	 * @player 在服务端调用时，指定埋点的玩家，如果不写则全房间玩家一起埋
	 * @return {*}
	 */
	public static uploadMGS(key: string, des: string, data: any, player?: mw.Player) {
		const msg = MGSMsgHome.get(key);
		msg.data = data;
		msg.send(des, player);
	}

	/**领取任务打点 */
	public static getTask(id: number) {
		const msg = MGSMsgHome.get("ts_acition_quest_get");
		msg.data = {}
		msg.data.quest_id = id;
		msg.send("领取任务打点");
	}

	/**完成任务打点 */
	public static finishTask(id: number, time: number) {
		const msg = MGSMsgHome.get("ts_task");
		msg.data = {}
		msg.data.taskid = id;
		msg.data.lifetime = time;
		msg.send("完成任务打点");
	}

	/**生成建筑打点 */
	public static createBuild(id: number) {
		const msg = MGSMsgHome.get("ts_acition_quest_end");
		msg.data = {}
		msg.data.quest_id = id;
		msg.send("生成建筑打点");
	}

	/**选择建筑打点 */
	public static selectBuild(id: number) {
		const msg = MGSMsgHome.get("ts_action_build");
		msg.data = {}
		msg.data.model_id = id;
		msg.send("选择建筑打点");
	}

	/**选择天气打点 */
	public static selectWeather(id: number) {
		const msg = MGSMsgHome.get("ts_action_click");
		msg.data = {}
		msg.data.scene_id = id;
		msg.send("选择天气打点");
	}

	/**打开天气界面打点 */
	public static openWeather() {
		const msg = MGSMsgHome.get("ts_action_click");
		msg.data = {}
		msg.data.button = "weatherUI";
		msg.send("打开天气界面打点");
	}

	/**触发返程触发器打点 */
	public static triggerBack() {
		const msg = MGSMsgHome.get("ts_game_result");
		msg.data = {}
		msg.data.record = "platform";
		msg.send("触发返程触发器打点");
	}

	/**返回主游戏打点 */
	public static backMain(time: number) {
		const msg = MGSMsgHome.get("ts_game_result");
		msg.data = {}
		msg.data.record = "gohome";
		msg.data.round_length = time;
		msg.send("返回主游戏打点");
	}

	/**获得家具币打点 */
	public static getHomeMoney(count: number) {
		const msg = MGSMsgHome.get("ts_game_result");
		msg.data = {}
		msg.data.value = count;
		msg.send("获得家具币打点");
	}
	/**购买家具打点 */
	public static buyHomeDress(id: number) {
		const msg = MGSMsgHome.get("ts_action_buy_item");
		msg.data = {}
		msg.data.item_id = id;
		msg.send("购买家具打点");
	}
	/**出售家具打点 */
	public static sellHomeDress(id: number) {
		const msg = MGSMsgHome.get("ts_action_sell");
		msg.data = {}
		msg.data.goods_id = id;
		msg.send("出售家具打点");
	}
	/**家具换色打点 */
	public static changeHomeDressColor(id: number) {
		const msg = MGSMsgHome.get("ts_action_buy_item");
		msg.data = {}
		msg.data.box_id = id;
		msg.send("家具换色打点");
	}

	/**区域停留时长 */
	public static areaStayTime(id: number, time: number) {
		const msg = MGSMsgHome.get("ts_area_leave");
		msg.data = {}
		msg.data.area_id = id;
		msg.data.time = time;
		msg.send("区域停留时长");
	}
}

class MsgClass {
	/**数据体 */
	public data: any;
	public key: string;
	constructor(key: string) {
		this.key = key;
		this.data = {};
	}
	public send(des: string, player?: mw.Player) {
		let jsonData: any = {};
		for (const key in this.data) {
			//潘多拉要求key都要是小写的，value不做要求
			jsonData[key.toLowerCase()] = this.data[key];
		}
		let jsonStr: string = JSON.stringify(jsonData);
		console.warn("统计", this.key, des, jsonStr);
		if (SystemUtil.isClient()) {
			mw.RoomService.reportLogInfo(this.key, des, jsonStr);
		} else {
			if (player == null) {
				Event.dispatchToAllClient(EventsName.NetMsg_MGSMsg_Send, this.key, des, jsonStr);
			} else {
				Event.dispatchToClient(player, EventsName.NetMsg_MGSMsg_Send, this.key, des, jsonStr);
			}
		}
	}
}
