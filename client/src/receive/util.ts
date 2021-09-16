import { RoomID } from "@webrtc-file-transfer/shared"

export function getRoomID(): RoomID {
  const searchParams = new URLSearchParams(window.location.search)
  const roomID = searchParams.get("roomID")
  if (!roomID) {
    throw Error("No roomID provided.")
  }
  return roomID
}
