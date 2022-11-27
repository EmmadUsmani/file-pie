import { ErrorHandler } from "../shared"

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
