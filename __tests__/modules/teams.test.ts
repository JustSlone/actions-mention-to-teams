import {
  buildPrReviewRequestedMention,
  buildTeamsNormalMention,
  buildTeamsErrorMessage,
} from "../../src/modules/teams";

describe("modules/teams", () => {

  describe("buildPrReviewRequestedMention", () => {
    it("should include all info", () => {
      const result = buildPrReviewRequestedMention(
        "requestedGithubUsername",
        "title",
        "link",
        "requestor_github_username",
      );
      
      expect(result.headline.includes("title")).toEqual(true);
      expect(result.mentions.includes("requestedGithubUsername")).toEqual(true);
      expect(result.message.includes("[title](link)")).toEqual(true);
      expect(result.message.includes("requestor_github_username")).toEqual(true);      
      expect(result.summary.includes("New PR Review Request")).toEqual(true);
      expect(result.summary.includes("requestor_github_username")).toEqual(true);
    });
  });

  describe("buildTeamsNormalMention", () => {
    it("should include all info", () => {
      const result = buildTeamsNormalMention(
        ["teamsUser1"],
        "title",
        "link",
        "Test Message",
        "sender_github_username"
      );
      
      expect(result.headline.includes("title")).toEqual(true);
      expect(result.mentions.includes("teamsUser1")).toEqual(true);
      expect(result.message.includes("[title](link)")).toEqual(true);
      expect(result.message.includes("sender_github_username")).toEqual(true);
      expect(result.message.includes("Test Message")).toEqual(true);      
      expect(result.summary.includes("New mention")).toEqual(true);
      expect(result.summary.includes("sender_github_username")).toEqual(true);
    });
  });

  describe("buildTeamsErrorMessage", () => {
    it("should include all info", () => {
      const e = new Error("dummy error");
      const result = buildTeamsErrorMessage(e);

      expect(result.includes("dummy error")).toEqual(true);
    });
  });
});
