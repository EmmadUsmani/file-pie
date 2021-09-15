import { ServerEvent } from "@webrtc-file-transfer/shared"
import { io } from "socket.io-client"

type ServerEventListener = (data: any) => void // TODO: fix any

export class Server {
  static socket = io("/")

  static listen(event: ServerEvent, listener: ServerEventListener) {
    this.socket.on(event, listener)
  }

  static removeListener(event: ServerEvent, listener: ServerEventListener) {
    this.socket.off(event, listener)
  }
}

export class ListenerGroup {
  listeners: Array<[ServerEvent, ServerEventListener]> = []

  listen(event: ServerEvent, listener: ServerEventListener) {
    Server.listen(event, listener)
    this.listeners.push([event, listener])
  }

  removeListeners() {
    for (const [event, listener] of this.listeners) {
      Server.removeListener(event, listener)
    }
  }
}
