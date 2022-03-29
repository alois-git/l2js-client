import GameServerPacket from "./GameServerPacket";

export default class RequestLeaveParty extends GameServerPacket {

    constructor() {
        super();
    }

    write(): void {
        this.writeC(0x2b);
    }
}
