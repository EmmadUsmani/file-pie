import {
  IceCandidateSentFromSenderData,
  OfferSentData,
  ServerEvent,
} from "@webrtc-file-transfer/shared"

import { CHUNK_SIZE, FileMetadataMessage, rtcConfig } from "../shared"

import { parseFileMetadataMessage } from "./parse"
import { ReceiveServer } from "./server"
import { UI } from "./ui"
import { getRoomID } from "./util"

// TODO: peerConnection code is very imperative, create an abstractions
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
      } catch (error) {
        console.error("Error parsing metadata")
      }
    } else {
      chunks.push(event.data)
      if (chunks.length === Math.ceil(metadata.size / CHUNK_SIZE)) {
        // TODO: add additional metadata to file
        UI.downloadFile(chunks, metadata.name)
      }
    }
  }
}

// Join room in server
ReceiveServer.joinRoom(getRoomID())

ReceiveServer.listen(ServerEvent.RoomNotFound, () => {
  UI.displayMessage("Room not found.")
})

ReceiveServer.listen(ServerEvent.RoomJoined, () => {
  UI.displayMessage("Joined room.")
})

ReceiveServer.listen(ServerEvent.SenderLeft, () => {
  UI.displayMessage("Sender left room.")
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
