import { GameConfig } from "./config/GameConfig";
import { GlobalData } from "./const/GlobalData";
import { setMyCharacterGuid, setMyPlayerID } from "./ExtensionType";
import { LogManager } from "./LogManager";
import { ActionModuleClient } from "./modules/action/ActionModuleClient";
import { ActionModuleServer } from "./modules/action/ActionModuleServer";
import { BagModuleDataHelper } from "./modules/bag/BagDataHelper";
import { BagModuleC } from "./modules/bag/BagModuleC";
import { BagModuleS } from "./modules/bag/BagModuleS";
import { CameraModuleC, CameraModuleS } from "./modules/camera/CameraModule";
import { Chat_Client, Chat_Server } from "./modules/chat/Chat";
import { GameModuleData } from "./modules/gameModule/GameData";
import { GameModuleC } from "./modules/gameModule/GameModuleC";
import { GameModuleS } from "./modules/gameModule/GameModuleS";
import { InteractModuleClient } from "./modules/interactModule/InteractModuleClient";
import { InteractModuleServer } from "./modules/interactModule/InteractModuleServer";
import { NPCDataHelper } from "./modules/npc/NPCData";
import NPCModule_C from "./modules/npc/NPCModule_C";
import NPCModule_S from "./modules/npc/NPCModule_S";
import PetModuleC from "./modules/pets/PetModuleC";
import PetModuleS from "./modules/pets/PetModuleS";
import PlayerModuleClient from "./modules/player/PlayerModuleClient";
import PlayerModuleServer from "./modules/player/PlayerModuleServer";
import { PropModuleC } from "./modules/prop/PropModuleC";
import { PropModuleS } from "./modules/prop/PropModuleS";
import SkillModule_Client from "./modules/skill/SkillModule_Client";
import SkillModule_Server from "./modules/skill/SkillModule_Server";
import GameUtils from "./utils/GameUtils";
import { ComponentModuleS } from "./modules/component/ComponentModuleS";
import { ComponentModuleC } from "./modules/component/ComponentModuleC";
import RelationModuleC from "./modules/relation/RelationModuleC";
import RelationModuleS from "./modules/relation/RelationModuleS";
import RelationData from "./modules/relation/RelationData";
import TaskModuleS from "./modules/task/TaskModuleS";
import TaskModuleC from "./modules/task/TaskModuleC";
import TaskData from "./modules/task/TaskData";
import BuildingModuleS from "./modules/building/BuildingModuleS";
import BuildingModuleC from "./modules/building/BuildingModuleC";
import BuildingData from "./modules/building/BuildingData";
import SkyModuleC from "./modules/sky/SkyModuleC";
import SkyModuleS from "./modules/sky/SkyModuleS";
import { UserModuleC } from "./modules/user/UserModuleC";
import { UserModuleS } from "./modules/user/UserModuleS";
import { UserData } from "./modules/user/UserData";
import { UserMgr } from "./modules/user/UserMgr";
import StationModuleS from "./modules/station/StationModuleS";
import StationModuleC from "./modules/station/StationModuleC";
import { HomeDressModuleS } from "./modules/home/dress/HomeDressModuleS";
import { HomeDressModuleC } from "./modules/home/dress/HomeDressModuleC";
import { HomeDressData } from "./modules/home/dress/HomeDressData";

@Component
class GameStart extends mw.Script {
	//预加载的资源guid
	@mw.Property()
	private isOnline: boolean = false;
	@mw.Property({ displayName: "是否本地背包" })
	private isLocalBag = false;
	@mw.Property({ displayName: "是否打开GM" })
	private isOpenGM = false;
	@mw.Property({ displayName: "是否打开日志" })
	private isOpenLog = false;

	@mw.Property({ displayName: "多语言", selectOptions: { default: "-1", en: "0", zh: "1" } })
	private language: string = "-1";
	private assetsInit() {
		let arr = [];
		GameConfig.Assets.getAllElement().forEach(asset => {
			let guid = asset.Guid;
			let preload = asset.Type == 5 || asset.PreLoad;
			if (guid && preload && !arr.includes(guid)) {
				arr.push(guid);
			}
		});
		let str = arr.join(",");
		console.log("游戏启动: ", str);
	}

