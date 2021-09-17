import { RoomID } from "@webrtc-file-transfer/shared"
import { Socket } from "socket.io"

export interface ExtendedSocket extends Socket {
  roomID: RoomID
  clientType: "sender" | "receiver" | undefined
}
