import { Client } from "@server/client"

import { registerReceiverHandlers } from "./receiver"
import { registerSenderHandlers } from "./sender"

export function registerHandshakeHandlers(client: Client) {
  registerSenderHandlers(client)
  registerReceiverHandlers(client)
}
