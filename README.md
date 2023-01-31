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
| `installation_id` | ID of the app installation to authenticate for | **No** | This can be retrieved from the URL of the installation setting page for a GitHub organization |

## Outputs

| Name | Description | Notes |
|---|---|---|
| `token` | The generated JSON Web Token (JWT) | Always set |
| `installation_access_token` | The generated installation access token | Only set if the `installation_id` input is passed |
| `installation_access_token_expires_at` | The expiration of the installation access | Only set if the `installation_id` input is passed |

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
          # The application installation ID
          installation_id: '1234'

      # Use ${{ steps.generate_github_app_token.outputs.token }} or ${{ steps.generate_github_app_token.outputs.installation_access_token }} in other steps as needed
```

## License Notice

Copyright 2023 Fox Corportation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.