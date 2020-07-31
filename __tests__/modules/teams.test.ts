import {
  buildTeamsPostMessage,
  buildTeamsErrorMessage,
} from "../../src/modules/teams";

describe("modules/teams", () => {
  describe("buildTeamsPostMessage", () => {
    it("should include all info", () => {
      const result = buildTeamsPostMessage(
        ["teamsUser1"],
        "title",
        "link",
        "message",
        "sender_github_username"
      );
      
      expect(result.headline.includes("title")).toEqual(true);
      expect(result.mentions.includes("teamsUser1")).toEqual(true);
      expect(result.message.includes("@teamsUser1 You been mentioned at [title](link) by sender_github_username\n\n> ⁣⁣⁣⁣⁣⁣‎‎‎‎message")).toEqual(true);
      expect(result.summary.includes("New mention!")).toEqual(true);
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
