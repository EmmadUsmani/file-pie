export const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
}
/**
 * Safest chunk size for cross browser support.
 *
 * @see https://lgrahl.de/articles/demystifying-webrtc-dc-size-limit.html
 */
export const CHUNK_SIZE = 16384
