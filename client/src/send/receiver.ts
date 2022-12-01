import { ClientID } from "@webrtc-file-transfer/shared"

import {
  FileMetadataMessage,
  rtcConfig,
  CHUNK_SIZE,
  ClientLogger,
  DownloadCompleteMessage,
} from "@shared/."

import { SendServer } from "./server"
import { UI } from "./ui"

export class Receivers {
  static receivers: Record<ClientID, Receiver> = {}

  static addReceiver(receiverID: ClientID) {
    this.receivers[receiverID] = new Receiver(receiverID)
    UI.updateReceivers()
  }

  static removeReceiver(receiverID: ClientID) {
    this.receivers[receiverID].destructor()
    delete this.receivers[receiverID]
    UI.updateReceivers()
  }

  static getReceiver(receiverID: ClientID) {
    return this.receivers[receiverID]
  }
}

// create new receiver when a peer joins the socket.io room
export class Receiver {
  receiverID: ClientID
  peerConnection: RTCPeerConnection
  dataChannel: RTCDataChannel

  constructor(receiverID: ClientID) {
    this.receiverID = receiverID
    this.peerConnection = new RTCPeerConnection(rtcConfig)
    this.dataChannel = this.peerConnection.createDataChannel(receiverID, {
      ordered: true,
    })
    this.initListeners()
    void this._sendOffer()
  }

  initListeners() {
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        SendServer.sendIceCandidate(event.candidate, this.receiverID)
      }
    }

    this.dataChannel.onopen = () => {
      const file = UI.getFile()

      const metadataMessage = new FileMetadataMessage({
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
      })
      this.dataChannel.send(metadataMessage.serialize())

      ClientLogger.debug(
        "sent FileMetadataMessage to receiver",
        `receiverID: ${this.receiverID}`,
        `message: ${metadataMessage.serialize()}`
      )

      void this._sendFile(file)
    }

    this.dataChannel.onmessage = (event) => {
      if (typeof event.data === "string") {
        try {
          DownloadCompleteMessage.parse(event.data)
          UI.incrementDownloads()
        } catch (error) {
          console.error("Error parsing metadata.")
        }
      }
    }
  }

  destructor() {
    this.peerConnection.close()
  }

  acceptAnswer(answer: RTCSessionDescriptionInit) {
    void this.peerConnection.setRemoteDescription(answer)
  }

  addIceCandidate(iceCandidate: RTCIceCandidate) {
    void this.peerConnection.addIceCandidate(iceCandidate)
  }

  async _sendOffer() {
    const offer = await this.peerConnection.createOffer()
    void this.peerConnection.setLocalDescription(offer)
    SendServer.sendOffer(offer, this.receiverID)
  }

  async _sendFile(file: File) {
    const arrayBuffer = await file.arrayBuffer()
    for (let i = 0; i < Math.ceil(arrayBuffer.byteLength / CHUNK_SIZE); i++) {
      const chunk = arrayBuffer.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
      this.dataChannel.send(chunk)
      UI.incrementBytesTransferred(chunk.byteLength)

      ClientLogger.debug(
        "sent chunk to receiver",
        `chunk.byteLength: ${chunk.byteLength}`
      )
    }
  }
}
