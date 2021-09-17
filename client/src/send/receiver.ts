import { ClientID } from "@webrtc-file-transfer/shared"

import { rtcConfig } from "../shared"

import { SendServer } from "./server"

export class Receivers {
  static receivers: { [key: ClientID]: Receiver } = {}

  static addReceiver(receiverID: ClientID) {
    this.receivers[receiverID] = new Receiver(receiverID)
  }

  static removeReceiver(receiverID: ClientID) {
    this.receivers[receiverID].destructor()
    delete this.receivers[receiverID]
  }
}

// create new receiver when a peer joins the socket.io room
export class Receiver {
  receiverID: ClientID
  peerConnection: RTCPeerConnection

  constructor(receiverID: ClientID) {
    this.receiverID = receiverID
    this.peerConnection = new RTCPeerConnection(rtcConfig)
    // TODO: create dataChannel & listen for 'open' event
    // TODO: initialize listeners
    void this.sendOffer()
  }

  destructor() {
    console.log(`Removing Receiver with id ${this.receiverID}`)
    // TODO: remove listeners
  }

  async sendOffer() {
    const offer = await this.peerConnection.createOffer()
    void this.peerConnection.setLocalDescription(offer)
    SendServer.sendOffer(offer, this.receiverID)
  }

  handleAnswer(answer: RTCSessionDescriptionInit) {
    void this.peerConnection.setRemoteDescription(answer)
  }
}
