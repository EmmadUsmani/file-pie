import { ClientID, Room, RoomID } from "@file-pie/shared"
import { v4 as uuidV4 } from "uuid"

import { Client } from "@server/client"
import { io } from "@server/init"

/**
 * Singleton managing all active Rooms connected clients have joined.
 */
export class Rooms {
  static rooms: Record<RoomID, Room> = {}

  static createRoom(sender: Client): RoomID {
    const roomID = uuidV4()

    this.rooms[roomID] = { roomID, sender: sender.id, receivers: [] }
    void sender.joinRoomAsSender(roomID)
    return roomID
  }

  static receiverJoin(receiver: Client, roomID: RoomID) {
    this.verifyRoomExists(roomID)

    const room = this.rooms[roomID]
    room.receivers.push(receiver.id)
    void receiver.joinRoomAsReceiver(roomID)
  }

  static receiverLeave(receiver: Client) {
    const roomID = receiver.roomID
    this.verifyRoomExists(roomID)

    void receiver.leaveRoom()

    const room = this.rooms[roomID]
    room.receivers = room.receivers.filter((id) => id !== receiver.id)
  }

  static senderLeave(sender: Client) {
    const roomID = sender.roomID
    this.verifyRoomExists(roomID)

    void sender.leaveRoom()

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
