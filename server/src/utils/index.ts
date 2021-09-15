import { RoomID } from "@webrtc-file-transfer/shared"
import { v4 as uuidV4 } from "uuid"

export function generateRoomID(): RoomID {
  return uuidV4()
}
