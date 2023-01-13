// https://github.com/actions/toolkit/tree/main/packages/core
import * as core from '@actions/core'
// https://github.com/octokit/auth-app.js
import * as octokitAuthApp from '@octokit/auth-app'
// https://github.com/nock/nock
import nock from 'nock'

import {run} from '../index'
import * as utils from '../utils'
import * as decodePrivateKeyImport from '../decodePrivateKey'
import {apiBaseURL} from '../constants'

let mockFailAndExit: jest.SpyInstance
let mockSetOutput: jest.SpyInstance
let mockDecodePrivateKey: jest.SpyInstance

beforeEach(() => {
  delete process.env.INPUT_INSTALLATION_ID
})

beforeAll(() => {
  mockFailAndExit = jest.spyOn(utils, 'failAndExit').mockImplementation(() => undefined as never)
  mockSetOutput = jest.spyOn(core, 'setOutput')
  mockDecodePrivateKey = jest.spyOn(decodePrivateKeyImport, 'decodePrivateKey')
})

afterEach(() => {
  nock.cleanAll()
})

afterAll(() => {
  jest.resetAllMocks()
  jest.clearAllMocks()
  nock.restore()
})

describe('The main action function', () => {
  it('Resolves and sets a token output', async () => {
    await expect(run()).resolves.not.toThrow()

    expect(mockSetOutput).toHaveBeenCalledTimes(1)
    expect(mockSetOutput.mock.calls[0][0]).toBe('token')
    expect(mockSetOutput.mock.calls[0][1]).not.toBe('')
    expect(mockFailAndExit).not.toHaveBeenCalled()
  })

  it('Fails when there is an error app authentication', async () => {
    const createAppAuthMock = jest.spyOn(octokitAuthApp, 'createAppAuth').mockImplementation(() => {
      throw new Error('Error with createAppAuth')
    })

    await expect(run()).rejects.toThrow()

    createAppAuthMock.mockRestore()

    expect(mockSetOutput).not.toHaveBeenCalled()
    expect(mockFailAndExit).toHaveBeenCalled()
  })

  it('Fails when there is an error decoding the app private key', async () => {
    mockDecodePrivateKey.mockImplementation(() => {
      throw new Error('Error decoding the app private key')
    })

    await expect(run()).rejects.toThrow()

    mockDecodePrivateKey.mockRestore()

    expect(mockSetOutput).not.toHaveBeenCalled()
    expect(mockFailAndExit).toHaveBeenCalled()
  })

  it('Sets an installation token output', async () => {
    const mockInstallationId = '123'
    process.env.INPUT_INSTALLATION_ID = mockInstallationId

    // https://docs.github.com/en/rest/apps/apps#create-an-installation-access-token-for-an-app
    const scope = nock(apiBaseURL)
      .post(`/app/installations/${mockInstallationId}/access_tokens`)
      .once()
      .reply(200, {
        token: 'ghs_16C7e42F292c6912E7710c838347Ae178B4a',
        expires_at: '2099-12-31T23:59:59Z',
        permissions: {
          issues: 'write',
          contents: 'read',
        },
        repositories: [],
      })

    await expect(run()).resolves.not.toThrow()

    scope.done()

    expect(mockSetOutput).toHaveBeenCalledTimes(3)
    // check for JWT output
    expect(mockSetOutput.mock.calls[0][0]).toBe('token')
    expect(mockSetOutput.mock.calls[0][1]).not.toBe('')
    // check for installation token output
    expect(mockSetOutput.mock.calls[1][0]).toBe('installation_token')
    expect(mockSetOutput.mock.calls[1][1]).not.toBe('')
    // check for installation token output
    expect(mockSetOutput.mock.calls[2][0]).toBe('installation_token_expires_at')
    expect(mockSetOutput.mock.calls[2][1]).not.toBe('')
    expect(mockFailAndExit).not.toHaveBeenCalled()
  })

  it('Fails when there is an error getting the installation token', async () => {
    const mockInstallationId = '321'
    process.env.INPUT_INSTALLATION_ID = mockInstallationId

    // https://docs.github.com/en/rest/apps/apps#create-an-installation-access-token-for-an-app
    const scope = nock(apiBaseURL)
      .post(`/app/installations/${mockInstallationId}/access_tokens`)
      .once()
      .reply(404, [
        '1f8b08000000000000031dca310e80200c00c0af98ce06767ee02b0c420512690d6d27e3df25ce770f7414890521c0468a65446d4c0bb12e271b65582173b28ea4bfec36ae79abea2dc1fb69e24ad36a874bdcfd4051783f6121570256000000',
      ])

    await expect(run()).rejects.toThrow()

    scope.done()

    expect(mockFailAndExit).toHaveBeenCalled()
  })
})
