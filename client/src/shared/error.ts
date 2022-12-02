import { ClientLogger } from "."

export class ErrorHandler {
  static _contentElem = document.querySelector<HTMLDivElement>("#content")
  static _errorElem = document.querySelector<HTMLDivElement>("#error")
  static _errorSubtitleElem =
    document.querySelector<HTMLParagraphElement>("#error-subtitle")
  static _errorSubtitle2Elem =
    document.querySelector<HTMLParagraphElement>("#error-subtitle-2")
  static _loadingElem = document.querySelector<HTMLDivElement>("#loading")

  static init(): void {
    window.addEventListener("error", (event) => {
      ClientLogger.error(event.error)
      this.displayErrorMessage()
    })
  }

  static getContentElem(): HTMLDivElement {
    if (!this._contentElem) {
      throw Error("Content element does not exist.")
    }
    return this._contentElem
  }

  static getErrorElem(): HTMLDivElement {
    if (!this._errorElem) {
      throw Error("Error element does not exist.")
    }
    return this._errorElem
  }

  static getErrorSubtitleElem(): HTMLDivElement {
    if (!this._errorSubtitleElem) {
      throw Error("Error subtitle element does not exist.")
    }
    return this._errorSubtitleElem
  }

  static getErrorSubtitle2Elem(): HTMLDivElement {
    if (!this._errorSubtitle2Elem) {
      throw Error("Error subtitle element does not exist.")
    }
    return this._errorSubtitle2Elem
  }

  static getLoadingElem(): HTMLDivElement {
    if (!this._loadingElem) {
      throw Error("Loading element does not exist.")
    }
    return this._loadingElem
  }

  static displayErrorMessage(subtitle?: string, subtitle2?: string): void {
    if (subtitle !== undefined) {
      this.getErrorSubtitleElem().innerText = subtitle
    }
    if (subtitle2 !== undefined) {
      this.getErrorSubtitle2Elem().innerText = subtitle2
    }
    this.getLoadingElem().style.display = "none"
    this.getContentElem().style.display = "none"
    this.getErrorElem().style.display = "flex"
  }
}
