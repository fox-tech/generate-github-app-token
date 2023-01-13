import {MOCK_PRIVATE_KEY_BASE64} from './mockKeys'

process.stdout.write = jest.fn()
process.env.INPUT_APPLICATION_PRIVATE_KEY = MOCK_PRIVATE_KEY_BASE64
process.env.INPUT_APPLICATION_ID = '1'

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(jest.fn())
  jest.spyOn(console, 'error').mockImplementation(jest.fn())
})

afterAll(() => {
  jest.resetAllMocks()
  jest.restoreAllMocks()
})
