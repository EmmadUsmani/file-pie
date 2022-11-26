import { DownloadCompleteMessage } from "../shared"

// TODO: improve parsing code
export function parseDownloadCompleteMessage(
  data: string
): DownloadCompleteMessage {
  const json: unknown = JSON.parse(data)
  if (typeof json !== "object") {
    throw Error("Data is not an object")
  }
  const obj = json as Record<string, unknown>

  if (obj.type !== "download_complete") {
    throw Error("Type is not 'download_complete'.")
  }

  return {
    type: "download_complete",
  }
}
