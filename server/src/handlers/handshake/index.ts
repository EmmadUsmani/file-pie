import { Socket } from "socket.io"

import { registerReceiverHandlers } from "./receiver"
import { registerSenderHandlers } from "./sender"

export function registerHandshakeHandlers(socket: Socket) {
  registerSenderHandlers(socket)
  registerReceiverHandlers(socket)
}
