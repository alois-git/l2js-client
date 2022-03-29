import AbstractGameCommand from "./AbstractGameCommand";
import RequestLeaveParty from "../network/outgoing/game/RequestLeaveParty";

export default class CommandLeaveParty extends AbstractGameCommand {
  execute(): void {
    this.GameClient?.sendPacket(new RequestLeaveParty());
  }
}