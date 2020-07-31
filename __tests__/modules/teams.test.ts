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
        "Test Message",
        "sender_github_username"
      );
      
      expect(result.headline.includes("title")).toEqual(true);
      expect(result.mentions.includes("teamsUser1")).toEqual(true);
      expect(result.message.includes("[title](link)")).toEqual(true);
      expect(result.message.includes("sender_github_username")).toEqual(true);
      expect(result.message.includes("Test Message")).toEqual(true);      
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
