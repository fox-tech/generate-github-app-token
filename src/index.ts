import {createAppAuth} from '@octokit/auth-app'

import constants from './constants'
const {core, appPrivateKeyInput, appId} = constants
import {failAndExit} from './utils'
import {decodePrivateKey} from './decodePrivateKey'

// https://github.com/JasonEtco/actions-toolkit
export async function run(): Promise<void> {
  let token = ''
  let appPrivateKey: string
  let appAuth

  core.info(`Attempting to generate a GitHub app token from the private key`)

  try {
    // Get the app private key
    appPrivateKey = decodePrivateKey(appPrivateKeyInput)

    core.debug('Authorizing the GitHub App')
    appAuth = createAppAuth({
      appId,
      privateKey: appPrivateKey,
    })

    const authentication = await appAuth({type: 'app'})
    core.debug('Successfully authenticated')
    token = authentication.token

    core.debug('Setting the generated token as a secret')
    core.setSecret(token)

    core.info('Successfully generated a token! It has been saved as the output "token"')
    core.setOutput('token', token)
    return Promise.resolve()
  } catch (error) {
    let errorMessage =
      'Something went wrong processing the "application_private_key" input. Please ensure it is a base64 encoded version of the application private key PEM file content.'
    if (error instanceof Error) {
      errorMessage += error.message
    }
    failAndExit(errorMessage)
    return Promise.reject(new Error(errorMessage))
  }
}

run()
