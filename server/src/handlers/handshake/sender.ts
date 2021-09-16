import { RoomCreatedData, ServerEvent } from "@webrtc-file-transfer/shared"
import { Socket } from "socket.io"

import { Rooms } from "../../rooms" // TODO (refactor): configure baseUrl
import { ExtendedSocket } from "../../types"

export function registerSenderHandlers(socket: ExtendedSocket) {
  socket.on(ServerEvent.CreateRoom, () => {
    const roomID = Rooms.createRoom(socket)

    // emit response event to sender
    const resData: RoomCreatedData = { roomID }
    socket.emit(ServerEvent.RoomCreated, resData)
  })
}
