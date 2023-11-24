import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';
/*
 * @Author: YuKun.Gao
 * @Date: 2023-05-26 10:04:42
 * @LastEditors: YuKun.Gao
 * @LastEditTime: 2023-05-26 15:26:22
 * @Description: file content
 * @FilePath: \catcompanion\JavaScripts\modules\home\ItemTrigger.ts
 */
import { Martial } from "./dress/place/Martial";

@Component
export default class ItemTrigger extends mw.Script {
	@mw.Property({ displayName: "地板材质索引Id" })
	public floorMartialIndex: number = 0;

	@mw.Property({ displayName: "墙面材质索引Id" })
	public metopeMartialIndex: number = 0;

	@mw.Property({ displayName: "天花板材质索引Id" })
	public ceilingMartialIndex: number = 0;

	/** 当脚本被实例后，会在第一帧更新前调用此函数 */
	protected onStart(): void {
		const handle = setInterval(() => {
			if (this.gameObject) {
				clearInterval(handle);
			} else {
				return;
			}

			const trigger = this.gameObject as mw.Trigger;
			trigger.onEnter.add((go: mw.GameObject) => {
				if (PlayerManagerExtesion.isCharacter(go)) {
					logI("玩家 : " + go.player.playerId + " 进入");
					Martial.Instance.setMartialIndex(this.floorMartialIndex, this.metopeMartialIndex, this.ceilingMartialIndex);
				}
			});
		}, 100);
	}

	/**
	 * 周期函数 每帧执行
	 * 此函数执行需要将this.useUpdate赋值为true
	 * @param dt 当前帧与上一帧的延迟 / 秒
	 */
	protected onUpdate(dt: number): void { }

	/** 脚本被销毁时最后一帧执行完调用此函数 */
	protected onDestroy(): void { }
}
