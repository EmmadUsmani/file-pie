import { Server } from "socket.io"

import { Client } from "@server/client"

import { registerReceiverHandlers } from "./receiver"
import { registerSenderHandlers } from "./sender"

/**
 * Converts socket instance from Socket.io into internal Client
 * wrapper and regsiters handlers for all events.
 *
 * @param io - socket.io Server instance
 */
export function registerHandlers(io: Server): void {
  io.on("connection", (socket) => {
    const client = new Client(socket)
    registerSenderHandlers(client)
    registerReceiverHandlers(client)
  })
}
