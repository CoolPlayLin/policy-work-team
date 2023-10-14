import { context } from "@actions/github";
import { Octokit } from "@octokit/rest";
import { env } from "node:process";

const api = new Octokit({
  auth: env.POST_TOKEN,
});
const Administrator = [
  "coolplaylin",
  "coolplaylinbot",
  "jsrcode",
  "liulyxandy-codemao",
  "fufu3939",
];
const Member = [
  "quiet-star-gazing",
  "pangguanzhejers",
  "QiKeZhiCao",
  "svipwing",
  "DIAG5",
  "CHEN-EXE",
];
const Labels = [
  "Administrator-Approved",
  "Announcement",
  "Blocking-issue",
  "Breaking-Change",
  "bug",
  "Command-Execute",
  "Commissions",
  "Commissions-Member",
  "Commissions-Policy",
  "dependency",
  "Do-Not-Merge",
  "documentation",
  "duplicate",
  "enhancement",
  "good first issue",
  "help wanted",
  "invalid",
  "Member-Adding",
  "Member-Approved",
  "Merge-Needed",
  "Needs-All-Approval",
  "Needs-Author-Feedback",
  "Needs-Modify",
  "Needs-Triage",
  "Policy-Accepted",
  "Policy-Modify",
  "Policy-Rejected",
  "Policy-Remove",
  "Policy-Request",
  "Project-File",
];

export async function pull_request_review_comment(
  action: string,
  repo: string,
  owner: string,
  pr_number: number,
  comment_id: number,
) {
  const labelToRemove: string[] = [];
  const labelToAdd: string[] = [];
  let labels = (
    await api.rest.issues.listLabelsOnIssue({
      repo: repo,
      owner: owner,
      issue_number: pr_number,
    })
  ).data.map((label) => label.name);
  switch (action) {
    case "created":
      const review = await api.rest.pulls.getReview({
        repo: repo,
        owner: owner,
        pull_number: pr_number,
        review_id: comment_id,
      });
      switch (review.data.state) {
        case "approved":
          if (Administrator.includes(review.data.user.login)) {
            labelToAdd.push("Administrator-Approved");
          } else if (Member.includes(review.data.user.login)) {
            labelToAdd.push("Member-Approved");
          }
          break;
      }
  }
  return {
    labelToAdd: labelToAdd,
    labelToRemove: labelToRemove,
  };
}

export async function pull_request(
  action: string,
  repo: string,
  owner: string,
  pr_number: number,
) {
  const labelToRemove: string[] = [];
  const labelToAdd: string[] = [];
  let labels = (
    await api.rest.issues.listLabelsOnIssue({
      repo: repo,
      owner: owner,
      issue_number: pr_number,
    })
  ).data.map((label) => label.name);
  switch (action) {
    case "synchronize":
      labelToRemove.push("Administrator-Approved");
      labelToRemove.push("Member-Approved");
      labelToAdd.push("Review-Needed");
      break;
    case "opened":
      labelToAdd.push("Review-Needed");
      labelToAdd.push("Needs-Triage");
      break;
    case "closed":
      labelToRemove.push("Needs-Author-Feedback");
      labelToRemove.push("Review-Needed");
      labelToRemove.push("Needs-Triage");
      break;
    case "reopened":
      labelToRemove.push("Needs-Author-Feedback");
      labelToAdd.push("Review-Needed");
      break;
    case "review_requested":
      labelToRemove.push("Review-Needed");
      labelToAdd.push("Needs-Author-Feedback");
      break;
    case "review_request_removed":
      labelToRemove.push("Needs-Author-Feedback");
      break;
    case "edited":
      labelToRemove.push("Needs-Author-Feedback");
      labelToAdd.push("Review-Needed");
      break;
    case "converted_to_draft":
      labelToRemove.push("Needs-Author-Feedback");
      labelToRemove.push("Review-Needed");
      labelToAdd.push("WIP");
      break;
    case "ready_for_review":
      labelToAdd.push("Review-Needed");
      labelToRemove.push("Needs-Author-Feedback");
      labelToRemove.push("WIP");
      break;
    case "auto_merge_enabled":
      labelToRemove.push("Merge-Needed");
      break;
    default:
      break;
  }

  // Apply Changes
  if (labelToAdd.length > 0) {
    await api.rest.issues.addLabels({
      owner: owner,
      repo: repo,
      issue_number: pr_number,
      labels: labelToAdd,
    });
  }
  for (let label of labelToRemove) {
    if (labels.includes(label)) {
      await api.rest.issues.removeLabel({
        owner: owner,
        repo: repo,
        issue_number: pr_number,
        name: label,
      });
    }
  }

  return {
    labelToAdd: labelToAdd,
    labelToRemove: labelToRemove,
  };
}

(async () => {
  const { eventName } = context;
  switch (eventName) {
    case "pull_request_target":
      const result = await pull_request(
        context.action,
        context.repo.repo,
        context.repo.owner,
        context.payload.pull_request.number,
      );
      console.log("Post Overview");
      console.log(`Labels have added: ${result.labelToAdd.toString()}`);
      console.log(`Labels have removed: ${result.labelToRemove.toString()}`);
  }
})();
