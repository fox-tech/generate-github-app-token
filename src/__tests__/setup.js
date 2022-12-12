global.console = {
  // console.log and console.error are ignored in Jest tests
  log: jest.fn(), 
  error: jest.fn(),

  // Keep native behaviour for other methods
  // use them to print out things in Jest tests
  warn: console.warn,
  info: console.info,
  debug: console.debug,
}

let mockStdout

beforeAll(() => {
  mockStdout = jest.spyOn(process.stdout, 'write').mockImplementation(jest.fn())
})

afterAll(() => {
  mockStdout.mockRestore()
})