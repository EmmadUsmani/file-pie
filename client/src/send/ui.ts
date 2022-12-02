import { RoomID } from "@webrtc-file-transfer/shared"

import { getReadableFileSize } from "@shared/."

import { Receivers } from "./receiver"
import { SendServer } from "./server"

export class UI {
  static _contentElem = document.querySelector<HTMLDivElement>("#content")
  static _introElem = document.querySelector<HTMLDivElement>("#intro")
  static _buttonElem = document.querySelector<HTMLButtonElement>("#upload")
  static _fileInputElem =
    document.querySelector<HTMLInputElement>("#file-input")
  static _sendingElem = document.querySelector<HTMLDivElement>("#sending")
  static _connectionsElem =
    document.querySelector<HTMLParagraphElement>("#connections")
  static _downloadsElem =
    document.querySelector<HTMLParagraphElement>("#downloads")
  static _transferredElem =
    document.querySelector<HTMLParagraphElement>("#transferred")
  static _fileNameElem = document.querySelector<HTMLElement>("#file-name")
  static _linkElem = document.querySelector<HTMLAnchorElement>("#link")
  static _loadingElem = document.querySelector<HTMLDivElement>("#loading")

  static _roomCreated = false
  static _bytesTransferred = 0
  static _downloads = 0

  static init(): void {
    const buttonElem = this.getButtonElem()
    const fileInputElem = this.getFileInputElem()

    buttonElem.onclick = () => fileInputElem.click()
    fileInputElem.addEventListener("change", () => {
      if (fileInputElem.files && !this._roomCreated) {
        SendServer.createRoom()
        this.showLoadingElem()
      }
    })
  }

  static getContentElem(): HTMLDivElement {
    if (!this._contentElem) {
      throw Error("Content element does not exist.")
    }
    return this._contentElem
  }

  static getIntroElem(): HTMLDivElement {
    if (!this._introElem) {
      throw Error("Intro element does not exist.")
    }
    return this._introElem
  }

  static getButtonElem(): HTMLButtonElement {
    if (!this._buttonElem) {
      throw Error("Button element does not exist.")
    }
    return this._buttonElem
  }

  static getFileInputElem(): HTMLInputElement {
    if (!this._fileInputElem) {
      throw Error("file input element does not exist.")
    }
    return this._fileInputElem
  }

  static getFile(): File {
    const fileInputElem = this.getFileInputElem()
    if (!fileInputElem.files || !fileInputElem.files[0]) {
      throw Error("file input element does not have a file")
    }
    return fileInputElem.files[0]
  }

  static getSendingElem(): HTMLDivElement {
    if (!this._sendingElem) {
      throw Error("Sending element does not exist.")
    }
    return this._sendingElem
  }

  static getConnectionsElem(): HTMLParagraphElement {
    if (!this._connectionsElem) {
      throw Error("Connections element does not exist.")
    }
    return this._connectionsElem
  }

  static getDownloadsElem(): HTMLParagraphElement {
    if (!this._downloadsElem) {
      throw Error("Downloads element does not exist.")
    }
    return this._downloadsElem
  }

  static getTransferredElem(): HTMLParagraphElement {
    if (!this._transferredElem) {
      throw Error("Transferred element does not exist.")
    }
    return this._transferredElem
  }

  static getFileNameElem(): HTMLElement {
    if (!this._fileNameElem) {
      throw Error("File name element does not exist.")
    }
    return this._fileNameElem
  }

  static getLinkElem(): HTMLAnchorElement {
    if (!this._linkElem) {
      throw Error("Link element does not exist.")
    }
    return this._linkElem
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

  static setRoomID(roomID: RoomID) {
    this.hideLoadingElem()
    this.getIntroElem().style.display = "none"
    this.getSendingElem().style.display = "flex"
    this.getFileNameElem().innerText = this.getFile().name
    this.getLinkElem().innerText = `filepie.app/receive?roomID=${roomID}`
    // TODO: fix link to not need .html
    this.getLinkElem().href = `/receive.html?roomID=${roomID}`
    this._roomCreated = true
  }

  static updateReceivers() {
    this.getConnectionsElem().innerText = Object.keys(
      Receivers.receivers
    ).length.toString()
  }

  static incrementDownloads(): void {
    this.getDownloadsElem().innerText = `${++this._downloads}`
  }

  static incrementBytesTransferred(bytes: number): void {
    this.getTransferredElem().innerText = getReadableFileSize(
      (this._bytesTransferred += bytes)
    )
  }
}
