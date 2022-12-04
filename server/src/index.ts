import { Logger } from "@file-pie/shared"

import { registerHandlers } from "@server/handlers"
import { httpServer, io } from "@server/init"

Logger.init({ showDebugLogs: process.env.NODE_ENV === "development" })
registerHandlers(io)

const port = process.env.PORT ? +process.env.PORT : 3000
httpServer.listen(port, () => {
  Logger.log(`Server started on port ${port}`)
})
