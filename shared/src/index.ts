export const enum ServerEvent {
  CreateRoom = "from_sender:handshake:create_room",
  RoomCreated = "to_sender:handshake:room_created",
}

export type RoomCreatedData = {
  roomID: RoomID
}

export type ClientID = string

export type RoomID = string

export type Room = {
  roomID: RoomID
  sender: ClientID
  receivers: Array<ClientID>
}
