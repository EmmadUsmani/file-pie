import { FileMetadataMessage } from "../shared"

// TODO: improve parsing code
export function parseFileMetadataMessage(data: string): FileMetadataMessage {
  const json: unknown = JSON.parse(data)
  if (typeof json !== "object") {
    throw Error("Data is not an object")
  }
  const obj = json as Record<string, unknown>

  if (obj.type !== "file_metadata") {
    throw Error("Type is not 'file_metadata'.")
  }

  if (!obj.content) {
    throw Error("Data missing content")
  }
  const content = obj.content as Record<string, unknown>

  if (!content.name || typeof content.name !== "string") {
    throw Error("Content missing name")
  }
  if (!content.type || typeof content.type !== "string") {
    throw Error("Content missing type")
  }
  if (!content.size || typeof content.size !== "number") {
    throw Error("Content missing size")
  }
  if (!content.lastModified || typeof content.lastModified !== "number") {
    throw Error("Content missing lastModified")
  }

  return {
    type: "file_metadata",
    content: content as FileMetadataMessage["content"],
  }
}
