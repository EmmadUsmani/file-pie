import { rtcConfig } from "../shared"

const peerConnection = new RTCPeerConnection(rtcConfig)
// TODO: create dataChannel

// TODO: join socket.io room from link
void peerConnection.createOffer().then((offer) => handleOffer(offer))
async function handleOffer(offer: RTCSessionDescriptionInit) {
  void peerConnection.setRemoteDescription(offer)
  const answer = await peerConnection.createAnswer()
  void peerConnection.setLocalDescription(answer)
  console.log(answer) // TODO: send answer to host in socket.io
}
