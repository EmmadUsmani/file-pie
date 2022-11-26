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

/**
 * Format bytes as human-readable text.
 * @see https://stackoverflow.com/a/14919494 for source
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function getReadableFileSize(bytes: number, si = false, dp = 1): string {
  const thresh = si ? 1000 : 1024

  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
  let u = -1
  const r = 10 ** dp

  do {
    bytes /= thresh
    ++u
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  )

  return bytes.toFixed(dp) + " " + units[u]
}

export function isFinishedDownloading(
  chunks: Array<ArrayBuffer>,
  size: number
): boolean {
  return chunks.length === Math.ceil(size / CHUNK_SIZE)
}
