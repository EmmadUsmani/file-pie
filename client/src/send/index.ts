import {
  AnswerSentData,
  IceCandidateSentFromReceiverData,
  ReceiverJoinedData,
  ReceiverLeftData,
  RoomCreatedData,
  ServerEvent,
} from "@webrtc-file-transfer/shared"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import adapter from "webrtc-adapter"

import { ErrorHandler, ClientLogger } from "@shared/."

import { Receivers } from "./receiver"
import { SendServer } from "./server"
import { UI } from "./ui"

import "@shared/style.css"
import "@shared/loading.css"
import "./style.css"
import "@shared/logo.svg"

ClientLogger.init({ showDebugLogs: process.env.NODE_ENV === "development" })
ErrorHandler.init()
UI.init()

// TODO: consider creating a separate listeners class and initializing them there
SendServer.listen(ServerEvent.RoomCreated, (data: RoomCreatedData) => {
  const { roomID } = data
  UI.setRoomID(roomID)

  ClientLogger.debug(
    "received RoomCreated event from server",
    `roomID: ${roomID}`
  )
})

SendServer.listen(ServerEvent.ReceiverJoined, (data: ReceiverJoinedData) => {
  const { receiverID } = data
  Receivers.addReceiver(receiverID)
  UI.updateReceivers() // TODO: maybe put this in the .addReceiver method, since that file already uses UI

  ClientLogger.debug(
    `received ReceiverJoined event from server`,
    `receiverID: ${receiverID}`
  )
})

SendServer.listen(ServerEvent.ReceiverLeft, (data: ReceiverLeftData) => {
  const { receiverID } = data
  Receivers.removeReceiver(receiverID)
  UI.updateReceivers() // TODO: maybe put this in the .addReceiver method, since that file already uses UI

  ClientLogger.debug(
    "received ReceiverLeft event from server",
    `receiverID: ${receiverID}`
  )
})

SendServer.listen(ServerEvent.AnswerSent, (data: AnswerSentData) => {
  const { answer, receiverID } = data

  const receiver = Receivers.getReceiver(receiverID)
  receiver.acceptAnswer(answer)

  ClientLogger.debug(
    "received AnswerSent event from server",
    `receiverID: ${receiverID}`,
    `answer.sdp: ${answer.sdp ?? ""}`,
    `answer.type: ${answer.type}`
  )
})

SendServer.listen(
  ServerEvent.IceCandidateSentFromReceiver,
  (data: IceCandidateSentFromReceiverData) => {
    const { iceCandidate, receiverID } = data

    const receiver = Receivers.getReceiver(receiverID)
    receiver.addIceCandidate(iceCandidate)

    ClientLogger.debug(
      "received IceCandidateSentFromReceiver event from server",
      `receiverID: ${receiverID}`,
      `iceCandidate: ${JSON.stringify(iceCandidate)}`
    )
  }
)
