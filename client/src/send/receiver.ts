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

  static getReceiver(receiverID: ClientID) {
    return this.receivers[receiverID]
  }
}

// create new receiver when a peer joins the socket.io room
export class Receiver {
  receiverID: ClientID
  peerConnection: RTCPeerConnection
  dataChannel: RTCDataChannel

  constructor(receiverID: ClientID) {
    this.receiverID = receiverID
    this.peerConnection = new RTCPeerConnection(rtcConfig)
    this.dataChannel = this.peerConnection.createDataChannel(receiverID)
    this.initListeners()
    void this.sendOffer()
  }

  initListeners() {
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        SendServer.sendIceCandidate(event.candidate, this.receiverID)
      }
    }
  }

  destructor() {
    this.peerConnection.close()
  }

  async sendOffer() {
    const offer = await this.peerConnection.createOffer()
    void this.peerConnection.setLocalDescription(offer)
    SendServer.sendOffer(offer, this.receiverID)
  }

  acceptAnswer(answer: RTCSessionDescriptionInit) {
    void this.peerConnection.setRemoteDescription(answer)
  }

  addIceCandidate(iceCandidate: RTCIceCandidate) {
    void this.peerConnection.addIceCandidate(iceCandidate)
  }
}
