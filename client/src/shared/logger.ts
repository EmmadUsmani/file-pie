import { Logger } from "@webrtc-file-transfer/shared"

export class ClientLogger extends Logger {
  static error(err: Error): void {
    if (this._showDebugLogs) {
      console.error(err)
    } else {
      // TODO: in prod log to sentry or similar service
    }
  }
}
