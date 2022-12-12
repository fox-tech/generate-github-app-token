import constants from './constants'
import {failAndExit} from './utils'
import {decodePrivateKey} from './decodePrivateKey'
const {core, appPrivateKeyInput} = constants

// https://github.com/JasonEtco/actions-toolkit
async function run(): Promise<void> {
  let token = ''
  let appPrivateKey: string

  core.info(`Attempting to generate a GitHub app token from the private key`)

  try {
    appPrivateKey = decodePrivateKey(appPrivateKeyInput)
  } catch (err) {
    failAndExit(
      'Something went wrong processing the "application_private_key" input. Please ensure it is a base64 encoded version of the application private key PEM file content.',
    )
  }

  core.debug('Setting the generated token as a secret')
  core.setSecret(token)

  core.info('Successfully generated a token! It has been saved as the output "token"')
  core.setOutput('token', '')
}

run()
