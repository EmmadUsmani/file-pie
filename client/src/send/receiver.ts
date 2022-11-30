import { ClientID } from "@webrtc-file-transfer/shared"

import { FileMetadataMessage, rtcConfig, CHUNK_SIZE } from "@shared/."

import { parseDownloadCompleteMessage } from "./parse"
import { SendServer } from "./server"
import { UI } from "./ui"

export class Receivers {
  // TODO: maybe use Record type instead
  static receivers: { [key: ClientID]: Receiver } = {}

  static addReceiver(receiverID: ClientID) {
    this.receivers[receiverID] = new Receiver(receiverID)
  }

  static removeReceiver(receiverID: ClientID) {
    this.receivers[receiverID].destructor()
    delete this.receivers[receiverID]
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
    void this.sendOffer()
  }

  initListeners() {
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        SendServer.sendIceCandidate(event.candidate, this.receiverID)
      }
    }

    this.dataChannel.onopen = () => {
      // TODO: should we really call UI here? maybe store a file pointer
      // and call this.filePtr.current
      const file = UI.getFile()
      /* TODO: Defining the type field to be "file_metadata" and having
      to manually write that here seems like an antipattern. Should there
      be a class so the constructor can do that instead of doing it here? */
      const metadataMessage: FileMetadataMessage = {
        type: "file_metadata",
        content: {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
        },
      }
      this.dataChannel.send(JSON.stringify(metadataMessage))
      void this._sendFile(file)
    }

    this.dataChannel.onmessage = (event) => {
      if (typeof event.data === "string") {
        try {
          parseDownloadCompleteMessage(event.data)
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

  // TODO (prefix with _ or use ES7? private method), also add void type
  async sendOffer() {
    const offer = await this.peerConnection.createOffer()
    void this.peerConnection.setLocalDescription(offer)
    SendServer.sendOffer(offer, this.receiverID)
  }

  acceptAnswer(answer: RTCSessionDescriptionInit) {
    void this.peerConnection.setRemoteDescription(answer)
  }

  addIceCandidate(iceCandidate: RTCIceCandidate) {
    void this.peerConnection.addIceCandidate(iceCandidate)
  }

  async _sendFile(file: File) {
    const arrayBuffer = await file.arrayBuffer()
    for (let i = 0; i < Math.ceil(arrayBuffer.byteLength / CHUNK_SIZE); i++) {
      const chunk = arrayBuffer.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
      this.dataChannel.send(chunk)
      UI.incrementBytesTransferred(chunk.byteLength)
    }
  }
}
