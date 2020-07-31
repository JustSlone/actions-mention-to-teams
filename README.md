# Send a Github mention to custom Teams / Flow endpoint mention

This action sends mention to a custom Teams / Flow endpoint when someone in the repo has been mentioned.

## Credit

This is action is forked from and heavily based on [actions-mention-to-slack](https://github.com/abeyuya/actions-mention-to-slack/) by @abeyuya. Nice work!

## Feature

- Send mention to endpoint if you have been mentioned
  - issue
  - pull request
- Send notification to endpoint if you have been requested to review.

## Inputs

| Name | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| teams-webhook-url | Yes | Null | Teams/Flow custom endpoint to notify. |
| run-id | No | Null | Used for the link in the error message when an error occurs. |

## Example usage

.github/workflows/mention-to-teams.yml

```yml
on:
  issues:
    types: [opened, edited]
  issue_comment:
    types: [created, edited]
  pull_request:
    types: [opened, edited, review_requested]
  pull_request_review:
    types: [submitted]
  pull_request_review_comment:
    types: [created, edited]

jobs:
  mention-to-teams:
    runs-on: ubuntu-latest
    steps:
      - name: Run
        uses: JustSlone/actions-mention-to-teams@v1
        with:          
          teams-webhook-url: ${{ secrets.TEAMS_WEBHOOK_URL }}
          run-id: ${{ github.run_id }}     
```

## Development

### build dist/index.js

```
$ npm run build
```
