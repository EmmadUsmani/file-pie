import { ExtendedSocket } from "@server/types"

import { registerReceiverHandlers } from "./receiver"
import { registerSenderHandlers } from "./sender"

export function registerHandshakeHandlers(socket: ExtendedSocket) {
  registerSenderHandlers(socket)
  registerReceiverHandlers(socket)
}
