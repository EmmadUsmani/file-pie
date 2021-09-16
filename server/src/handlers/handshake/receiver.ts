import {
  JoinRoomData,
  ReceiverJoinedData,
  ReceiverLeftData,
  ServerEvent,
} from "@webrtc-file-transfer/shared"

import { io } from "../.."
import { Rooms } from "../../rooms"
import { ExtendedSocket } from "../../types"

export function registerReceiverHandlers(socket: ExtendedSocket) {
  socket.on(ServerEvent.JoinRoom, (data: JoinRoomData) => {
    const { roomID } = data
    Rooms.receiverJoin(socket, roomID)

    // notify sender
    const senderID = Rooms.getSenderID(roomID)
    if (!senderID) {
      return // if room doesn't exist, return
    }
    const resData: ReceiverJoinedData = { receiverID: socket.id }
    io.to(senderID).emit(ServerEvent.ReceiverJoined, resData)
  })

  socket.on("disconnect", () => {
    const roomID = socket.roomID
    Rooms.receiverLeave(socket)

    // notify sender
    const senderID = Rooms.getSenderID(roomID)
    if (!senderID) {
      return // if room doesn't exist, return
    }
    const resData: ReceiverLeftData = { receiverID: socket.id }
    io.to(senderID).emit(ServerEvent.ReceiverLeft, resData)
  })
}
