import {
  JoinRoomData,
  ReceiverJoinedData,
  ServerEvent,
} from "@webrtc-file-transfer/shared"
import { Socket } from "socket.io"

import { io } from "../.."
import { Rooms } from "../../rooms"

export function registerReceiverHandlers(socket: Socket) {
  socket.on(ServerEvent.JoinRoom, (data: JoinRoomData) => {
    const { roomID } = data
    Rooms.receiverJoin(socket, roomID)

    // emit response event to sender
    const senderID = Rooms.getSenderID(roomID)
    if (!senderID) {
      return // if room doesn't exist, return
    }
    const resData: ReceiverJoinedData = { receiverID: socket.id }
    io.to(senderID).emit(ServerEvent.ReceiverJoined, resData)
  })
}
