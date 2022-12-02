import {
  ClientID,
  SendIceCandidateToReceiverData,
  SendOfferData,
  AnswerSentData,
  IceCandidateSentFromReceiverData,
  ReceiverJoinedData,
  ReceiverLeftData,
  RoomCreatedData,
  ServerEvent,
} from "@webrtc-file-transfer/shared"

import { Server, ClientLogger } from "@shared/."

import { Receivers } from "./receiver"
import { UI } from "./ui"

/**
 * Singleton to interface with WebSocket connection to backend server
 * needed for WebRTC handshake. Specific to the send client.
 *
 * @extends Server
 */
export class SendServer extends Server {
  static init(): void {
    this.listen(ServerEvent.RoomCreated, (data: RoomCreatedData) => {
      const { roomID } = data
      UI.setRoomID(roomID)

      ClientLogger.debug(
        "received RoomCreated event from server",
        `roomID: ${roomID}`
      )
    })

    this.listen(ServerEvent.ReceiverJoined, (data: ReceiverJoinedData) => {
      const { receiverID } = data
      Receivers.addReceiver(receiverID)

      ClientLogger.debug(
        "received ReceiverJoined event from server",
        `receiverID: ${receiverID}`
      )
    })

    this.listen(ServerEvent.ReceiverLeft, (data: ReceiverLeftData) => {
      const { receiverID } = data
      Receivers.removeReceiver(receiverID)

      ClientLogger.debug(
        "received ReceiverLeft event from server",
        `receiverID: ${receiverID}`
      )
    })

    this.listen(ServerEvent.AnswerSent, (data: AnswerSentData) => {
      const { answer, receiverID } = data

      const receiver = Receivers.getReceiver(receiverID)
      receiver.acceptAnswer(answer)

      ClientLogger.debug(
        "received AnswerSent event from server",
        `receiverID: ${receiverID}`,
        `answer.sdp: ${answer.sdp ?? ""}`,
        `answer.type: ${answer.type}`
      )
    })

    this.listen(
      ServerEvent.IceCandidateSentFromReceiver,
      (data: IceCandidateSentFromReceiverData) => {
        const { iceCandidate, receiverID } = data

        const receiver = Receivers.getReceiver(receiverID)
        receiver.addIceCandidate(iceCandidate)

        ClientLogger.debug(
          "received IceCandidateSentFromReceiver event from server",
          `receiverID: ${receiverID}`,
          `iceCandidate: ${JSON.stringify(iceCandidate)}`
        )
      }
    )
  }

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
      `icdeCandidate: ${JSON.stringify(iceCandidate)}`
    )
  }
}
