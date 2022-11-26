import { RoomID } from "@webrtc-file-transfer/shared"

import { getReadableFileSize } from "../shared"

import { Receivers } from "./receiver"

export class UI {
  static introElem = document.querySelector<HTMLDivElement>("#intro")
  static buttonElem = document.querySelector<HTMLButtonElement>("#upload")
  static fileInputElem = document.querySelector<HTMLInputElement>("#file-input")
  static sendingElem = document.querySelector<HTMLDivElement>("#sending")
  static connectionsElem =
    document.querySelector<HTMLParagraphElement>("#connections")
  static downloadsElem =
    document.querySelector<HTMLParagraphElement>("#downloads")
  static transferredElem =
    document.querySelector<HTMLParagraphElement>("#transferred")
  static linkElem = document.querySelector<HTMLAnchorElement>("#link")
  static bytesTransferred = 0
  // TODO: implement file name

  static getIntroElem(): HTMLDivElement {
    if (!this.introElem) {
      throw Error("Intro element does not exist.")
    }
    return this.introElem
  }

  static getButtonElem(): HTMLButtonElement {
    if (!this.buttonElem) {
      throw Error("Button element does not exist.")
    }
    return this.buttonElem
  }

  static getFileInputElem(): HTMLInputElement {
    if (!this.fileInputElem) {
      throw Error("file input element does not exist.")
    }
    return this.fileInputElem
  }

  static getFile(): File {
    const fileInputElem = this.getFileInputElem()
    if (!fileInputElem.files || !fileInputElem.files[0]) {
      throw Error("file input element does not have a file")
    }
    return fileInputElem.files[0]
  }

  static getSendingElem(): HTMLDivElement {
    if (!this.sendingElem) {
      throw Error("Sending element does not exist.")
    }
    return this.sendingElem
  }

  static getConnectionsElem(): HTMLParagraphElement {
    if (!this.connectionsElem) {
      throw Error("Connections element does not exist.")
    }
    return this.connectionsElem
  }

  static getDownloadsElem(): HTMLParagraphElement {
    if (!this.downloadsElem) {
      throw Error("Downloads element does not exist.")
    }
    return this.downloadsElem
  }

  static getTransferredElem(): HTMLParagraphElement {
    if (!this.transferredElem) {
      throw Error("Transferred element does not exist.")
    }
    return this.transferredElem
  }

  static getLinkElem(): HTMLAnchorElement {
    if (!this.linkElem) {
      throw Error("Link element does not exist.")
    }
    return this.linkElem
  }

  static setRoomID(roomID: RoomID) {
    const introElem = this.getIntroElem()
    introElem.style.display = "none"

    const sendingElem = this.getSendingElem()
    sendingElem.style.display = "flex"

    const linkElem = this.getLinkElem()
    // TODO: dynamically set domain name based on environment
    // TODO: consider not using roomID query param
    linkElem.innerText = `filepie.app/receive?roomID=${roomID}`
    // TODO: fix link to not need .html
    linkElem.href = `/receive.html?roomID=${roomID}`
  }

  static updateReceivers() {
    const connectionsElem = this.getConnectionsElem()
    connectionsElem.innerText = Object.keys(
      Receivers.receivers
    ).length.toString()
  }

  static incrementDownloads(): void {
    // todo: maybe store underlying state value for downloads like for transferred?
    const downloads = parseInt(this.getDownloadsElem().innerText)
    if (isNaN(downloads)) {
      throw Error("Downloads is not a number.")
    }
    this.getDownloadsElem().innerText = `${downloads + 1}`
  }

  static incrementBytesTransferred(bytes: number): void {
    this.bytesTransferred += bytes
    this.getTransferredElem().innerText = getReadableFileSize(
      this.bytesTransferred
    )
  }
}
