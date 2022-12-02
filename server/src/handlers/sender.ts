import {
  IceCandidateSentFromSenderData,
  OfferSentData,
  RoomCreatedData,
  SendIceCandidateToReceiverData,
  SendOfferData,
  ServerEvent,
  Logger,
} from "@webrtc-file-transfer/shared"

import { Client } from "@server/client"
import { io } from "@server/init"
import { Rooms } from "@server/rooms"

/**
 * Registers handlers for sender clients
 *
 * @param client - Client instance, converted from Socket
 */
export function registerSenderHandlers(client: Client) {
  client.registerHandler(ServerEvent.CreateRoom, () => {
    const roomID = Rooms.createRoom(client)

    const resData: RoomCreatedData = { roomID }
    client.emit(ServerEvent.RoomCreated, resData)

    Logger.debug(
      `Received CreateRoom event from sender ${client.id}`,
      `Sending RoomCreated event to sender ${client.id}`,
      `roomID: ${roomID}`
    )
  })

  client.registerHandler("disconnect", () => {
    if (!client.isInRoom() || client.type !== "sender") {
      return
    }

    client.broadcast(ServerEvent.SenderLeft)
    Rooms.senderLeave(client)

    Logger.debug(
      `Sender ${client.id} disconnected`,
      `Sending SenderLeft event to all receivers in room ${client.roomID}`
    )
  })

  client.registerHandler(ServerEvent.SendOffer, (data: SendOfferData) => {
    const { offer, receiverID } = data

    const resData: OfferSentData = { offer }
    io.to(receiverID).emit(ServerEvent.OfferSent, resData)

    Logger.debug(
      `Received SendOffer event from sender ${client.id}`,
      `Sending OfferSent event to receiver ${receiverID}`,
      `offer.sdp: ${offer.sdp ?? ""}`,
      `offer.type: ${offer.type}`
    )
  })

  client.registerHandler(
    ServerEvent.SendIceCandidateToReceiver,
    (data: SendIceCandidateToReceiverData) => {
      const { iceCandidate, receiverID } = data

      const resData: IceCandidateSentFromSenderData = { iceCandidate }
      io.to(receiverID).emit(ServerEvent.IceCandidateSentFromSender, resData)

      Logger.debug(
        `Received SendIceCandidateToReceiver event from sender ${client.id}`,
        `Sending IceCandidateSentFromSender event to receiver ${receiverID}`,
        `iceCandidate: ${JSON.stringify(iceCandidate)}`
      )
    }
  )
}
