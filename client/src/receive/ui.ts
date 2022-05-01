import { FileMetadataMessage } from "../shared"

export class UI {
  static titleElem = document.querySelector<HTMLHeadingElement>("h1#title")

  static _getTitleElem(): HTMLHeadingElement {
    if (!this.titleElem) {
      throw Error("Title element does not exist.")
    }
    return this.titleElem
  }

  static displayMessage(message: string): void {
    this._getTitleElem().innerText = message
  }

  static displayFileMetadata(metadata: FileMetadataMessage): void {
    const { name, type, size, lastModified } = metadata.content
    this.displayMessage(
      name + " " + type + " " + String(size) + " " + String(lastModified)
    )
  }
}
