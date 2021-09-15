import { RoomCreatedData, ServerEvent } from "@webrtc-file-transfer/shared"

import { SendServer } from "./server"

const fileInput = document.querySelector<HTMLInputElement>("input#fileInput")
const paragraph = document.querySelector<HTMLParagraphElement>("p#roomID")
fileInput?.addEventListener("change", handleFileInputChange)

function handleFileInputChange() {
  if (fileInput && fileInput.files) {
    SendServer.createRoom()
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
