import {
  JoinRoomData,
  SendAnswerData,
  SendIceCandidateToSenderData,
  ServerEvent,
  IceCandidateSentFromSenderData,
  OfferSentData,
} from "@webrtc-file-transfer/shared"

import { Server, ClientLogger } from "@shared/."

import { ReceiveErrorHandler } from "./error"
import { Sender } from "./sender"
import { UI } from "./ui"

/**
 * Singleton to interface with WebSocket connection to backend server
 * needed for WebRTC handshake. Specific to the receive client.
 *
 * @extends Server
 */
export class ReceiveServer extends Server {
  static init(): void {
    this.joinRoom()

    this.listen(ServerEvent.RoomNotFound, () => {
      ReceiveErrorHandler.displayRoomNotFoundError()
    })

    this.listen(ServerEvent.RoomJoined, () => {
      ClientLogger.debug("received RoomJoined event from server")
    })

    this.listen(ServerEvent.SenderLeft, () => {
      if (!UI.getFileDownloaded()) {
        ReceiveErrorHandler.displaySenderLeftError()
      }

      ClientLogger.debug("received SenderLeft event from server")
    })

    this.listen(ServerEvent.OfferSent, async (data: OfferSentData) => {
      const { offer } = data

      this.sendAnswer(await Sender.accpetOfferAndCreateAnswer(offer))

      ClientLogger.debug(
        "received OfferSent event from server",
        `offer: ${JSON.stringify(offer)}`
      )
    })

    this.listen(
      ServerEvent.IceCandidateSentFromSender,
      async (data: IceCandidateSentFromSenderData) => {
        const { iceCandidate } = data

        try {
          await Sender.getPeerConnection().addIceCandidate(iceCandidate)
        } finally {
          ClientLogger.debug(
            "received IceCandiateSentFromSender event from server",
            `iceCandidate: ${JSON.stringify(iceCandidate)}`
          )
        }
      }
    )
  }

  static joinRoom() {
    const data: JoinRoomData = { roomID: UI.getRoomID() }
    this.socket.emit(ServerEvent.JoinRoom, data)

    ClientLogger.debug(
      "sent JoinRoom event to server",
      `roomID: ${UI.getRoomID()}`
    )
  }

  static sendAnswer(answer: RTCSessionDescriptionInit) {
    const data: SendAnswerData = { answer }
    this.socket.emit(ServerEvent.SendAnswer, data)

    ClientLogger.debug(
      "sent SendAnswer event to server",
      `answer.sdp: ${answer.sdp ?? ""}`,
      `answer.type: ${answer.type}`
    )
  }

  static sendIceCandidate(iceCandidate: RTCIceCandidate) {
    const data: SendIceCandidateToSenderData = { iceCandidate }
    this.socket.emit(ServerEvent.SendIceCandidateToSender, data)

    ClientLogger.debug(
      "sent SendIceCandidateToSender event to server",
      `iceCandidate: ${JSON.stringify(iceCandidate)}`
    )
  }
}
