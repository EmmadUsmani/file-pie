import { RoomCreatedData, ServerEvent } from "@webrtc-file-transfer/shared"

import { Rooms } from "../../rooms" // TODO (refactor): configure baseUrl
import { ExtendedSocket } from "../../types"

export function registerSenderHandlers(socket: ExtendedSocket) {
  socket.on(ServerEvent.CreateRoom, () => {
    try {
      const roomID = Rooms.createRoom(socket)

      // emit response event to sender
      const resData: RoomCreatedData = { roomID }
      socket.emit(ServerEvent.RoomCreated, resData)
    } catch (error) {
      console.error(error)
    }
  })

  socket.on("disconnect", () => {
    try {
      const roomID = socket.roomID

      // notify all receivers
      socket.to(roomID).emit(ServerEvent.SenderLeft)

      Rooms.senderLeave(socket)
    } catch (error) {
      console.error(error)
    }
  })
}
