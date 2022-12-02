import { Server } from "socket.io"

import { Client } from "@server/client"

import { registerReceiverHandlers } from "./receiver"
import { registerSenderHandlers } from "./sender"

export function registerHandlers(io: Server) {
  io.on("connection", (socket) => {
    const client = new Client(socket)
    registerSenderHandlers(client)
    registerReceiverHandlers(client)
  })
}
