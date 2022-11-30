import {
  JoinRoomData,
  RoomID,
  SendAnswerData,
  SendIceCandidateToSenderData,
  ServerEvent,
} from "@webrtc-file-transfer/shared"

import { Server } from "@shared/."

export class ReceiveServer extends Server {
  static joinRoom(roomID: RoomID) {
    const data: JoinRoomData = { roomID }
    this.socket.emit(ServerEvent.JoinRoom, data)
  }

  static sendAnswer(answer: RTCSessionDescriptionInit) {
    const data: SendAnswerData = { answer }
    this.socket.emit(ServerEvent.SendAnswer, data)
  }

  static sendIceCandidate(iceCandidate: RTCIceCandidate) {
    const data: SendIceCandidateToSenderData = { iceCandidate }
    this.socket.emit(ServerEvent.SendIceCandidateToSender, data)
  }
}
