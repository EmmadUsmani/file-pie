import { FileMetadataMessage } from "../shared"

import { getReadableFileSize } from "./util"

export class UI {
  static _titleElem = document.querySelector<HTMLHeadingElement>("#title")
  static _fileNameElem =
    document.querySelector<HTMLParagraphElement>("#file-name")
  static _fileSizeElem =
    document.querySelector<HTMLParagraphElement>("#file-size")

  static _getTitleElem(): HTMLHeadingElement {
    if (!this._titleElem) {
      throw Error("Title element does not exist.")
    }
    return this._titleElem
  }

  static _getFileNameElem(): HTMLParagraphElement {
    if (!this._fileNameElem) {
      throw Error("File name elemnt does not exist.")
    }
    return this._fileNameElem
  }

  static _getFileSizeElem(): HTMLParagraphElement {
    if (!this._fileSizeElem) {
      throw Error("File name elemnt does not exist.")
    }
    return this._fileSizeElem
  }

  static displayMessage(message: string): void {
    // TODO: replace with better error handling
    console.log(message)
  }

  static displayFileMetadata(metadata: FileMetadataMessage["content"]): void {
    const { name, type, size, lastModified } = metadata
    this.displayMessage(
      name + " " + type + " " + String(size) + " " + String(lastModified)
    )
    this._getFileNameElem().innerText = name
    this._getFileSizeElem().innerText = getReadableFileSize(size)
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
