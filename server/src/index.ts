import { createServer } from "http"
import * as path from "path"

import express from "express"
import { Server } from "socket.io"

import { registerHandlers } from "./handlers"

const app = express()
const httpServer = createServer(app)

// serve client in prod
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "..", "..", "client", "build")
  app.use(express.static(buildPath))
  app.get("/", (_, res) => {
    res.sendFile(path.join(buildPath, "index.html"))
  })
  app.get("/download", (_, res) => {
    res.sendFile(path.join(buildPath, "download.html"))
  })
}

const io = new Server(
  httpServer,
  process.env.NODE_ENV === "development" // allow cors in dev
    ? {
        cors: {
          origin: "http://localhost:8080",
          methods: ["GET", "POST"],
        },
      }
    : {}
)

registerHandlers(io)

const port = process.env.PORT ? +process.env.PORT : 3000

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
