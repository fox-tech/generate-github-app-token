// General
export const cwd = process.cwd()

// GitHub
export const fullRepoName = process.env.GITHUB_REPOSITORY || 'foxcorp/generate-github-app-token'
export const [owner, repo] = fullRepoName.split('/')

export const apiBaseURL = process.env.GITHUB_API_URL || 'https://api.github.com'
