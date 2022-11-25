import { RoomID } from "@webrtc-file-transfer/shared"

import { Receivers } from "./receiver"

export class UI {
  static introElem = document.querySelector<HTMLDivElement>("#intro")
  static buttonElem = document.querySelector<HTMLButtonElement>("#upload")
  static fileInputElem = document.querySelector<HTMLInputElement>("#file-input")
  static sendingElem = document.querySelector<HTMLDivElement>("#sending")
  static roomIDElem = document.querySelector<HTMLParagraphElement>("#roomID")
  static receiversElem =
    document.querySelector<HTMLParagraphElement>("#receivers")

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

  static getRoomIDElem(): HTMLParagraphElement {
    if (!this.roomIDElem) {
      throw Error("roomID element does not exist.")
    }
    return this.roomIDElem
  }

  static getReceiversElem(): HTMLParagraphElement {
    if (!this.receiversElem) {
      throw Error("receivers element does not exist.")
    }
    return this.receiversElem
  }

  static setRoomID(roomID: RoomID) {
    const introElem = this.getIntroElem()
    introElem.style.display = "none"

    const sendingElem = this.getSendingElem()
    sendingElem.style.display = "flex"

    const roomIDElem = this.getRoomIDElem()
    roomIDElem.innerText = roomID
  }

  static updateReceivers() {
    let text = ""
    for (const receiverID in Receivers.receivers) {
      text += `${receiverID}, `
    }
    text = text.slice(0, text.length - 2)

    // TODO: consider using more declarative code, e.g. this.setReceiversText
    const receiversElem = this.getReceiversElem()
    receiversElem.innerText = text
  }
}
