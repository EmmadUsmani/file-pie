export abstract class Logger {
  static _showDebugLogs = false

  static init({ showDebugLogs }: { showDebugLogs?: boolean }) {
    if (!showDebugLogs) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      console.debug = () => {}
    } else {
      this._showDebugLogs = showDebugLogs
    }
  }

  static debug(...logs: string[]): void {
    if (!logs || logs.length < 1) {
      return
    }
    let output = logs[0]
    for (const log of logs.slice(1)) {
      output += `\n${log}`
    }
    console.debug(output)
  }

  static error(err: Error): void {
    console.error(err)
  }
}
