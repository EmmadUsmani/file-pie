import {
  AnswerSentData,
  IceCandidateSentFromReceiverData,
  JoinRoomData,
  ReceiverJoinedData,
  ReceiverLeftData,
  SendAnswerData,
  SendIceCandidateToSenderData,
  ServerEvent,
  Logger,
} from "@webrtc-file-transfer/shared"

import { Client } from "@server/client"
import { io } from "@server/init"
import { Rooms } from "@server/rooms"

export function registerReceiverHandlers(client: Client) {
  client.registerHandler(ServerEvent.JoinRoom, (data: JoinRoomData) => {
    const { roomID } = data
    try {
      Rooms.receiverJoin(client, roomID)
    } catch {
      client.emit(ServerEvent.RoomNotFound)
      return
    }

    // send confirmation to receiver
    client.emit(ServerEvent.RoomJoined)

    // notify sender
    const senderID = Rooms.getSenderID(roomID)
    const resData: ReceiverJoinedData = { receiverID: client.id }
    io.to(senderID).emit(ServerEvent.ReceiverJoined, resData)

    Logger.debug(
      `Received JoinRoom event from receiver ${client.id}`,
      `Sending RoomJoined event to receiver ${client.id}`,
      `Sending ReceiverJoined event to sender ${senderID}`
    )
  })

  client.registerHandler("disconnect", () => {
    if (!client.isInRoom() || client.type !== "receiver") {
      return
    }

    Rooms.receiverLeave(client)

    // notify sender
    const senderID = Rooms.getSenderID(client.roomID)
    const resData: ReceiverLeftData = { receiverID: client.id }
    io.to(senderID).emit(ServerEvent.ReceiverLeft, resData)

    Logger.debug(
      `Receiver ${client.id} disconnected`,
      `Sending ReceiverLeft event to sender ${senderID}`
    )
  })

  client.registerHandler(ServerEvent.SendAnswer, (data: SendAnswerData) => {
    const { answer } = data

    // forward to sender
    const senderID = Rooms.getSenderID(client.roomID)
    const resData: AnswerSentData = { answer, receiverID: client.id }
    io.to(senderID).emit(ServerEvent.AnswerSent, resData)

    Logger.debug(
      `Received SendAnswer event from receiver ${client.id}`,
      `Sending AnswerSent event to sender ${senderID}`,
      `answer.sdp: ${answer.sdp ?? ""}`,
      `answer.type: ${answer.type}`
    )
  })

  client.registerHandler(
    ServerEvent.SendIceCandidateToSender,
    (data: SendIceCandidateToSenderData) => {
      const { iceCandidate } = data

      // forward to sender
      const senderID = Rooms.getSenderID(client.roomID)
      const resData: IceCandidateSentFromReceiverData = {
        iceCandidate,
        receiverID: client.id,
      }
      io.to(senderID).emit(ServerEvent.IceCandidateSentFromReceiver, resData)

      Logger.debug(
        `Received SendIceCandidateToSender event from receiver ${client.id}`,
        `Sending IceCandiateSentFromReceiver event to sender ${senderID}`,
        `iceCandidate: ${JSON.stringify(iceCandidate)}`
      )
    }
  )
}
