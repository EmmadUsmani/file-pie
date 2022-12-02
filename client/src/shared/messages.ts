export abstract class Message {
  abstract type: string
  content?: Record<string, unknown>

  serialize(): string {
    const obj: Record<string, unknown> = { type: this.type }
    if (this.content) {
      obj.content = this.content
    }
    return JSON.stringify(obj)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static parse(data: string): Message {
    throw Error("Parse method not implemented.")
  }
}

export class FileMetadataMessage extends Message {
  type: "file_metadata"
  content: {
    name: string
    size: number
    lastModified: number
  }

  constructor(metadata: { name: string; size: number; lastModified: number }) {
    super()
    this.type = "file_metadata"
    this.content = metadata
  }

  static parse(data: string): FileMetadataMessage {
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
    if (!content.size || typeof content.size !== "number") {
      throw Error("Content missing size")
    }
    if (!content.lastModified || typeof content.lastModified !== "number") {
      throw Error("Content missing lastModified")
    }

    return new FileMetadataMessage({
      name: content.name,
      size: content.size,
      lastModified: content.lastModified,
    })
  }
}

export class DownloadCompleteMessage extends Message {
  type: "download_complete"

  constructor() {
    super()
    this.type = "download_complete"
  }

  static parse(data: string): DownloadCompleteMessage {
    const json: unknown = JSON.parse(data)
    if (typeof json !== "object") {
      throw Error("Data is not an object")
    }
    const obj = json as Record<string, unknown>

    if (obj.type !== "download_complete") {
      throw Error("Type is not 'download_complete'.")
    }

    return new DownloadCompleteMessage()
  }
}
