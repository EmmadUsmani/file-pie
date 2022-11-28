import { ExtendedSocket } from "@server/types"
import { Server } from "socket.io"

import { registerHandshakeHandlers } from "./handshake"

export function registerHandlers(io: Server) {
  io.on("connection", (socket) => {
    registerHandshakeHandlers(socket as ExtendedSocket)
  })
}
