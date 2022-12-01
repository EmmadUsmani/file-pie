import {
  IceCandidateSentFromSenderData,
  OfferSentData,
  ServerEvent,
} from "@webrtc-file-transfer/shared"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import adapter from "webrtc-adapter"

import { FileMetadataMessage, rtcConfig, ClientLogger } from "@shared/."

import { ReceiveErrorHandler } from "./error"
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
        metadata = FileMetadataMessage.parse(event.data).content
        UI.displayFileMetadata(metadata)
        UI.getDownloadElem().onclick = () =>
          UI.clickDownload(chunks, metadata.name, metadata.size, dataChannel)
      } catch (error) {
        console.error("Error parsing metadata")
      } finally {
        ClientLogger.debug(
          "received FileMetadata message from sender",
          `metadata: ${JSON.stringify(metadata)}`
        )
      }
    } else {
      chunks.push(event.data)
      UI.updateDownloadProgress(
        chunks,
        metadata.name,
        metadata.size,
        dataChannel
      )

      ClientLogger.debug("received chunk from sender")
    }
  }
}

// Join room in server
ReceiveServer.joinRoom(getRoomID())

ReceiveServer.listen(ServerEvent.RoomNotFound, () => {
  ReceiveErrorHandler.displayRoomNotFoundError()
})

ReceiveServer.listen(ServerEvent.RoomJoined, () => {
  ClientLogger.debug("received RoomJoined event from server")
})

ReceiveServer.listen(ServerEvent.SenderLeft, () => {
  if (!UI.getFileDownloaded()) {
    ReceiveErrorHandler.displaySenderLeftError()
  }

  ClientLogger.debug("received SenderLeft event from server")
})

ReceiveServer.listen(ServerEvent.OfferSent, async (data: OfferSentData) => {
  const { offer } = data

  void peerConnection.setRemoteDescription(offer)
  const answer = await peerConnection.createAnswer()
  void peerConnection.setLocalDescription(answer)
  ReceiveServer.sendAnswer(answer)

  ClientLogger.debug(
    "received OfferSent event from server",
    `offer: ${JSON.stringify(offer)}`
  )
})

ReceiveServer.listen(
  ServerEvent.IceCandidateSentFromSender,
  async (data: IceCandidateSentFromSenderData) => {
    const { iceCandidate } = data

    try {
      await peerConnection.addIceCandidate(iceCandidate)
    } catch (error) {
      ClientLogger.error(error as Error)
    } finally {
      ClientLogger.debug(
        "received IceCandiateSentFromSender event from server",
        `iceCandidate: ${JSON.stringify(iceCandidate)}`
      )
    }
  }
)
