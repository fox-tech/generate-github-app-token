import * as octokitAuthApp from '@octokit/auth-app'
import {run} from '../index'
import * as utils from '../utils'
import constants from '../constants'
const {core} = constants

let mockFailAndExit: jest.SpyInstance
let mockSetOutput: jest.SpyInstance

beforeAll(() => {
  mockFailAndExit = jest.spyOn(utils, 'failAndExit').mockImplementation(() => undefined as never)
  mockSetOutput = jest.spyOn(core, 'setOutput')
})

afterAll(() => {
  jest.resetAllMocks()
  jest.restoreAllMocks()
})

describe('The main action function', () => {
  it('Resolves and sets a token output', async () => {
    await expect(run()).resolves.not.toThrow()
    expect(mockSetOutput).toHaveBeenCalledTimes(1)
    expect(mockSetOutput.mock.calls[0][0]).toBe('token')
    expect(mockSetOutput.mock.calls[0][1]).not.toBe('')
    expect(mockFailAndExit).not.toHaveBeenCalled()
  })

  it('Fails when there is an error', async () => {
    jest.spyOn(octokitAuthApp, 'createAppAuth').mockImplementation(() => {
      throw new Error('Error with createAppAuth')
    })
    await expect(run()).rejects.toThrow()
    expect(mockFailAndExit).toHaveBeenCalled()
  })
})
