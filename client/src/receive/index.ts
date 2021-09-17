import { OfferSentData, ServerEvent } from "@webrtc-file-transfer/shared"

import { rtcConfig } from "../shared"

import { ReceiveServer } from "./server"
import { getRoomID } from "./util"

const h1 = document.querySelector<HTMLHeadingElement>("h1#title")

const peerConnection = new RTCPeerConnection(rtcConfig)
// TODO: create dataChannel

// Join room in server
ReceiveServer.joinRoom(getRoomID())

ReceiveServer.listen(ServerEvent.RoomNotFound, () => {
  if (h1) {
    h1.innerText = "Room not found."
  }
})

ReceiveServer.listen(ServerEvent.RoomJoined, () => {
  if (h1) {
    h1.innerText = "Joined room."
  }
})

ReceiveServer.listen(ServerEvent.SenderLeft, () => {
  if (h1) {
    h1.innerText = "Sender left room."
  }
})

ReceiveServer.listen(ServerEvent.OfferSent, (data: OfferSentData) => {
  const { offer } = data

  console.log("Received offer:")
  console.log(offer)
  void peerConnection.setRemoteDescription(offer)
  console.log("set remote desc")
})

void peerConnection.createOffer().then((offer) => handleOffer(offer))
async function handleOffer(offer: RTCSessionDescriptionInit) {
  void peerConnection.setRemoteDescription(offer)
  const answer = await peerConnection.createAnswer()
  void peerConnection.setLocalDescription(answer)
  console.log(answer) // TODO: send answer to host in socket.io
}
