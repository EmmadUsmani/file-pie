import {
  ReceiverJoinedData,
  RoomCreatedData,
  ServerEvent,
} from "@webrtc-file-transfer/shared"

import { Receiver } from "./receiver"
import { SendServer } from "./server"

const fileInput = document.querySelector<HTMLInputElement>("input#fileInput")
const paragraph = document.querySelector<HTMLParagraphElement>("p#roomID")
const h1 = document.querySelector<HTMLHeadingElement>("h1#receivers")
fileInput?.addEventListener("change", handleFileInputChange)

function handleFileInputChange() {
  if (fileInput && fileInput.files) {
    SendServer.createRoom()
    // TODO: show loader while waiting for RoomCreated event
  } else {
    console.log("no file chosen")
  }
}

SendServer.listen(ServerEvent.RoomCreated, (data: RoomCreatedData) => {
  const { roomID } = data
  if (paragraph) {
    paragraph.innerText = roomID
  }
})

SendServer.listen(ServerEvent.ReceiverJoined, (data: ReceiverJoinedData) => {
  const { receiverID } = data
  new Receiver(receiverID)
  if (h1) {
    h1.innerText += `${receiverID} `
  }
})
