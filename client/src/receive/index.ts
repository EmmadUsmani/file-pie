import { rtcConfig } from "../shared"

import { ReceiveServer } from "./server"
import { getRoomID } from "./util"

const peerConnection = new RTCPeerConnection(rtcConfig)
// TODO: create dataChannel

// Join room in server
ReceiveServer.joinRoom(getRoomID())

void peerConnection.createOffer().then((offer) => handleOffer(offer))
async function handleOffer(offer: RTCSessionDescriptionInit) {
  void peerConnection.setRemoteDescription(offer)
  const answer = await peerConnection.createAnswer()
  void peerConnection.setLocalDescription(answer)
  console.log(answer) // TODO: send answer to host in socket.io
}
