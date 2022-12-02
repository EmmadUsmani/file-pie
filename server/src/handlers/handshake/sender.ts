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

    // emit response event to sender
    const resData: RoomCreatedData = { roomID }
    client.emit(ServerEvent.RoomCreated, resData)
  })

  client.registerHandler("disconnect", () => {
    // TODO: code is very imperative, can we make ExtendedSocket a class and add declarative methods?
    const roomID = client._roomID

    // do nothing if client is not in a room
    if (!roomID) {
      return
    }

    // do nothing if client is not a sender
    if (client.type !== "sender") {
      return
    }

    // notify all receivers
    client.broadcast(ServerEvent.SenderLeft)

    Rooms.senderLeave(client)
  })

  client.registerHandler(ServerEvent.SendOffer, (data: SendOfferData) => {
    const { offer, receiverID } = data

    // forward offer to receiver
    const resData: OfferSentData = { offer }
    io.to(receiverID).emit(ServerEvent.OfferSent, resData)
  })

  client.registerHandler(
    ServerEvent.SendIceCandidateToReceiver,
    (data: SendIceCandidateToReceiverData) => {
      const { iceCandidate, receiverID } = data

      // forward ice candidate to receiver
      const resData: IceCandidateSentFromSenderData = { iceCandidate }
      io.to(receiverID).emit(ServerEvent.IceCandidateSentFromSender, resData)
    }
  )
}
