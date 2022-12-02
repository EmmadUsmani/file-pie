// eslint-disable-next-line @typescript-eslint/no-unused-vars
import adapter from "webrtc-adapter"

import { ReceiveErrorHandler } from "./error"
import { Sender } from "./sender"
import { ReceiveServer } from "./server"
import { UI } from "./ui"

import "@shared/style.css"
import "@shared/loading.css"
import "./style.css"
import "@shared/logo.svg"

ReceiveErrorHandler.init()
UI.init()
ReceiveServer.init()
Sender.init()
