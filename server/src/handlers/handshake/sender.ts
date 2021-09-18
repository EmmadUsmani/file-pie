import {
  IceCandidateSentFromSenderData,
  OfferSentData,
  RoomCreatedData,
  SendIceCandidateToReceiverData,
  SendOfferData,
  ServerEvent,
} from "@webrtc-file-transfer/shared"

import { io } from "../.."
import { Rooms } from "../../rooms" // TODO (refactor): configure baseUrl
import { ExtendedSocket } from "../../types"
import { registerHandler } from "../../utils"

export function registerSenderHandlers(socket: ExtendedSocket) {
  registerHandler(socket, ServerEvent.CreateRoom, () => {
    const roomID = Rooms.createRoom(socket)

    // emit response event to sender
    const resData: RoomCreatedData = { roomID }
    socket.emit(ServerEvent.RoomCreated, resData)
  })

  registerHandler(socket, "disconnect", () => {
    const roomID = socket.roomID

    // do nothing if client is not in a room
    if (!roomID) {
      return
    }

    // do nothing if client is not a sender
    if (socket.clientType !== "sender") {
      return
    }

    // notify all receivers
    socket.to(roomID).emit(ServerEvent.SenderLeft)

    Rooms.senderLeave(socket)
  })

  registerHandler(socket, ServerEvent.SendOffer, (data: SendOfferData) => {
    const { offer, receiverID } = data

    // forward offer to receiver
    const resData: OfferSentData = { offer }
    io.to(receiverID).emit(ServerEvent.OfferSent, resData)
  })

  registerHandler(
    socket,
    ServerEvent.SendIceCandidateToReceiver,
    (data: SendIceCandidateToReceiverData) => {
      const { iceCandidate, receiverID } = data

      // forward ice candidate to receiver
      const resData: IceCandidateSentFromSenderData = { iceCandidate }
      io.to(receiverID).emit(ServerEvent.IceCandidateSentFromSender, resData)
    }
  )
}
