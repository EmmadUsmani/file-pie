import {
  ReceiverJoinedData,
  ReceiverLeftData,
  RoomCreatedData,
  ServerEvent,
} from "@webrtc-file-transfer/shared"

import { Receivers } from "./receiver"
import { SendServer } from "./server"
import { UI } from "./ui"

const fileInputElem = UI.getFileInputElem()
fileInputElem.addEventListener("change", () => {
  if (fileInputElem.files) {
    SendServer.createRoom()
    // TODO: show loader while waiting for RoomCreated event
  }
})

SendServer.listen(ServerEvent.RoomCreated, (data: RoomCreatedData) => {
  const { roomID } = data
  UI.setRoomID(roomID)
})

SendServer.listen(ServerEvent.ReceiverJoined, (data: ReceiverJoinedData) => {
  const { receiverID } = data
  Receivers.addReceiver(receiverID)
  UI.updateReceivers()
})

SendServer.listen(ServerEvent.ReceiverLeft, (data: ReceiverLeftData) => {
  const { receiverID } = data
  Receivers.removeReceiver(receiverID)
  UI.updateReceivers()
})
