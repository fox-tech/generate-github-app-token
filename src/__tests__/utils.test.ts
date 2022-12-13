import constants from '../constants'
const {core} = constants
import {wait, failAndExit} from '../utils'

let mockExit: jest.SpyInstance
let mockCoreError: jest.SpyInstance
let mockCoreFailed: jest.SpyInstance

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mockExit = jest.spyOn(process, 'exit').mockImplementation((_code?: number) => undefined as never)
  mockCoreError = jest.spyOn(core, 'error')
  mockCoreFailed = jest.spyOn(core, 'error')
})

afterAll(() => {
  jest.resetAllMocks()
  jest.restoreAllMocks()
})

describe('Verify failAndExit', () => {
  const errorMessage = 'Something went wrong!'
  it('Fails and exits', () => {
    failAndExit(errorMessage)
    expect(mockCoreError).toHaveBeenCalledWith(errorMessage)
    expect(mockCoreFailed).toHaveBeenCalledWith(errorMessage)
    expect(mockExit).toHaveBeenCalledWith(1)
  })
})

describe('Verify the ability to wait', () => {
  it('Can wait 10 ms', async () => {
    const currentTimestamp = Date.now()
    const waitTime = 10
    await expect(wait(waitTime)).resolves.not.toThrow()
    expect(Date.now()).toBeGreaterThanOrEqual(currentTimestamp + waitTime)
  })
})
