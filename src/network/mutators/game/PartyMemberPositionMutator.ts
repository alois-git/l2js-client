import L2Character from "../../../entities/L2Character";
import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import PartyMemberPosition from "../../incoming/game/PartyMemberPosition";

export default class PartyMemberPositionMutator extends IMMOClientMutator<
  GameClient,
  PartyMemberPosition
> {
  update(packet: PartyMemberPosition): void {
    Object.keys(packet.Members).forEach((k) => {
      const objId: number = parseInt(k, 10);
      const char = this.Client.PartyList.getEntryByObjectId(objId);
      const [_x, _y, _z] = packet.Members[objId];

      if (char) {
        char.setLocation(_x, _y, _z);
        char.calculateDistance(this.Client.ActiveChar);
        this.fire("PartyMemberPosition", { member: char });
      } else {
        const newChar = new L2Character();
        newChar.ObjectId = objId;
        newChar.X = _x;
        newChar.Y = _y;
        newChar.Z = _z;
        this.fire("PartyMemberPosition", { member: newChar });
      }
    });
  }
}
