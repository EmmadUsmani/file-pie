import {
  IceCandidateSentFromSenderData,
  OfferSentData,
  ServerEvent,
} from "@webrtc-file-transfer/shared"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import adapter from "webrtc-adapter"

import { FileMetadataMessage, rtcConfig } from "@shared/."

import { ReceiveErrorHandler } from "./error"
import { parseFileMetadataMessage } from "./parse"
import { ReceiveServer } from "./server"
import { UI } from "./ui"
import { getRoomID } from "./util"

import "@shared/style.css"
import "@shared/loading.css"
import "./style.css"
import "@shared/logo.svg"

ReceiveErrorHandler.init()
UI.showLoadingElem()

// TODO: peerConnection code is very imperative, create abstractions
const peerConnection = new RTCPeerConnection(rtcConfig)

peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    ReceiveServer.sendIceCandidate(event.candidate)
  }
}

peerConnection.ondatachannel = (event) => {
  const dataChannel = event.channel
  let metadata: FileMetadataMessage["content"]
  const chunks: Array<ArrayBuffer> = []

  dataChannel.onmessage = (event) => {
    // TODO: come up with a better way of type checking
    if (typeof event.data === "string") {
      try {
        metadata = parseFileMetadataMessage(event.data).content
        UI.displayFileMetadata(metadata)
        UI.getDownloadElem().onclick = () =>
          UI.clickDownload(chunks, metadata.name, metadata.size, dataChannel)
      } catch (error) {
        console.error("Error parsing metadata")
      }
    } else {
      chunks.push(event.data)
      UI.updateDownloadProgress(
        chunks,
        metadata.name,
        metadata.size,
        dataChannel
      )
    }
  }
}

// Join room in server
ReceiveServer.joinRoom(getRoomID())

ReceiveServer.listen(ServerEvent.RoomNotFound, () => {
  ReceiveErrorHandler.displayRoomNotFoundError()
})

ReceiveServer.listen(ServerEvent.RoomJoined, () => {
  UI.displayMessage("Joined room.")
})

ReceiveServer.listen(ServerEvent.SenderLeft, () => {
  if (!UI.getFileDownloaded()) {
    ReceiveErrorHandler.displaySenderLeftError()
  }
})

ReceiveServer.listen(ServerEvent.OfferSent, async (data: OfferSentData) => {
  const { offer } = data

  void peerConnection.setRemoteDescription(offer)
  const answer = await peerConnection.createAnswer()
  void peerConnection.setLocalDescription(answer)
  ReceiveServer.sendAnswer(answer)
})

ReceiveServer.listen(
  ServerEvent.IceCandidateSentFromSender,
  async (data: IceCandidateSentFromSenderData) => {
    const { iceCandidate } = data

    try {
      await peerConnection.addIceCandidate(iceCandidate)
    } catch (error) {
      console.error("Error adding received ice candidate", error)
    }
  }
)
