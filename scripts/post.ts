import { context } from "@actions/github"
import { Octokit } from '@octokit/rest';
import { env, argv } from "node:process"

const api = new Octokit({
    auth: env.POST_TOKEN
})

async function pull_request(action: string, repo: string, owner: string, pr_number: number) {
    const labelToRemove: string[] = []
    const labelToAdd: string[] = []
    let labels = (await api.rest.issues.listLabelsOnIssue({
        repo: repo,
        owner: owner,
        issue_number: pr_number
    })).data.map(label => label.name)
    switch (action) {
        case 'synchronize':
            labelToRemove.push('Administrator-Approved')
            labelToRemove.push('Member-Approved')
            labelToAdd.push('Review-Needed')
            break
        case 'opened':
            labelToAdd.push('Review-Needed')
            labelToAdd.push('Needs-Triage')
            break
        case 'closed':
            labelToRemove.push('Needs-Author-Feedback')
            labelToRemove.push('Review-Needed')
            labelToRemove.push('Needs-Triage')
            break
        case 'reopened':
            labelToRemove.push('Needs-Author-Feedback')
            labelToAdd.push('Review-Needed')
            break
        case 'review_requested':
            labelToRemove.push('Review-Needed')
            labelToAdd.push('Needs-Author-Feedback')
            break
        case 'review_request_removed':
            labelToRemove.push('Needs-Author-Feedback')
            break
        case 'edited':
            labelToRemove.push('Needs-Author-Feedback')
            labelToAdd.push('Review-Needed')
            break
        case 'converted_to_draft':
            labelToRemove.push('Needs-Author-Feedback')
            labelToRemove.push('Review-Needed')
            labelToAdd.push('WIP')
            break
        case 'ready_for_review':
            labelToAdd.push('Review-Needed')
            labelToRemove.push('Needs-Author-Feedback')
            labelToRemove.push('WIP')
            break
        case 'auto_merge_enabled':
            labelToRemove.push('Merge-Needed')
            break
        default:
            break
    }

    // Apply Changes
    await api.rest.issues.addLabels({
        owner: owner,
        repo: repo,
        issue_number: pr_number,
        labels: labelToAdd
    })
    for (let label of labelToRemove) {
        if (labels.includes(label)) {
            await api.rest.issues.removeLabel({
                owner: owner,
                repo: repo,
                issue_number: pr_number,
                name: label
            })
        }
    }
}

(async () => {
    const { eventName } = context
    switch (eventName) {
        case 'pull_request_target':
            await pull_request(context.action, context.repo.repo, context.repo.owner, context.payload.pull_request.number)
    }
})();