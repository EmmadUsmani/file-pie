import { Server } from "socket.io"

import { Client } from "@server/client"

import { registerHandshakeHandlers } from "./handshake"

export function registerHandlers(io: Server) {
  io.on("connection", (socket) => {
    registerHandshakeHandlers(new Client(socket))
  })
}
