import { Socket } from "socket.io"

import { ExtendedSocket } from "../../types"

import { registerReceiverHandlers } from "./receiver"
import { registerSenderHandlers } from "./sender"

export function registerHandshakeHandlers(socket: ExtendedSocket) {
  registerSenderHandlers(socket)
  registerReceiverHandlers(socket)
}
