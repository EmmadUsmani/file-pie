import { ErrorHandler } from "@shared/."

/**
 * Singleton error handler with specific methods for common error types.
 * Specific to the receive client.
 *
 * @extends ErrorHandler
 */
export class ReceiveErrorHandler extends ErrorHandler {
  static displayRoomNotFoundError(): void {
    this.displayErrorMessage(
      "Uh oh! The room was not found.",
      "Confirm the link is correct."
    )
  }

  static displaySenderLeftError(): void {
    this.displayErrorMessage(
      "Connection to sender closed.",
      "Confirm the sender has File Pie open."
    )
  }
}
