# Fox Tech Generate GitHub App Token

## Version `1.x`

## Description

A custom GitHub Action to [generate a GitHub app token](https://docs.github.com/en/developers/apps/building-github-apps/authenticating-with-github-apps#authenticating-as-a-github-app).

### Features

- Written in [TypeScript](https://www.typescriptlang.org/)
- Unit test support with [Jest](https://jestjs.io/docs/en/getting-started)
- Code linting support with [ESLint](https://eslint.org/)
- Compiled with [`ncc`](https://github.com/vercel/ncc)

## Inputs

| Name | Description | Required | Notes |
|---|---|---|---|
| `application_private_key` | A base64 encoded string of the [application private key](https://docs.github.com/en/developers/apps/building-github-apps/authenticating-with-github-apps#generating-a-private-key) PEM file | **Yes** | This should be saved as [an encrypted secret](https://docs.github.com/en/actions/security-guides/encrypted-secrets) |
| `application_id` | The GitHub App ID | **Yes** |  |

## Outputs

| Name | Description |
|---|---|
| `token` | The generated JSON Web Token (JWT) |

## Usage Example


```yml
jobs:
  get-temp-token:
    runs-on: ubuntu-latest

    steps:
      - name: Generate GitHub App Token
        id: generate_github_app_token
        uses: foxcorp/generate-github-app-token@v1
        with:
          # A base64 encoded version of the PEM file contents
          application_private_key: ${{ secrets.APPLICATION_PRIVATE_KEY }}

      # Use ${{ steps.generate_github_app_token.outputs.token }} in other steps as needed