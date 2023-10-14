import { expect, it, describe } from "vitest";
import { labels_regex } from "./post";

describe("should match correct adding regex", () => {
  it("should match input with basic", () => {
    Object.keys(labels_regex.add).forEach((keys) => {
      expect(`[Policy] ${keys}`).toMatch(labels_regex.add[keys]);
    });
    Object.keys(labels_regex.add).forEach((keys) => {
      expect(`[Policy] ${keys}`).toMatch(labels_regex.add[keys]);
    });
  });
  it("should match input without '-'", () => {
    Object.keys(labels_regex.add).forEach((keys) => {
      expect(`[Policy] ${keys.replaceAll("-", " ")}`).toMatch(
        labels_regex.add[keys],
      );
    });
    Object.keys(labels_regex.add).forEach((keys) => {
      expect(`[policy] ${keys}`.replaceAll("-", " ")).toMatch(
        labels_regex.add[keys],
      );
    });
  });
  it("should match input with lowercase", (keys) => {
    Object.keys(labels_regex.add).forEach((keys) => {
      expect(`[Policy] ${keys.replaceAll("-", " ")}`.toLowerCase()).toMatch(
        labels_regex.add[keys],
      );
    });
  });
});
describe("should match correct removing regex", () => {
  it("should match input with basic", () => {
    Object.keys(labels_regex.remove).forEach((keys) => {
      expect(`[Remove] ${keys}`).toMatch(labels_regex.remove[keys]);
    });
    Object.keys(labels_regex.remove).forEach((keys) => {
      expect(`[remove] ${keys}`).toMatch(labels_regex.remove[keys]);
    });
  });
  it("should match input without '-'", () => {
    Object.keys(labels_regex.remove).forEach((keys) => {
      expect(`[Remove] ${keys.replaceAll("-", " ")}`).toMatch(
        labels_regex.remove[keys],
      );
    });
    Object.keys(labels_regex.remove).forEach((keys) => {
      expect(`[remove] ${keys}`.replaceAll("-", " ")).toMatch(
        labels_regex.remove[keys],
      );
    });
  });
  it("should match input with lowercase", () => {
    Object.keys(labels_regex.remove).forEach((keys) => {
      expect(`[Remove] ${keys.replaceAll("-", " ")}`.toLowerCase()).toMatch(
        labels_regex.remove[keys],
      );
    });
  });
});

describe("should generate correct label to add or remove", () => {
  const body = `
    This pull request has some issue that needs to be resolved: [Policy] Blocking-issue
    This pull requests won't be blocked to merge by [remove] Do Not Merge
    [Remove] needs modify
    This isn't a breaking change, I'll remove it by [remove] breaking change
    [policy] project file
    `;
  it("should generate add label", () => {
    const labelToAdd = [];
    Object.keys(labels_regex.add).forEach((keys) => {
      if (body.match(labels_regex.add[keys])) {
        labelToAdd.push(keys);
      }
    });
    expect(labelToAdd).toEqual(["Blocking-issue", "Project-File"]);
  });
  it("should generate remove label", () => {
    const labelToRemove = [];
    Object.keys(labels_regex.remove).forEach((keys) => {
      if (body.match(labels_regex.remove[keys])) {
        labelToRemove.push(keys);
      }
    });
    expect(labelToRemove).toEqual([
      "Breaking-Change",
      "Do-Not-Merge",
      "Needs-Modify",
    ]);
  });
});
