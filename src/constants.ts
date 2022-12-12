/**
 * Imports
 */
// https://github.com/actions/toolkit/tree/main/packages/core
import * as core from '@actions/core'

import {config as dotEnvConfig} from 'dotenv'
dotEnvConfig()

/**
 * Constants and Input/Env Processing
 */

// General
export const cwd = process.cwd()
const areTesting = process.env.NODE_ENV === 'test'

// GitHub
const fullRepoName = process.env.GITHUB_REPOSITORY || 'foxcorp/generate-github-app-token'
const [owner, repo] = fullRepoName.split('/')
let appPrivateKeyInput: string = core.getInput('application_private_key') || ''
let appId: string = core.getInput('application_id') || ''
const isGitHubActions = process.env.GITHUB_ACTIONS || false

if (areTesting) {
  process.env.GITHUB_ACTION = 'true'
}

// Defaults only for testing
if (!isGitHubActions && areTesting) {
  appPrivateKeyInput = process.env.APP_PRIVATE_KEY || ''
  appId = process.env.APP_ID || '123'
}

/**
 * Export
 */
export default {
  fullRepoName,
  core,
  cwd,
  isGitHubActions,
  appPrivateKeyInput,
  apiBaseURL: process.env.GITHUB_API_URL || 'https://api.github.com',
  owner,
  repo,
  appId,
}
