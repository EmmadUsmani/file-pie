import { RoomID, ServerEvent } from "@file-pie/shared"
import { Socket } from "socket.io"

/**
 * Manages connection to a single client (either sender or receiver)
 * by encapsulating underlying socket.io Socket instance and providing
 * declarative methods for actions.
 */
export class Client {
  _socket: Socket
  _roomID: RoomID | undefined
  type: "sender" | "receiver" | undefined

  constructor(socket: Socket) {
    this._socket = socket
  }

  get id(): string {
    return this._socket.id
  }

  get roomID(): RoomID {
    if (!this._roomID) {
      throw Error(`${this.type ?? "client"} ${this.id} has undefined roomID`)
    }
    return this._roomID
  }

  isInRoom(): boolean {
    return this._roomID !== undefined
  }

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(event: ServerEvent, data?: any): void {
    this._socket.emit(event, data)
  }

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  broadcast(event: ServerEvent, data?: any): void {
    this._socket.to(this.roomID).emit(event, data)
  }

  registerHandler(
    event: ServerEvent | string,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: (data?: any) => void
  ): void {
    this._socket.on(event, (data) => {
      try {
        handler(data)
      } catch (error) {
        console.log(error)
      }
    })
  }

  async joinRoomAsSender(roomID: RoomID): Promise<void> {
    if (this._roomID) {
      throw Error(
        `Sender ${this.id} cannot join room ${roomID}, is already in room ${this._roomID}`
      )
    }
    this._roomID = roomID
    this.type = "sender"
    await this._socket.join(roomID)
  }

  async joinRoomAsReceiver(roomID: RoomID): Promise<void> {
    if (this._roomID) {
      throw Error(
        `Receiver ${this.id} cannot join room ${roomID}, is already in room ${this._roomID}`
      )
    }
    this._roomID = roomID
    this.type = "receiver"
    await this._socket.join(roomID)
  }

  async leaveRoom(): Promise<void> {
    await this._socket.leave(this.roomID)
    this._roomID = undefined
    this.type = undefined
  }
}
