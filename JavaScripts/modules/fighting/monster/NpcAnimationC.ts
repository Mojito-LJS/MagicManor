import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
import { getNetWorkC, regNetworkC } from "../../component/base/NetworkManager";

@regNetworkC()
class NpcAnimationC {
	async playAnimation(guid: string, animationId: string) {
		let npc = GameObject.findGameObjectById(guid) as mw.Character;
		if (!npc) {
			npc = (await GameObject.asyncFindGameObjectById(guid)) as mw.Character;
		}
		// PlayerManagerExtesion.loadAnimationExtesion(npc, animation, false).play();
		let animation = PlayerManagerExtesion.loadAnimationExtesion(npc, animationId, SystemUtil.isServer());
		if (animation) {
			animation.loop = 1;
			animation.play();
		}
	}
}
export const npcAnimationC = getNetWorkC(NpcAnimationC);
