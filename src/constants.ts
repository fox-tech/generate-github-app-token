/**
 * Imports
 */
// https://github.com/actions/toolkit/tree/main/packages/core
import * as core from '@actions/core'

/**
 * Constants and Input/Env Processing
 */

// General
export const cwd = process.cwd()
const areTesting = process.env.NODE_ENV === 'test'

// GitHub
const fullRepoName = process.env.GITHUB_REPOSITORY || 'foxcorp/generate-github-app-token'
const [owner, repo] = fullRepoName.split('/')
const isGitHubActions = 'GITHUB_ACTIONS' in process.env

const appPrivateKeyInput: string = core.getInput('application_private_key') || ''
const appId: string = core.getInput('application_id') || ''

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
  areTesting,
}
