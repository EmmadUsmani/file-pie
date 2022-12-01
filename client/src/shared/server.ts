import { ServerEvent } from "@webrtc-file-transfer/shared"
import { io } from "socket.io-client"

type ServerEventListener = (data: any) => void | Promise<void> // TODO: fix any

export class Server {
  static socket = io("/")

  static listen(event: ServerEvent, listener: ServerEventListener) {
    this.socket.on(event, listener)
  }

  static removeListener(event: ServerEvent, listener: ServerEventListener) {
    this.socket.off(event, listener)
  }
}
