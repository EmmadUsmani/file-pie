import {
  JoinRoomData,
  RoomID,
  SendAnswerData,
  SendIceCandidateToSenderData,
  ServerEvent,
} from "@webrtc-file-transfer/shared"

import { Server, ClientLogger } from "@shared/."

export class ReceiveServer extends Server {
  static joinRoom(roomID: RoomID) {
    const data: JoinRoomData = { roomID }
    this.socket.emit(ServerEvent.JoinRoom, data)

    ClientLogger.debug("sent JoinRoom event to server", `roomID: ${roomID}`)
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
