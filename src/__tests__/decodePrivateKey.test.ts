import {Buffer} from 'node:buffer'
import {decodePrivateKey} from '../decodePrivateKey'
import * as utils from '../utils'
import {MOCK_PRIVATE_KEY, MOCK_PRIVATE_KEY_BASE64} from './mockKeys'

let mockFailAndExit: jest.SpyInstance

beforeAll(() => {
  mockFailAndExit = jest.spyOn(utils, 'failAndExit').mockImplementation(() => undefined as never)
})

afterAll(() => {
  jest.resetAllMocks()
  jest.restoreAllMocks()
})

describe('Decode the private key', () => {
  it('Returns the base64 decoded value', () => {
    const decodedKey = decodePrivateKey(MOCK_PRIVATE_KEY_BASE64)
    expect(decodedKey).toBe(MOCK_PRIVATE_KEY)
    expect(mockFailAndExit).not.toHaveBeenCalled()
  })

  it('Fails when the key input is empty', () => {
    decodePrivateKey('')
    expect(mockFailAndExit).toHaveBeenCalled()
  })

  it('Fails when there is an error decoding', () => {
    jest.spyOn(Buffer, 'from').mockImplementation(() => {
      throw new Error('Error with Buffer.from')
    })
    decodePrivateKey('')
    expect(mockFailAndExit).toHaveBeenCalled()
  })
})
