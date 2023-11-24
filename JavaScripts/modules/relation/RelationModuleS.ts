import { GeneralManager, } from '../../Modified027Editor/ModifiedStaticAPI';
import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';
import RelationData, { ContractType } from "./RelationData";
import RelationModuleC, { ResponseType } from "./RelationModuleC";


export default class RelationModuleS extends ModuleS<RelationModuleC, RelationData>{
    protected onStart(): void {

    }

    public net_SendInvite(contractType: ContractType, invitee: number, userID: string, self: string, other: string) {
        this.getClient(invitee).net_OnInvited(contractType, this.currentPlayerId, userID, other, self);
    }

    public net_ResponseInvite(contractType: ContractType, inviter: number, userID: string, openId: string, type: ResponseType) {
        this.getClient(inviter).net_OnResponse(contractType, this.currentPlayerId, userID, openId, type);
        if (type === ResponseType.Accept) {
            const self = this.currentPlayer;
            const other = Player.getPlayer(inviter);
            if (self.character) {
                GeneralManager.rpcPlayEffectOnPlayer("27396", self, mw.HumanoidSlotType.BackOrnamental, 1, mw.Vector.zero, mw.Rotation.zero, new mw.Vector(0.2, 0.2, 0.2))
                const anim = PlayerManagerExtesion.loadAnimationExtesion(self.character, "123720", true)
                anim.loop = 1;
                anim.play()
            }
            if (other.character) {
                GeneralManager.rpcPlayEffectOnPlayer("27396", other, mw.HumanoidSlotType.BackOrnamental, 1, mw.Vector.zero, mw.Rotation.zero, new mw.Vector(0.2, 0.2, 0.2))
                const anim = PlayerManagerExtesion.loadAnimationExtesion(other.character, "123720", true)
                anim.loop = 1;
                anim.play()
            }
        }
    }

    public net_BuildRelationship(type: ContractType, id: string, name: string, designation: string) {
        const player = this.currentPlayer;
        this.getPlayerData(player).buildRelationship(type, id, name, designation);
    }

    public net_ReleaseRelationship(type: ContractType) {
        const player = this.currentPlayer;
        this.getPlayerData(player).releaseRelationship(type);
    }
}