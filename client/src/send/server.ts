import {
  ClientID,
  SendIceCandidateToReceiverData,
  SendOfferData,
  ServerEvent,
} from "@webrtc-file-transfer/shared"

import { Server, ClientLogger } from "@shared/."

export class SendServer extends Server {
  static createRoom() {
    this.socket.emit(ServerEvent.CreateRoom)

    ClientLogger.debug("sent CreateRoom event to server")
  }

  static sendOffer(offer: RTCSessionDescriptionInit, receiverID: ClientID) {
    const data: SendOfferData = { offer, receiverID }
    this.socket.emit(ServerEvent.SendOffer, data)

    ClientLogger.debug(
      "sent SendOffer event to server",
      `receiverID: ${receiverID}`,
      `offer.sdp: ${offer.sdp ?? ""}`,
      `offer.type: ${offer.type}`
    )
  }

  static sendIceCandidate(iceCandidate: RTCIceCandidate, receiverID: ClientID) {
    const data: SendIceCandidateToReceiverData = { iceCandidate, receiverID }
    this.socket.emit(ServerEvent.SendIceCandidateToReceiver, data)

    ClientLogger.debug(
      "sent SendIceCandidateToReceiver event to server",
      `receiverID: ${receiverID}`,
      `icdeCandidate: ${JSON.stringify(iceCandidate.toJSON())}`
    )
  }
}