	public onStart(): void {
		super.onStart();
		this.isOnline && LogManager.instance.setLogLevel(2);
		DataStorage.setTemporaryStorage(!this.isOnline);
		GameUtils.systemLanguageIndex = Number(this.language);
		// if (GameUtils.systemLanguageIndex == -1) {
		// 	GameUtils.systemLanguageIndex = this.getSystemLanguageIndex();
		// }
		if (SystemUtil.isClient()) {
			//初始化表格语言
			GameConfig.initLanguage(GameUtils.systemLanguageIndex, key => {
				let ele = GameConfig.SquareLanguage.getElement(key);
				if (ele == null) return "unknow_" + key;
				return ele.Value;
			});

			mw.UIScript.addBehavior("lan", (ui: mw.StaleButton | mw.TextBlock) => {
				let key: string = ui.text;
				if (key) {
					let data = GameUtils.getLanguage(key);
					if (data) {
						ui.text = data.info;
						if (data.size > 0) {
							ui.fontSize = data.size;
						}
					}
				}
			});
			Player.asyncGetLocalPlayer().then((player) => {
				setMyPlayerID(player.playerId);
				setMyCharacterGuid(player.character.gameObjectId);
			});
		}
		UserMgr.Inst.init();
		GlobalData.isLocalBag = this.isLocalBag;
		GlobalData.isOpenGM = this.isOpenGM;
		GlobalData.globalPos = this.gameObject.worldTransform.position;
		this.useUpdate = true;
		this.onRegisterModule();
	}
	onUpdate(dt: number): void {
		super.onUpdate(dt);
		TweenUtil.TWEEN.update();
	}
	//获取系统语言索引
	private getSystemLanguageIndex(): number {
		let language = mw.LocaleUtil.getDefaultLocale().toString().toLowerCase();
		if (!!language.match("en")) {
			return 0;
		}
		if (!!language.match("zh")) {
			return 1;
		}
		if (!!language.match("ja")) {
			return 2;
		}
		if (!!language.match("de")) {
			return 3;
		}
		return 0;
	}
	//当注册模块
	onRegisterModule(): void {
		// //注册模块
		ModuleService.registerModule(PlayerModuleServer, PlayerModuleClient, null); //整体角色管理
		ModuleService.registerModule(GameModuleS, GameModuleC, GameModuleData); //负责大厅的一些UI点击
		ModuleService.registerModule(BagModuleS, BagModuleC, BagModuleDataHelper); //背包 和广场那边一样
		ModuleService.registerModule(Chat_Server, Chat_Client, null); //开放广场中的emjio 和快捷聊天
		ModuleService.registerModule(ActionModuleServer, ActionModuleClient, null); //做动作
		ModuleService.registerModule(CameraModuleS, CameraModuleC, null); //拍照 相机视角切换
		ModuleService.registerModule(PropModuleS, PropModuleC, null); //背包中那些道具的使用
		ModuleService.registerModule(NPCModule_S, NPCModule_C, NPCDataHelper);
		ModuleService.registerModule(InteractModuleServer, InteractModuleClient, null);
		ModuleService.registerModule(ComponentModuleS, ComponentModuleC, null);
		ModuleService.registerModule(SkillModule_Server, SkillModule_Client, null);
		ModuleService.registerModule(PetModuleS, PetModuleC, null);
		ModuleService.registerModule(RelationModuleS, RelationModuleC, RelationData);
		ModuleService.registerModule(TaskModuleS, TaskModuleC, TaskData);
		ModuleService.registerModule(BuildingModuleS, BuildingModuleC, BuildingData);
		ModuleService.registerModule(HomeDressModuleS, HomeDressModuleC, HomeDressData);
		ModuleService.registerModule(SkyModuleS, SkyModuleC, null);
		ModuleService.registerModule(StationModuleS, StationModuleC, null);
	}
}
export default GameStart;
