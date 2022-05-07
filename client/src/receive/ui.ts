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

  static displayFileMetadata(metadata: FileMetadataMessage["content"]): void {
    const { name, type, size, lastModified } = metadata
    this.displayMessage(
      name + " " + type + " " + String(size) + " " + String(lastModified)
    )
  }

  static downloadFile(chunks: Array<ArrayBuffer>, name: string): void {
    const file = new File(chunks, name)
    const anchor = window.document.createElement("a")
    anchor.href = window.URL.createObjectURL(file)
    anchor.download = file.name
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }
}
