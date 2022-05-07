// TODO: rename to caps case
export const rtcConfig: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  // TODO: try prefetching with iceCandidatePoolSize
}
/**
 * Safest chunk size for cross browser support.
 * @see https://lgrahl.de/articles/demystifying-webrtc-dc-size-limit.html
 */
export const CHUNK_SIZE = 16384
