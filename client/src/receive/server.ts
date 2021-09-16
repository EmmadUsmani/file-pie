import { JoinRoomData, RoomID, ServerEvent } from "@webrtc-file-transfer/shared"

import { Server } from "../shared"

export class ReceiveServer extends Server {
  static joinRoom(roomID: RoomID) {
    console.log("ReceiveServer.joinRoom")
    const data: JoinRoomData = { roomID }
    this.socket.emit(ServerEvent.JoinRoom, data)
  }
}
