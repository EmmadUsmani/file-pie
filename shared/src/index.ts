// TODO: consider separate rooms namespace rather than handshake
export const enum ServerEvent {
  CreateRoom = "from_sender:handshake:create_room",
  RoomCreated = "to_sender:handshake:room_created",
  JoinRoom = "from_receiver:handshake:join_room",
  RoomJoined = "to_receiver:handshake:room_joined",
  RoomNotFound = "to_receiver:handshake:room_not_found",
  ReceiverJoined = "to_sender:handshake:receiver_joined",
  ReceiverLeft = "to_sender:handshake:receiver_left",
  SenderLeft = "to_receiver:handshake:sender_left",
  SendOffer = "from_sender:handshake:send_offer",
  OfferSent = "to_receiver:handshake:offer_sent",
}

export type RoomCreatedData = {
  roomID: RoomID
}

export type JoinRoomData = {
  roomID: RoomID
}

export type ReceiverJoinedData = {
  receiverID: ClientID
}

export type ReceiverLeftData = {
  receiverID: ClientID
}

export type SendOfferData = {
  offer: RTCSessionDescriptionInit
  receiverID: ClientID
}

export type OfferSentData = {
  offer: RTCSessionDescriptionInit
}

export type ClientID = string

export type RoomID = string

export type Room = {
  roomID: RoomID
  sender: ClientID
  receivers: Array<ClientID>
}
