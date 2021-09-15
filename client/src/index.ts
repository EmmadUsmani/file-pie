import { ServerEvent } from "@webrtc-file-transfer/shared"
import { io } from "socket.io-client"

import { rtcConfig } from "./constants"

const socket = io("/")

const fileInput = document.querySelector<HTMLInputElement>("input#fileInput")
fileInput?.addEventListener("change", handleFileInputChange)

function handleFileInputChange() {
  if (fileInput && fileInput.files) {
    socket.emit(ServerEvent.CreateRoom)
  } else {
    console.log("no file chosen")
  }
}

socket.on(ServerEvent.RoomCreated, () => console.log("room created"))

// TOOD: listen for peer join
function handleReceiverJoin() {
  new Receiver()
}

// create new receiver when a peer joins the socket.io room
class Receiver {
  peerConnection: RTCPeerConnection

  constructor() {
    this.peerConnection = new RTCPeerConnection(rtcConfig)
    // TODO: create dataChannel & listen for 'open' event
    // TODO: initialize listeners
    void this.sendOffer()
  }

  async sendOffer() {
    const offer = await this.peerConnection.createOffer()
    void this.peerConnection.setLocalDescription(offer)
    console.log(offer) // TODO: send offer to socket.io this peer
  }

  handleAnswer(answer: RTCSessionDescriptionInit) {
    void this.peerConnection.setRemoteDescription(answer)
  }
}
