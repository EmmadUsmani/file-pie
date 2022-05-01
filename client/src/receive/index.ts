import {
  IceCandidateSentFromSenderData,
  OfferSentData,
  ServerEvent,
} from "@webrtc-file-transfer/shared"

import { rtcConfig } from "../shared"

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

  dataChannel.onmessage = (event) => {
    const message = parseFileMetadataMessage(event.data)
    UI.displayFileMetadata(message)
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
