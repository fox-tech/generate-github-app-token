import constants from './constants'
const {core} = constants

export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

export function failAndExit(errorMessage: string): void {
  core.error(errorMessage)
  core.setFailed(errorMessage)
  process.exit(1)
}
