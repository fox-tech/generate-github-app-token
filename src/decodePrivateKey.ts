import {Buffer} from 'node:buffer'
import constants from './constants'
import {failAndExit} from './utils'
const {core} = constants

export function decodePrivateKey(privateKeyBase64: string): string {
  let appPrivateKey = ''
  // An application private key is required
  if (privateKeyBase64 === '' || privateKeyBase64.length === 0) {
    failAndExit('The "application_private_key" input cannot be empty')
  }

  try {
    core.debug('Base64 decoding the private key')
    appPrivateKey = Buffer.from(privateKeyBase64, 'base64').toString('utf8')
    core.debug('Setting the decoded private key as a secret')
    core.setSecret(appPrivateKey)
  } catch (err) {
    failAndExit(
      'Something went wrong processing the "application_private_key" input. Please ensure it is a base64 encoded version of the application private key PEM file content.',
    )
  }

  return appPrivateKey
}
