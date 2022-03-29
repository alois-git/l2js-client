import GameClientPacket from "./GameClientPacket";

export default class AutoAttackStart extends GameClientPacket {
  targetObjId: number;
  // @Override
  readImpl(): boolean {
    this.targetObjId = this.readD();

    return true;
  }
}
