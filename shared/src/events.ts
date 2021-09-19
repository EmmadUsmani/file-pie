import { RoomID, ClientID } from "./types"

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
  SendAnswer = "from_receiver:handshake:send_answer",
  AnswerSent = "to_sender:handshake:answer_sent",
  SendIceCandidateToReceiver = "from_sender:handshake:send_ice_candidate_to_receiver",
  IceCandidateSentFromSender = "to_receiver:handhsake:ice_candidate_sent_from_sender",
  SendIceCandidateToSender = "from_receiver:handshake:send_ice_candidate_to_sender",
  IceCandidateSentFromReceiver = "to_sender:handshake:ice_candidate_sent_from_receiver",
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

export type SendAnswerData = {
  answer: RTCSessionDescriptionInit
}

export type AnswerSentData = {
  answer: RTCSessionDescriptionInit
  receiverID: ClientID
}

export type SendIceCandidateToReceiverData = {
  iceCandidate: RTCIceCandidate
  receiverID: ClientID
}

export type IceCandidateSentFromSenderData = {
  iceCandidate: RTCIceCandidate
}

export type SendIceCandidateToSenderData = {
  iceCandidate: RTCIceCandidate
}

export type IceCandidateSentFromReceiverData = {
  iceCandidate: RTCIceCandidate
  receiverID: ClientID
}
