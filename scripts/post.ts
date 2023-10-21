import { context } from "@actions/github";
import { Octokit } from "@octokit/rest";
import { env } from "node:process";
import * as data from "./data";

type EventName = "issue_comment" | "pull_request_target";
type Issue_Comment = "created" | "deleted" | "edited";
type Pull_Request_Target =
  | "assigned"
  | "unassigned"
  | "labeled"
  | "unlabeled"
  | "opened"
  | "closed"
  | "reopened"
  | "synchronize"
  | "converted_to_draft"
  | "ready_for_review"
  | "locked"
  | "unlocked"
  | "review_requested"
  | "review_request_removed"
  | "auto_merge_enabled"
  | "auto_merge_disabled"
  | "edited";

interface Special_operate {
  [Key: string]: {
    regex: RegExp;
    conditions: EventName[];
    permission: data.permissions;
    operate: (number: number, owner: string, repo: string) => Promise<any>;
  };
}

const api = new Octokit({
  auth: env.POST_TOKEN,
});

const special_operate: Special_operate = {
  close_issue_pr: {
    regex: /[Cc]lose[\s-][Ww]ith[\s-][Rr]eason:/,
    conditions: ["issue_comment"],
    permission: 0,
    operate: async (number: number, owner: string, repo: string) => {
      return await api.rest.issues.update({
        repo: repo,
        owner: owner,
        issue_number: number,
        state: "closed",
      });
    },
  },
};

export async function approved(pr_number: number, owner: string, repo: string) {
  const labelToAdd: string[] = [];
  const reviews = (
    await api.rest.pulls.listReviews({
      owner: owner,
      repo: repo,
      pull_number: pr_number,
    })
  ).data;
  reviews.forEach((review) => {
    switch (review.state) {
      case "APPROVED":
        data.members.forEach((member) => {
          if (member.permission >= 1 && review.user.login === member.login) {
            labelToAdd.push("Administrator-Approved");
          }
          if (member.permission === 0 && review.user.login === member.login) {
            labelToAdd.push("Member-Approved");
          }
        });
        break;
    }
  });
  // Apply Changes
  if (labelToAdd.length > 0) {
    await api.rest.issues.addLabels({
      owner: owner,
      repo: repo,
      issue_number: pr_number,
      labels: labelToAdd,
    });
  }
}

export async function issue_comment(
  action: string,
  repo: string,
  owner: string,
  pr_number: number,
  comment_id: number,
) {
  const labelToRemove: string[] = [];
  const labelToAdd: string[] = [];
  const eventName = context.eventName as EventName;
  let labels = (
    await api.rest.issues.listLabelsOnIssue({
      repo: repo,
      owner: owner,
      issue_number: pr_number,
    })
  ).data.map((label) => label.name);
  let res = (
    await api.rest.issues.getComment({
      repo: repo,
      owner: owner,
      comment_id: comment_id,
    })
  ).data;
  switch (action as Issue_Comment) {
    case "created":
      Object.keys(data.labels_regex_add).forEach((key) => {
        if (
          res.body.match(data.labels_regex_add[key].regex) &&
          data.members.filter((obj) => {
            if (
              obj.login === res.user.login &&
              obj.permission >= data.labels_regex_remove[key].permission
            ) {
              return true;
            }
          })
        ) {
          labelToAdd.push(key);
        }
      });
      Object.keys(data.labels_regex_remove).forEach((key) => {
        if (
          res.body.match(data.labels_regex_remove[key].regex) &&
          data.members.filter((obj) => {
            if (
              obj.login === res.user.login &&
              obj.permission >= data.labels_regex_remove[key].permission
            ) {
              return true;
            }
          })
        ) {
          labelToRemove.push(key);
        }
      });
      Object.values(special_operate).forEach(async (value) => {
        if (
          res.body.match(value.regex) &&
          value.conditions.includes(eventName) &&
          data.members.filter((obj) => {
            if (
              obj.login === res.user.login &&
              obj.permission >= value.permission
            ) {
              return true;
            }
          })
        ) {
          await value.operate(pr_number, owner, repo);
        }
      });
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

export async function pull_request_target(
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
  switch (action as Pull_Request_Target) {
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
  const eventName = context.eventName as EventName;
  switch (eventName) {
    case "pull_request_target":
      await pull_request_target(
        context.payload.action,
        context.repo.repo,
        context.repo.owner,
        context.payload.pull_request.number,
      );
      await approved(
        context.payload.pull_request.number,
        context.repo.owner,
        context.repo.repo,
      );
      break;
    case "issue_comment":
      await issue_comment(
        context.payload.action,
        context.repo.repo,
        context.repo.owner,
        context.payload.pull_request?.number | context.payload.issue?.number,
        context.payload.comment.id,
      );
  }
})();
