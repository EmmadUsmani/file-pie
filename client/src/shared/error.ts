export class ErrorHandler {
  static _contentElem = document.querySelector<HTMLDivElement>("#content")
  static _errorElem = document.querySelector<HTMLDivElement>("#error")

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

  static init(): void {
    window.addEventListener("error", () => {
      this.getContentElem().style.display = "none"
      this.getErrorElem().style.display = "flex"
    })
  }
}
