import { ClientID, Room, RoomID } from "@webrtc-file-transfer/shared"

import { ExtendedSocket } from "@server/types"
import { generateRoomID } from "@server/utils" // TODO (refactor): consider making this method of Rooms class

import { io } from "."

export class Rooms {
  static rooms: { [key: RoomID]: Room } = {}

  static createRoom(sender: ExtendedSocket): RoomID {
    const roomID = generateRoomID()
    this.rooms[roomID] = { roomID, sender: sender.id, receivers: [] }
    sender.roomID = roomID
    sender.clientType = "sender"
    void sender.join(roomID)
    return roomID
  }

  static receiverJoin(receiver: ExtendedSocket, roomID: RoomID) {
    this.verifyRoomExists(roomID)

    const room = this.rooms[roomID]
    room.receivers.push(receiver.id)
    receiver.roomID = roomID
    receiver.clientType = "receiver"
    void receiver.join(roomID)
  }

  static receiverLeave(receiver: ExtendedSocket) {
    const roomID = receiver.roomID
    this.verifyRoomExists(roomID)

    const room = this.rooms[roomID]
    room.receivers = room.receivers.filter((id) => id !== receiver.id)
    receiver.roomID = ""
    receiver.clientType = undefined
    void receiver.leave(roomID)
  }

  static senderLeave(sender: ExtendedSocket) {
    const roomID = sender.roomID
    this.verifyRoomExists(roomID)

    sender.clientType = undefined
    delete this.rooms[roomID]
    io.socketsLeave(roomID)
  }

  static getSenderID(roomID: RoomID): ClientID {
    this.verifyRoomExists(roomID)

    return this.rooms[roomID].sender
  }

  static verifyRoomExists(roomID: RoomID) {
    if (!(roomID in this.rooms)) {
      throw Error(`Room with id ${roomID} does not exist.`)
    }
  }
}
