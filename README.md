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

## Power Automate template
The backend for this action is written with Power Automate. 
Grab the [Microsoft Power Automate template here](https://github.com/JustSlone/actions-mention-to-teams/releases/tag/PowerAutomate) and import the file on MS Power Automate: [Import Package](https://preview.flow.microsoft.com/manage/flows/import)

### Setting up Power Automate 
1. When importing the package you'll need to login in to teams to give Power Automate permission to message teams. 
1. Once you setup the Flow, copy URL from the HTTP Endpoint trigger and set it up in your Repo secrets (e.g. `TEAMS_WEBHOOK_URL`)
1. Then you'll need to update the GitHub to Teams mapping table (see below)
![GitHub To Teams mapping](https://i.imgur.com/gwQEMal.png)


## Development

1. install deps: `$ yarn`
2. build dist/index.js: `$ yarn run build`
