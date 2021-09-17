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
    try {
      const { roomID } = data
      try {
        Rooms.receiverJoin(socket, roomID)
      } catch {
        // Room not found, notify receiver
        socket.emit(ServerEvent.RoomNotFound)
        return
      }

      // notify receiver
      socket.emit(ServerEvent.RoomJoined)

      // notify sender
      const senderID = Rooms.getSenderID(roomID)
      const resData: ReceiverJoinedData = { receiverID: socket.id }
      io.to(senderID).emit(ServerEvent.ReceiverJoined, resData)
    } catch (error) {
      console.error(error)
    }
  })

  socket.on("disconnect", () => {
    try {
      const roomID = socket.roomID
      Rooms.receiverLeave(socket)

      // notify sender
      const senderID = Rooms.getSenderID(roomID)
      if (!senderID) {
        return // TODO: better error handling here
      }
      const resData: ReceiverLeftData = { receiverID: socket.id }
      io.to(senderID).emit(ServerEvent.ReceiverLeft, resData)
    } catch (error) {
      console.error(error)
    }
  })
}
