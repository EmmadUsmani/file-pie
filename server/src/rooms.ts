import { ClientID, Room, RoomID } from "@webrtc-file-transfer/shared"

import { ExtendedSocket } from "./types"
import { generateRoomID } from "./utils" // TODO (refactor): consider making this method of Rooms class

export class Rooms {
  static rooms: { [key: RoomID]: Room } = {}

  static createRoom(sender: ExtendedSocket): RoomID {
    const roomID = generateRoomID()
    this.rooms[roomID] = { roomID, sender: sender.id, receivers: [] }
    sender.roomID = roomID
    return roomID
  }

  static receiverJoin(receiver: ExtendedSocket, roomID: RoomID) {
    if (!(roomID in this.rooms)) {
      throw Error(`Room with id ${roomID} does not exist.`)
    }

    const room = this.rooms[roomID]
    room.receivers.push(receiver.id)
    receiver.roomID = roomID
  }

  static receiverLeave(receiver: ExtendedSocket) {
    const roomID = receiver.roomID
    if (!(roomID in this.rooms)) {
      console.log(`Room with id ${roomID} does not exist.`)
      return
    }

    const room = this.rooms[roomID]
    room.receivers = room.receivers.filter((id) => id !== receiver.id)
    receiver.roomID = ""
  }

  static getSenderID(roomID: RoomID): ClientID | void {
    if (!(roomID in this.rooms)) {
      console.log(`Room with id ${roomID} does not exist.`)
      return
    }

    return this.rooms[roomID].sender
  }
}
