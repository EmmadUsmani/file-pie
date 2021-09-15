import { Socket } from "socket.io"

import { registerSenderHandlers } from "./sender"

export function registerHandshakeHandlers(socket: Socket) {
  registerSenderHandlers(socket)
}
