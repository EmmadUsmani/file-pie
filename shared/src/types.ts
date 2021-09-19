export type ClientID = string

export type RoomID = string

export type Room = {
  roomID: RoomID
  sender: ClientID
  receivers: Array<ClientID>
}
