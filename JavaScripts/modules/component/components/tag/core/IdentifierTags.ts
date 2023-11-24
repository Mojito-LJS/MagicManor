import { BaseTagCls } from "./BaseTagCls";
import { tagI } from "./TagsManager";

/**
 * 身份标签
 */
export module IdentifierTags {
	/**
	 * 投掷物拥有此标签
	 */
	@tagI()
	export class Projectile extends BaseTagCls {
		/**
		 * 玩家创建的投掷物
		 */
		public static Player: string = '';

		/**
		 * 玩家创建的投掷物
		 */
		public static Monster: string = '';
	}

	@tagI()
	export class CheckBox extends BaseTagCls {
		/**
		 * 玩家创建的
		 */
		public static Player: string = '';

		/**
		 * 玩家创建的
		 */
		public static Monster: string = '';
	}

	/**
	 * 怪物拥有此标签
	 */
	@tagI("Monster")
	export class Monster extends BaseTagCls {
		/**
		 * 假人
		 */
		public static Dummy: string = '';
		/**
		 * 普通小怪
		 */
		public static Normal: string = '';

		public static NightNormal: string = '';

		/**
		 * 精英怪
		 */
		public static Elite: string = '';

		/**
		 * boss
		 */
		public static Boss: string = '';

		/**
		 * 可攻击的交互物
		 */
		public static Interactive: string = '';
	}

	@tagI()
	export class Player extends BaseTagCls {
		/**
		 * 玩家标签
		 */
		public static Character: string = '';

		/**
		 * 召唤物
		 */
		public static Summoned: string = '';
	}

	@tagI()
	export class InteractiveObject extends BaseTagCls {
		/**
		 * 可攻击的
		 */
		public static Atk: string = '';
	}

	/**战斗模式 */
	@tagI()
	export class FightMod extends BaseTagCls {
		public static PVP: string = '';
		public static PVE: string = '';
	}
	/**战斗模式 */
	@tagI("state")
	export class State extends BaseTagCls {
		/**战斗中 */
		public static Fighting: string = '';
	}
}
