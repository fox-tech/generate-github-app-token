// https://github.com/actions/toolkit/tree/main/packages/core
import * as core from '@actions/core'
// https://github.com/octokit/auth-app.js
import {createAppAuth} from '@octokit/auth-app'

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
    const appPrivateKeyInput: string = core.getInput('application_private_key', {required: true})
    appPrivateKey = decodePrivateKey(appPrivateKeyInput)
  } catch (error) {
    const errorMessage =
      'Something went wrong processing the "application_private_key" input. Please ensure it is a base64 encoded version of the application private key PEM file content.'
    failAndExit(errorMessage, error)
    return Promise.reject(new Error(errorMessage))
  }

  try {
    core.debug('Authorizing the GitHub App')
    const appId: string = core.getInput('application_id', {required: true})
    appAuth = createAppAuth({
      appId,
      privateKey: appPrivateKey,
    })

    const authentication = await appAuth({type: 'app'})
    core.debug('Successfully authenticated')
    token = authentication.token

    core.debug('Setting the generated JSON web token as a secret')
    core.setSecret(token)

    core.info('Successfully generated a JSON web token! It has been saved as the output "token"')
    core.setOutput('token', token)
  } catch (error) {
    const errorMessage = 'Something went wrong authorizing the GitHub App.'
    failAndExit(errorMessage, error)
    return Promise.reject(new Error(errorMessage))
  }

  try {
    const installationId: string = core.getInput('installation_id', {required: false}) || ''
    if (installationId !== '') {
      core.debug(`Installation ID ${installationId} received, attempting to authenticate as an installation`)
      // Retrieve installation access token
      const installationAuthentication = await appAuth({
        type: 'installation',
        installationId,
      })

      core.debug('Setting the generated installation token as a secret')
      core.setSecret(installationAuthentication.token)

      core.info('Successfully generated an installation token! It has been saved as the output "installation_token"')
      core.setOutput('installation_token', installationAuthentication.token)
      core.setOutput('installation_token_expires_at', installationAuthentication.expiresAt)
    }
  } catch (error) {
    const errorMessage = `Something went wrong authenticating as an installation. Please ensure the app is installed and the "installation_token" input is correct.\n`
    failAndExit(errorMessage, error)
    return Promise.reject(new Error(errorMessage))
  }

  return Promise.resolve()
}

run()
