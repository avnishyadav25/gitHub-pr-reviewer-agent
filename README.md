# AI PR Reviewer Agent

An automated GitHub Action that reviews Pull Requests using OpenAI's GPT models. It analyzes code changes for bugs, security vulnerabilities, and style issues, posting comments directly on the PR.

## Features

- **Automated Code Review**: Analyzes git diffs using OpenAI.
- **Security Detection**: Highlights potential security flaws.
- **Line-by-Line Comments**: Posts specific feedback on the relevant lines of code.
- **Configurable**: Support for different OpenAI models and severity filters.

## Usage

Add this action to your workflow file (e.g., `.github/workflows/review.yml`):

```yaml
name: AI PR Reviewer
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v2
      - name: Run AI Reviewer
        uses: ./ # Or use the published action name, e.g., avnishyadav25/github-pr-reviewer-agent@v1
        with:
          openai_key: ${{ secrets.OPENAI_API_KEY }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
          model: 'gpt-4o' # Optional, default is gpt-4o
```

## Inputs

| Input | Description | Required | Default |
|---|---|---|---|
| `openai_key` | Your OpenAI API Key | Yes | - |
| `github_token` | GitHub Token (usually `${{ secrets.GITHUB_TOKEN }}`) | Yes | - |
| `model` | OpenAI Model to use | No | `gpt-4o` |
| `include_severity` | Severities to include | No | `info,warning,critical` |

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the project:
   ```bash
   npm run build
   ```
