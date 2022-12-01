// eslint-disable-next-line @typescript-eslint/no-unused-vars
import adapter from "webrtc-adapter"

import { ErrorHandler, ClientLogger } from "@shared/."

import { SendServer } from "./server"
import { UI } from "./ui"

import "@shared/style.css"
import "@shared/loading.css"
import "./style.css"
import "@shared/logo.svg"

ClientLogger.init({ showDebugLogs: process.env.NODE_ENV === "development" })
ErrorHandler.init()
UI.init()
SendServer.init()
