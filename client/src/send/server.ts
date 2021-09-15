import { ServerEvent } from "@webrtc-file-transfer/shared"

import { Server } from "../shared"

export class SendServer extends Server {
  static createRoom() {
    this.socket.emit(ServerEvent.CreateRoom)
  }
}
