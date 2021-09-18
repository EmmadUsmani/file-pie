import {
  AnswerSentData,
  IceCandidateSentFromReceiverData,
  JoinRoomData,
  ReceiverJoinedData,
  ReceiverLeftData,
  SendAnswerData,
  SendIceCandidateToSenderData,
  ServerEvent,
} from "@webrtc-file-transfer/shared"

import { io } from "../.."
import { Rooms } from "../../rooms"
import { ExtendedSocket } from "../../types"
import { registerHandler } from "../../utils"

export function registerReceiverHandlers(socket: ExtendedSocket) {
  registerHandler(socket, ServerEvent.JoinRoom, (data: JoinRoomData) => {
    const { roomID } = data
    try {
      Rooms.receiverJoin(socket, roomID)
    } catch {
      // invalid roomID
      socket.emit(ServerEvent.RoomNotFound)
      return
    }

    // notify receiver
    socket.emit(ServerEvent.RoomJoined)

    // notify sender
    const senderID = Rooms.getSenderID(roomID)
    const resData: ReceiverJoinedData = { receiverID: socket.id }
    io.to(senderID).emit(ServerEvent.ReceiverJoined, resData)
  })

  registerHandler(socket, "disconnect", () => {
    const roomID = socket.roomID

    // do nothing if client is not in a room
    if (!roomID) {
      return
    }

    // do nothing if client is not a receiver
    if (socket.clientType !== "receiver") {
      return
    }

    Rooms.receiverLeave(socket)

    // notify sender
    const senderID = Rooms.getSenderID(roomID)
    const resData: ReceiverLeftData = { receiverID: socket.id }
    io.to(senderID).emit(ServerEvent.ReceiverLeft, resData)
  })

  registerHandler(socket, ServerEvent.SendAnswer, (data: SendAnswerData) => {
    const { answer } = data

    // forward to sender
    const senderID = Rooms.getSenderID(socket.roomID)
    const resData: AnswerSentData = { answer, receiverID: socket.id }
    io.to(senderID).emit(ServerEvent.AnswerSent, resData)
  })

  registerHandler(
    socket,
    ServerEvent.SendIceCandidateToSender,
    (data: SendIceCandidateToSenderData) => {
      const { iceCandidate } = data

      // forward to sender
      const senderID = Rooms.getSenderID(socket.roomID)
      const resData: IceCandidateSentFromReceiverData = {
        iceCandidate,
        receiverID: socket.id,
      }
      io.to(senderID).emit(ServerEvent.IceCandidateSentFromReceiver, resData)
    }
  )
}
