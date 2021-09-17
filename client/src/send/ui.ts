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

    const receiversElem = this.getReceiversElem()
    receiversElem.innerText = text
  }
}
