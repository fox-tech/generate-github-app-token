// https://github.com/actions/toolkit/tree/main/packages/core
import * as core from '@actions/core'

export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function failAndExit(message: string, error?: any): void {
  let errorMessage = message
  if (error instanceof Error) {
    errorMessage += `\n${error.message}`
  }
  core.error(errorMessage)
  core.setFailed(errorMessage)
  process.exit(1)
}
