import * as path from "path"

import express from "express"

const app = express()

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

const port = process.env.PORT ? +process.env.PORT : 3000

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
