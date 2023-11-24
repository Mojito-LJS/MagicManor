/**动作配置数据 */
export class ActionBaseCfg {

	/**配置id */
	id: number;
	/**动作类型 */
	type: ActionType;

	name: string;
	/**图标 */
	icon: string;
	/**动作id */
	actionId: string;
	/**单人动作是否为姿态 */
	singleType: number;
	/**双人动作类型 */
	doubleType: ActionDoubleType;
	/**接收者位置偏移 */
	v: mw.Vector;
	/**接收者旋转偏移 */
	r: mw.Vector;
	/**发起者姿态 */
	sendStance: string;
	/**接收者姿态 */
	accectStance: string;
	/**动作播放时间 */
	time: number;
	/**发起者视角偏移 */
	visual1: mw.Vector;
	/**接收者视角偏移 */
	visual2: mw.Vector;
	/**单人动作是否循环 */
	circulate: boolean;
}

/**动作类型 */
export enum ActionType {
	/**单人动作 */
	Single = 1,
	/**双人动作 */
	Double
}

/**双人动作类型 */
export enum ActionDoubleType {
	/**普通动作 */
	Ordinary = 1,
	/**交互动作 */
	Interactive,
	/**强制动作 */
	Force
}