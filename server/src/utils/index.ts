import { RoomID, ServerEvent } from "@webrtc-file-transfer/shared"
import { v4 as uuidV4 } from "uuid"

import { ExtendedSocket } from "../types"

export function generateRoomID(): RoomID {
  return uuidV4()
}

export function registerHandler(
  socket: ExtendedSocket,
  event: ServerEvent | string,
  handler: (data?: any) => void
) {
  socket.on(event, (data) => {
    try {
      handler(data)
    } catch (error) {
      console.log(error)
    }
  })
}
