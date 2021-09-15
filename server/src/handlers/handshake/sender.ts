import {
  Room,
  RoomCreatedData,
  RoomID,
  ServerEvent,
} from "@webrtc-file-transfer/shared"
import { Socket } from "socket.io"

import { generateRoomID } from "../../utils" // TODO: configure baseUrl

const rooms: { [key: RoomID]: Room } = {} // TODO: make rooms shared state (class)

export function registerSenderHandlers(socket: Socket) {
  socket.on(ServerEvent.CreateRoom, () => {
    // create room
    const roomID = generateRoomID()
    rooms[roomID] = { roomID, sender: socket.id, receivers: [] }
    // TODO: add roomID to socket instance

    // send to client
    const resData: RoomCreatedData = { roomID }
    socket.emit(ServerEvent.RoomCreated, resData)
  })
}
