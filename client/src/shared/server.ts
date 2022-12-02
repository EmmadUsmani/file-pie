import { ServerEvent } from "@webrtc-file-transfer/shared"
import { io } from "socket.io-client"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ServerEventListener = (data: any) => void | Promise<void>

/**
 * Singleton managing WebSocket connection to backend server. Is
 * extended to provide methods to send client-specific messages.
 */
export class Server {
  static socket = io("/")

  static listen(event: ServerEvent, listener: ServerEventListener) {
    this.socket.on(event, listener)
  }

  static removeListener(event: ServerEvent, listener: ServerEventListener) {
    this.socket.off(event, listener)
  }
}
