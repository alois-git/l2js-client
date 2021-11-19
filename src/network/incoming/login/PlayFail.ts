import LoginClientPacket from "./LoginClientPacket";
import { PlayFailReason } from "../../../enums/PlayFailReason";

export default class PlayFail extends LoginClientPacket {
  public FailReason!: PlayFailReason;
  // @Override
  readImpl(): boolean {
    const _id: number = this.readC();
    const _reason = this.readC();

    this.FailReason = (PlayFailReason as any)[_reason];

    this.logger.info(this.FailReason);
    return true;
  }
}
