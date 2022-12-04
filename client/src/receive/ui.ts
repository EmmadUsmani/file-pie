import { RoomID } from "@file-pie/shared"

import { CHUNK_SIZE, getReadableFileSize } from "@shared/."

import { Sender } from "./sender"

/**
 * Singleton exposing UI functionality via declarative methods,
 * manages DOM manipulation and state changes internally.
 */
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

  static init(): void {
    this.showLoadingElem()
    this.getDownloadElem().onclick = () => this._clickDownload()
  }

  static getContentElem(): HTMLDivElement {
    if (!this._contentElem) {
      throw Error("Content element does not exist.")
    }
    return this._contentElem
  }

  static getTitleElem(): HTMLHeadingElement {
    if (!this._titleElem) {
      throw Error("Title element does not exist.")
    }
    return this._titleElem
  }

  static getFileNameElem(): HTMLParagraphElement {
    if (!this._fileNameElem) {
      throw Error("File name elemnt does not exist.")
    }
    return this._fileNameElem
  }

  static getFileSizeElem(): HTMLParagraphElement {
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

  static getRoomID(): RoomID {
    const roomID = new URLSearchParams(window.location.search).get("roomID")
    if (!roomID) {
      throw Error("No room id provided.")
    }
    return roomID
  }

  static displayFileMetadata(): void {
    this.hideLoadingElem()
    this.getFileNameElem().innerText = Sender.getMetadata().name
    this.getFileSizeElem().innerText = getReadableFileSize(
      Sender.getMetadata().size
    )
  }

  static _clickDownload(): void {
    this._clickedDownload = true
    this.getDownloadElem().innerText = "Downloading"
    this.getDownloadElem().className = "disabled"
    this.updateDownloadProgress()
  }

  static updateDownloadProgress(): void {
    if (
      Sender.getChunks().length ===
      Math.ceil(Sender.getMetadata().size / CHUNK_SIZE)
    ) {
      this._fileDownloaded = true
    }
    if (!this._clickedDownload) {
      return
    }
    const percent = Math.min(
      Math.round(
        ((Sender.getChunks().length * CHUNK_SIZE) / Sender.getMetadata().size) *
          100
      ),
      100
    )

    this.getFileSizeElem().innerText = `${getReadableFileSize(
      Math.min(
        Sender.getChunks().length * CHUNK_SIZE,
        Sender.getMetadata().size
      )
    )} / ${getReadableFileSize(Sender.getMetadata().size)} · ${percent}%`

    if (this.getFileDownloaded()) {
      UI.downloadFile()
      this.getDownloadElem().innerText = "Re-download"
      this.getDownloadElem().className = ""
      Sender.sendDownloadCompleteMessage()
    }
  }

  static downloadFile(): void {
    const file = new File(Sender.getChunks(), Sender.getMetadata().name, {
      lastModified: Sender.getMetadata().lastModified,
    })
    const anchor = window.document.createElement("a")
    anchor.href = window.URL.createObjectURL(file)
    anchor.download = file.name
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }
}
