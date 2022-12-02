import { registerHandlers } from "@server/handlers"
import { httpServer, io } from "@server/init"

registerHandlers(io)

const port = process.env.PORT ? +process.env.PORT : 3000
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
