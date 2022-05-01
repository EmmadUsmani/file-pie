import { RoomID } from "@webrtc-file-transfer/shared"

import { Receivers } from "./receiver"

export class UI {
  static fileInputElem = document.querySelector<HTMLInputElement>("#fileInput")
  static roomIDElem = document.querySelector<HTMLParagraphElement>("#roomID")
  static receiversElem =
    document.querySelector<HTMLParagraphElement>("#receivers")

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
