import { ClientID, Room, RoomID } from "@webrtc-file-transfer/shared"
import { Socket } from "socket.io"

import { generateRoomID } from "./utils" // TODO (refactor): consider making this method of Rooms class

export class Rooms {
  static rooms: { [key: RoomID]: Room } = {}

  static createRoom(sender: Socket): RoomID {
    const roomID = generateRoomID()
    this.rooms[roomID] = { roomID, sender: sender.id, receivers: [] }
    // TODO: add roomID to socket instance
    return roomID
  }

  static receiverJoin(receiver: Socket, roomID: RoomID) {
    if (!(roomID in this.rooms)) {
      console.log(`Room with id ${roomID} does not exist.`)
      return
    }

    const room = this.rooms[roomID]
    room.receivers.push(receiver.id)
    // TODO: add roomID to socket instance
  }

  static getSenderID(roomID: RoomID): ClientID | void {
    if (!(roomID in this.rooms)) {
      console.log(`Room with id ${roomID} does not exist.`)
      return
    }

    return this.rooms[roomID].sender
  }
}
