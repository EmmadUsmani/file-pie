export interface Message {
  type: string
  content: Record<string, unknown>
}

export interface FileMetadataMessage extends Message {
  type: "file_metadata"
  content: {
    name: string
    type: string
    size: number
    lastModified: string
  }
}
