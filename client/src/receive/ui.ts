import {
  CHUNK_SIZE,
  DownloadCompleteMessage,
  FileMetadataMessage,
  getReadableFileSize,
} from "../shared"

import { isFinishedDownloading } from "./util"

export class UI {
  static _titleElem = document.querySelector<HTMLHeadingElement>("#title")
  static _fileNameElem =
    document.querySelector<HTMLParagraphElement>("#file-name")
  static _fileSizeElem =
    document.querySelector<HTMLParagraphElement>("#file-size")
  static _downloadElem = document.querySelector<HTMLButtonElement>("#download")
  static _isDownloading = false // todo rename clickedDownload

  // TODO consider not making getters private
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
      throw Error("File name element does not exist.")
    }
    return this._fileSizeElem
  }

  static getDownloadElem(): HTMLButtonElement {
    if (!this._downloadElem) {
      throw Error("Download element does not exist.")
    }
    return this._downloadElem
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

  static clickDownload(
    chunks: Array<ArrayBuffer>,
    name: string,
    size: number,
    dataChannel: RTCDataChannel
  ): void {
    this._isDownloading = true
    this.getDownloadElem().innerText = "Downloading"
    this.getDownloadElem().className = "disabled"
    this.updateDownloadProgress(chunks, name, size, dataChannel)
  }

  static updateDownloadProgress(
    chunks: Array<ArrayBuffer>,
    name: string,
    size: number,
    dataChannel: RTCDataChannel
  ): void {
    if (!this._isDownloading) {
      return
    }
    const percent = Math.round(((chunks.length * CHUNK_SIZE) / size) * 100)

    this._getFileSizeElem().innerText = `${getReadableFileSize(
      chunks.length * CHUNK_SIZE
    )} / ${getReadableFileSize(size)} · ${percent}%`

    if (isFinishedDownloading(chunks, size)) {
      UI.downloadFile(chunks, name)
      this.getDownloadElem().innerText = "Re-download"
      this.getDownloadElem().className = ""
      const downloadCompleteMessage: DownloadCompleteMessage = {
        type: "download_complete",
      }
      dataChannel.send(JSON.stringify(downloadCompleteMessage))
    }
  }

  static downloadFile(chunks: Array<ArrayBuffer>, name: string): void {
    // TODO: add additional metadata to file
    const file = new File(chunks, name)
    const anchor = window.document.createElement("a")
    anchor.href = window.URL.createObjectURL(file)
    anchor.download = file.name
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }
}
