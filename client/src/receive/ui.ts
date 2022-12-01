import {
  CHUNK_SIZE,
  DownloadCompleteMessage,
  FileMetadataMessage,
  getReadableFileSize,
} from "@shared/."

import { isFinishedDownloading } from "./util"

export class UI {
  static _contentElem = document.querySelector<HTMLDivElement>("#content")
  static _titleElem = document.querySelector<HTMLHeadingElement>("#title")
  static _fileNameElem =
    document.querySelector<HTMLParagraphElement>("#file-name")
  static _fileSizeElem =
    document.querySelector<HTMLParagraphElement>("#file-size")
  static _downloadElem = document.querySelector<HTMLButtonElement>("#download")
  static _loadingElem = document.querySelector<HTMLDivElement>("#loading")

  static _fileDownloaded = false
  static _clickedDownload = false

  static getContentElem(): HTMLDivElement {
    if (!this._contentElem) {
      throw Error("Content element does not exist.")
    }
    return this._contentElem
  }

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

  static getLoadingElem(): HTMLDivElement {
    if (!this._loadingElem) {
      throw Error("Loading element does not exist.")
    }
    return this._loadingElem
  }

  static showLoadingElem(): void {
    this.getContentElem().style.display = "none"
    this.getLoadingElem().style.display = "inline-block"
  }

  static hideLoadingElem(): void {
    this.getLoadingElem().style.display = "none"
    this.getContentElem().style.display = "flex"
  }

  static getFileDownloaded(): boolean {
    return this._fileDownloaded
  }

  static displayFileMetadata(metadata: FileMetadataMessage["content"]): void {
    const { name, size } = metadata

    UI.hideLoadingElem()
    this._getFileNameElem().innerText = name
    this._getFileSizeElem().innerText = getReadableFileSize(size)
  }

  static clickDownload(
    chunks: Array<ArrayBuffer>,
    name: string,
    size: number,
    dataChannel: RTCDataChannel
  ): void {
    this._clickedDownload = true
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
    if (isFinishedDownloading(chunks, size)) {
      this._fileDownloaded = true
    }
    if (!this._clickedDownload) {
      return
    }
    const percent = Math.min(
      Math.round(((chunks.length * CHUNK_SIZE) / size) * 100),
      100
    )

    this._getFileSizeElem().innerText = `${getReadableFileSize(
      Math.min(chunks.length * CHUNK_SIZE, size)
    )} / ${getReadableFileSize(size)} · ${percent}%`

    if (this.getFileDownloaded()) {
      UI.downloadFile(chunks, name)
      this.getDownloadElem().innerText = "Re-download"
      this.getDownloadElem().className = ""
      dataChannel.send(new DownloadCompleteMessage().serialize())
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
