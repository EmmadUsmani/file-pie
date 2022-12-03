export class Logger {
  static _showDebugLogs = false

  static init({ showDebugLogs }: { showDebugLogs?: boolean }) {
    this._showDebugLogs = showDebugLogs ?? false
  }

  static log(...logs: string[]): void {
    const log = this._formatLogs(...logs)
    if (log) {
      console.log(log)
    }
  }

  static debug(...logs: string[]): void {
    const log = this._formatLogs(...logs)
    if (log && this._showDebugLogs) {
      console.debug(log)
    }
  }

  static error(err: Error): void {
    console.error(err)
  }

  static _formatLogs(...logs: string[]): string | undefined {
    if (!logs || logs.length < 1) {
      return
    }
    let output = logs[0]
    for (const log of logs.slice(1)) {
      output += `\n${log}`
    }
    return output
  }
}
