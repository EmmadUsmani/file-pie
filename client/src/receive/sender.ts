import { RTC_CONFIG } from "@shared/constants"
import { ClientLogger } from "@shared/logger"
import { DownloadCompleteMessage, FileMetadataMessage } from "@shared/messages"

import { ReceiveServer } from "./server"
import { UI } from "./ui"

export class Sender {
  static _peerConnection: RTCPeerConnection | undefined = undefined
  static _dataChannel: RTCDataChannel | undefined = undefined
  static _metadata: FileMetadataMessage["content"] | undefined = undefined
  static _chunks: Array<ArrayBuffer> | undefined = undefined

  static init(): void {
    this._peerConnection = new RTCPeerConnection(RTC_CONFIG)
    this.getPeerConnection().onicecandidate = (event) =>
      this._onIceCandidate(event)
    this.getPeerConnection().ondatachannel = (event) =>
      this._onDataChannel(event)
  }

  static getPeerConnection(): RTCPeerConnection {
    if (!this._peerConnection) {
      throw Error("Peer connection has not been initialized.")
    }
    return this._peerConnection
  }

  static getDataChannel(): RTCDataChannel {
    if (!this._dataChannel) {
      throw Error("Data channel has not been initialized.")
    }
    return this._dataChannel
  }

  static getMetadata(): FileMetadataMessage["content"] {
    if (!this._metadata) {
      throw Error("Metadata has not been initialized.")
    }
    return this._metadata
  }

  static getChunks(): Array<ArrayBuffer> {
    if (!this._chunks) {
      throw Error("Chunks have not been initialized.")
    }
    return this._chunks
  }

  static _onIceCandidate(event: RTCPeerConnectionIceEvent): void {
    if (event.candidate) {
      ReceiveServer.sendIceCandidate(event.candidate)
    }
  }

  static _onDataChannel(event: RTCDataChannelEvent): void {
    this._dataChannel = event.channel
    this._chunks = []

    this.getDataChannel().onmessage = (event) => {
      if (typeof event.data === "string") {
        this._handleFileMetadataMessage(event.data)
      } else {
        this._handleChunk(event.data)
      }
    }
  }

  static _handleFileMetadataMessage(data: string): void {
    try {
      this._metadata = FileMetadataMessage.parse(data).content
      UI.displayFileMetadata()
    } catch (error) {
      console.error("Error parsing metadata")
    } finally {
      ClientLogger.debug(
        "received FileMetadata message from sender",
        `metadata: ${JSON.stringify(this.getMetadata())}`
      )
    }
  }

  static _handleChunk(data: ArrayBuffer): void {
    this.getChunks().push(data)
    UI.updateDownloadProgress()

    ClientLogger.debug("received chunk from sender")
  }

  static async accpetOfferAndCreateAnswer(
    offer: RTCSessionDescriptionInit
  ): Promise<RTCSessionDescriptionInit> {
    void Sender.getPeerConnection().setRemoteDescription(offer)
    const answer = await Sender.getPeerConnection().createAnswer()
    void Sender.getPeerConnection().setLocalDescription(answer)
    return answer
  }

  static sendDownloadCompleteMessage(): void {
    this.getDataChannel().send(new DownloadCompleteMessage().serialize())
  }
}
