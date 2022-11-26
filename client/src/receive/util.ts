import { RoomID } from "@webrtc-file-transfer/shared"

import { CHUNK_SIZE } from "../shared"

export function getRoomID(): RoomID {
  const searchParams = new URLSearchParams(window.location.search)
  const roomID = searchParams.get("roomID")
  if (!roomID) {
    throw Error("No roomID provided.")
  }
  return roomID
}

export function isFinishedDownloading(
  chunks: Array<ArrayBuffer>,
  size: number
): boolean {
  return chunks.length === Math.ceil(size / CHUNK_SIZE)
}
