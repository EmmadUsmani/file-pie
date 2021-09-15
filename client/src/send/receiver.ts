import { rtcConfig } from "../shared"

// create new receiver when a peer joins the socket.io room
export class Receiver {
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
