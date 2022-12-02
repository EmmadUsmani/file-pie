import {
  IceCandidateSentFromSenderData,
  OfferSentData,
  RoomCreatedData,
  SendIceCandidateToReceiverData,
  SendOfferData,
  ServerEvent,
} from "@webrtc-file-transfer/shared"

import { Client } from "@server/client"
import { io } from "@server/init"
import { Rooms } from "@server/rooms"

export function registerSenderHandlers(client: Client) {
  client.registerHandler(ServerEvent.CreateRoom, () => {
    const roomID = Rooms.createRoom(client)

    const resData: RoomCreatedData = { roomID }
    client.emit(ServerEvent.RoomCreated, resData)
  })

  client.registerHandler("disconnect", () => {
    if (!client.isInRoom() || client.type !== "sender") {
      return
    }

    // notify all receivers
    client.broadcast(ServerEvent.SenderLeft)
    Rooms.senderLeave(client)
  })

  client.registerHandler(ServerEvent.SendOffer, (data: SendOfferData) => {
    const { offer, receiverID } = data

    const resData: OfferSentData = { offer }
    io.to(receiverID).emit(ServerEvent.OfferSent, resData)
  })

  client.registerHandler(
    ServerEvent.SendIceCandidateToReceiver,
    (data: SendIceCandidateToReceiverData) => {
      const { iceCandidate, receiverID } = data

      const resData: IceCandidateSentFromSenderData = { iceCandidate }
      io.to(receiverID).emit(ServerEvent.IceCandidateSentFromSender, resData)
    }
  )
}
