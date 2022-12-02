import { createServer } from "http"
import * as path from "path"

import express from "express"
import { Server } from "socket.io"

const app = express()
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "..", "..", "client", "build")
  app.use(express.static(buildPath))
}

export const httpServer = createServer(app)

export const io = new Server(
  httpServer,
  process.env.NODE_ENV === "development"
    ? {
        cors: {
          origin: "http://localhost:8080",
          methods: ["GET", "POST"],
        },
      }
    : {}
)
