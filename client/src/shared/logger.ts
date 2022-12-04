import { Logger } from "@file-pie/shared"

/**
 * Singleton for logging output in both clients (send and receive).
 */
export class ClientLogger extends Logger {
  static error(err: Error): void {
    if (this._showDebugLogs) {
      console.error(err)
    } else {
      // TODO: in prod log to sentry or similar service
    }
  }
}
