import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import { AutoAttackStart } from "../../incoming/game";

export default class AutoAttackStartMutator extends IMMOClientMutator<
  GameClient,
  AutoAttackStart
> {
  update(packet: AutoAttackStart): void {
    this.fire("AutoAttackStart", { targetId: packet.targetObjId });
  }
}