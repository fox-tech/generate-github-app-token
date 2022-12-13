import {MOCK_PRIVATE_KEY_BASE64} from './mockKeys'

process.env.INPUT_APPLICATION_PRIVATE_KEY = MOCK_PRIVATE_KEY_BASE64
process.env.INPUT_APPLICATION_ID = '123'
process.stdout.write = jest.fn()

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(jest.fn())
  jest.spyOn(console, 'error').mockImplementation(jest.fn())
})

afterAll(() => {
  jest.restoreAllMocks()
})
