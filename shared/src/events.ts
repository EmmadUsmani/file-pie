import { RoomID, ClientID } from "./types"

export const enum ServerEvent {
  CreateRoom = "from_sender:room:create_room",
  RoomCreated = "to_sender:room:room_created",
  JoinRoom = "from_receiver:room:join_room",
  RoomJoined = "to_receiver:room:room_joined",
  RoomNotFound = "to_receiver:room:room_not_found",
  ReceiverJoined = "to_sender:room:receiver_joined",
  ReceiverLeft = "to_sender:room:receiver_left",
  SenderLeft = "to_receiver:room:sender_left",
  SendOffer = "from_sender:handshake:send_offer",
  OfferSent = "to_receiver:handshake:offer_sent",
  SendAnswer = "from_receiver:handshake:send_answer",
  AnswerSent = "to_sender:handshake:answer_sent",
  SendIceCandidateToReceiver = "from_sender:handshake:send_ice_candidate_to_receiver",
  IceCandidateSentFromSender = "to_receiver:handshake:ice_candidate_sent_from_sender",
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
