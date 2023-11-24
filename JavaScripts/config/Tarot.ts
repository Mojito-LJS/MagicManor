import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","TarotName","Copywriting","Horoscope","LuckColor","CardGuid"],["","","","","",""],[1,"Prop_04","Prop_35","Prop_66","Prop_97","162551"],[2,"Prop_05","Prop_36","Prop_67","Prop_98","162537"],[3,"Prop_06","Prop_37","Prop_68","Prop_99","162558"],[4,"Prop_07","Prop_38","Prop_69","Prop_100","162535"],[5,"Prop_08","Prop_39","Prop_70","Prop_101","162531"],[6,"Prop_09","Prop_40","Prop_71","Prop_102","162544"],[7,"Prop_10","Prop_41","Prop_72","Prop_103","162539"],[8,"Prop_11","Prop_42","Prop_73","Prop_104","162541"],[9,"Prop_12","Prop_43","Prop_74","Prop_105","162545"],[10,"Prop_13","Prop_44","Prop_75","Prop_106","162556"],[11,"Prop_14","Prop_45","Prop_76","Prop_107","162542"],[12,"Prop_15","Prop_46","Prop_77","Prop_108","162533"],[13,"Prop_16","Prop_47","Prop_78","Prop_109","162552"],[14,"Prop_17","Prop_48","Prop_79","Prop_110","162532"],[15,"Prop_18","Prop_49","Prop_80","Prop_111","162549"],[16,"Prop_19","Prop_50","Prop_81","Prop_112","162534"],[17,"Prop_20","Prop_51","Prop_82","Prop_113","162557"],[18,"Prop_21","Prop_52","Prop_83","Prop_114","162554"],[19,"Prop_22","Prop_53","Prop_84","Prop_115","162538"],[20,"Prop_23","Prop_54","Prop_85","Prop_116","162529"],[21,"Prop_24","Prop_55","Prop_86","Prop_117","162778"],[22,"Prop_25","Prop_56","Prop_87","Prop_118","162528"],[23,"Prop_26","Prop_57","Prop_88","Prop_119","162546"],[24,"Prop_27","Prop_58","Prop_89","Prop_120","162555"],[25,"Prop_28","Prop_59","Prop_90","Prop_121","162530"],[26,"Prop_29","Prop_60","Prop_91","Prop_122","162550"],[27,"Prop_30","Prop_61","Prop_92","Prop_123","162547"],[28,"Prop_31","Prop_62","Prop_93","Prop_124","162553"],[29,"Prop_32","Prop_63","Prop_94","Prop_125","162536"],[30,"Prop_33","Prop_64","Prop_95","Prop_126","162548"],[31,"Prop_34","Prop_65","Prop_96","Prop_127","162540"]];
export interface ITarotElement extends IElementBase{
 	/**唯一ID*/
	ID:number
	/**名字*/
	TarotName:string
	/**牌面文案*/
	Copywriting:string
	/**运势文案*/
	Horoscope:string
	/**幸运色*/
	LuckColor:string
	/**卡片guid*/
	CardGuid:string
 } 
export class TarotConfig extends ConfigBase<ITarotElement>{
	constructor(){
		super(EXCELDATA);
	}

}