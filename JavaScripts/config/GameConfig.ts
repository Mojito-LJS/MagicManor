import {ConfigBase, IElementBase} from "./ConfigBase";
import {AssetsConfig} from "./Assets";
import {BgmActionConfig} from "./BgmAction";
import {BuildingConfig} from "./Building";
import {CameraConfig} from "./Camera";
import {ChatExpressionConfig} from "./ChatExpression";
import {ChatWordConfig} from "./ChatWord";
import {ClothConfig} from "./Cloth";
import {CreateItemConfig} from "./CreateItem";
import {EffectConfig} from "./Effect";
import {FightAttrConfig} from "./FightAttr";
import {FightBuffConfig} from "./FightBuff";
import {FightMonsterConfig} from "./FightMonster";
import {FilterConfig} from "./Filter";
import {FindConfig} from "./Find";
import {GameJumperConfig} from "./GameJumper";
import {GlobalConfigConfig} from "./GlobalConfig";
import {GlobalConfig} from "./Global";
import {HomeColorConfig} from "./HomeColor";
import {HomeDressConfig} from "./HomeDress";
import {HomeDressTypeConfig} from "./HomeDressType";
import {InteractConfigConfig} from "./InteractConfig";
import {ItemConfig} from "./Item";
import {ModelConfig} from "./Model";
import {MonsterConfig} from "./Monster";
import {MusicConfig} from "./Music";
import {NPCConfigConfig} from "./NPCConfig";
import {NPCTalkConfig} from "./NPCTalk";
import {PetListConfig} from "./PetList";
import {PetTextConfig} from "./PetText";
import {PropActionConfig} from "./PropAction";
import {PropFlyConfig} from "./PropFly";
import {PropPlacementConfig} from "./PropPlacement";
import {SkillLevelConfig} from "./SkillLevel";
import {SkillConfig} from "./Skill";
import {SkyChangeConfig} from "./SkyChange";
import {SquareActionConfigConfig} from "./SquareActionConfig";
import {SquareLanguageConfig} from "./SquareLanguage";
import {TalkEventConfig} from "./TalkEvent";
import {TaskLineConfig} from "./TaskLine";
import {TaskConfig} from "./Task";
import {TitleStyleConfig} from "./TitleStyle";
import {WeatherConfig} from "./Weather";

export class GameConfig{
	private static configMap:Map<string, ConfigBase<IElementBase>> = new Map();
	/**
	* 多语言设置
	* @param languageIndex 语言索引(-1为系统默认语言)
	* @param getLanguageFun 根据key获取语言内容的方法
	*/
	public static initLanguage(languageIndex:number, getLanguageFun:(key:string|number)=>string){
		ConfigBase.initLanguage(languageIndex, getLanguageFun);
		this.configMap.clear();
	}
	public static getConfig<T extends ConfigBase<IElementBase>>(ConfigClass: { new(): T }): T {
		if (!this.configMap.has(ConfigClass.name)) {
			this.configMap.set(ConfigClass.name, new ConfigClass());
		}
		return this.configMap.get(ConfigClass.name) as T;
	}
	public static get Assets():AssetsConfig{ return this.getConfig(AssetsConfig) };
	public static get BgmAction():BgmActionConfig{ return this.getConfig(BgmActionConfig) };
	public static get Building():BuildingConfig{ return this.getConfig(BuildingConfig) };
	public static get Camera():CameraConfig{ return this.getConfig(CameraConfig) };
	public static get ChatExpression():ChatExpressionConfig{ return this.getConfig(ChatExpressionConfig) };
	public static get ChatWord():ChatWordConfig{ return this.getConfig(ChatWordConfig) };
	public static get Cloth():ClothConfig{ return this.getConfig(ClothConfig) };
	public static get CreateItem():CreateItemConfig{ return this.getConfig(CreateItemConfig) };
	public static get Effect():EffectConfig{ return this.getConfig(EffectConfig) };
	public static get FightAttr():FightAttrConfig{ return this.getConfig(FightAttrConfig) };
	public static get FightBuff():FightBuffConfig{ return this.getConfig(FightBuffConfig) };
	public static get FightMonster():FightMonsterConfig{ return this.getConfig(FightMonsterConfig) };
	public static get Filter():FilterConfig{ return this.getConfig(FilterConfig) };
	public static get Find():FindConfig{ return this.getConfig(FindConfig) };
	public static get GameJumper():GameJumperConfig{ return this.getConfig(GameJumperConfig) };
	public static get GlobalConfig():GlobalConfigConfig{ return this.getConfig(GlobalConfigConfig) };
	public static get Global():GlobalConfig{ return this.getConfig(GlobalConfig) };
	public static get HomeColor():HomeColorConfig{ return this.getConfig(HomeColorConfig) };
	public static get HomeDress():HomeDressConfig{ return this.getConfig(HomeDressConfig) };
	public static get HomeDressType():HomeDressTypeConfig{ return this.getConfig(HomeDressTypeConfig) };
	public static get InteractConfig():InteractConfigConfig{ return this.getConfig(InteractConfigConfig) };
	public static get Item():ItemConfig{ return this.getConfig(ItemConfig) };
	public static get Model():ModelConfig{ return this.getConfig(ModelConfig) };
	public static get Monster():MonsterConfig{ return this.getConfig(MonsterConfig) };
	public static get Music():MusicConfig{ return this.getConfig(MusicConfig) };
	public static get NPCConfig():NPCConfigConfig{ return this.getConfig(NPCConfigConfig) };
	public static get NPCTalk():NPCTalkConfig{ return this.getConfig(NPCTalkConfig) };
	public static get PetList():PetListConfig{ return this.getConfig(PetListConfig) };
	public static get PetText():PetTextConfig{ return this.getConfig(PetTextConfig) };
	public static get PropAction():PropActionConfig{ return this.getConfig(PropActionConfig) };
	public static get PropFly():PropFlyConfig{ return this.getConfig(PropFlyConfig) };
	public static get PropPlacement():PropPlacementConfig{ return this.getConfig(PropPlacementConfig) };
	public static get SkillLevel():SkillLevelConfig{ return this.getConfig(SkillLevelConfig) };
	public static get Skill():SkillConfig{ return this.getConfig(SkillConfig) };
	public static get SkyChange():SkyChangeConfig{ return this.getConfig(SkyChangeConfig) };
	public static get SquareActionConfig():SquareActionConfigConfig{ return this.getConfig(SquareActionConfigConfig) };
	public static get SquareLanguage():SquareLanguageConfig{ return this.getConfig(SquareLanguageConfig) };
	public static get TalkEvent():TalkEventConfig{ return this.getConfig(TalkEventConfig) };
	public static get TaskLine():TaskLineConfig{ return this.getConfig(TaskLineConfig) };
	public static get Task():TaskConfig{ return this.getConfig(TaskConfig) };
	public static get TitleStyle():TitleStyleConfig{ return this.getConfig(TitleStyleConfig) };
	public static get Weather():WeatherConfig{ return this.getConfig(WeatherConfig) };
}