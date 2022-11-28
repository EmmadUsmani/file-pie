import {
  AnswerSentData,
  IceCandidateSentFromReceiverData,
  ReceiverJoinedData,
  ReceiverLeftData,
  RoomCreatedData,
  ServerEvent,
} from "@webrtc-file-transfer/shared"

import { ErrorHandler } from "../shared"

import { Receivers } from "./receiver"
import { SendServer } from "./server"
import { UI } from "./ui"

import "../shared/style.css"
import "../shared/loading.css"
import "./style.css"
import "../shared/logo.svg"

ErrorHandler.init()

const buttonElem = UI.getButtonElem()
const fileInputElem = UI.getFileInputElem()

buttonElem.onclick = () => fileInputElem.click()

fileInputElem.addEventListener("change", () => {
  // TODO: better abstraction for storing state (roomID, file)
  if (fileInputElem.files && !UI.getLinkElem().innerText) {
    SendServer.createRoom()
    UI.showLoadingElem()
  }
})

// TODO: consider creating a separate listeners class and initializing them there
SendServer.listen(ServerEvent.RoomCreated, (data: RoomCreatedData) => {
  const { roomID } = data
  UI.setRoomID(roomID)
})

SendServer.listen(ServerEvent.ReceiverJoined, (data: ReceiverJoinedData) => {
  const { receiverID } = data
  Receivers.addReceiver(receiverID)
  UI.updateReceivers() // TODO: maybe put this in the .addReceiver method, since that file already uses UI
})

SendServer.listen(ServerEvent.ReceiverLeft, (data: ReceiverLeftData) => {
  const { receiverID } = data
  Receivers.removeReceiver(receiverID)
  UI.updateReceivers() // TODO: maybe put this in the .addReceiver method, since that file already uses UI
})

SendServer.listen(ServerEvent.AnswerSent, (data: AnswerSentData) => {
  const { answer, receiverID } = data

  const receiver = Receivers.getReceiver(receiverID)
  receiver.acceptAnswer(answer)
})

SendServer.listen(
  ServerEvent.IceCandidateSentFromReceiver,
  (data: IceCandidateSentFromReceiverData) => {
    const { iceCandidate, receiverID } = data

    const receiver = Receivers.getReceiver(receiverID)
    receiver.addIceCandidate(iceCandidate)
  }
)
