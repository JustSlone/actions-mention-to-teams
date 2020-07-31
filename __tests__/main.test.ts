import {
  execPrReviewRequestedMention,
  execNormalMention,
  AllInputs,
} from "../src/main";

describe("src/main", () => {
  describe("execPrReviewRequestedMention", () => {
    const dummyInputs: AllInputs = {            
      teamsWebhookUrl: "dummy_url",      
    };

    it("should call postToTeams if requested_user is listed in mapping", async () => {
      const teamsMock = {
        postToTeams: jest.fn(),
      };

      const dummyPayload = {
        requested_reviewer: {
          login: "github_user_1",
        },
        pull_request: {
          title: "pr_title",
          html_url: "pr_url",
        },
        sender: {
          login: "sender_github_username",
        },
      };

      await execPrReviewRequestedMention(
        dummyPayload as any,
        dummyInputs,        
        teamsMock
      );

      expect(teamsMock.postToTeams.mock.calls.length).toEqual(1);

      const call = teamsMock.postToTeams.mock.calls[0];      
      expect(call[0]).toEqual("dummy_url");
      expect(call[1].mentions.includes("github_user_1")).toEqual(true);
      expect(call[1].message.includes("[pr_title](pr_url)")).toEqual(true);
      expect(call[1].message.includes("@sender_github_username")).toEqual(true);
    });   
  });

  describe("execNormalMention", () => {
    const dummyInputs: AllInputs = {
      teamsWebhookUrl: "dummy_url",
    };

    it("should call postToTeams if requested_user is listed in mapping", async () => {
      const teamsMock = {
        postToTeams: jest.fn(),
      };

      const dummyPayload = {
        action: "submitted",
        review: {
          body: "@github_user_1 LGTM!",
          html_url: "review_comment_url",
        },
        pull_request: {
          title: "pr_title",
        },
        sender: {
          login: "sender_github_username",
        },
      };

      await execNormalMention(
        dummyPayload as any,
        dummyInputs,        
        teamsMock
      );

      expect(teamsMock.postToTeams.mock.calls.length).toEqual(1);

      const call = teamsMock.postToTeams.mock.calls[0];      
      expect(call[0]).toEqual("dummy_url");      
      expect(call[1].mentions.includes("github_user_1")).toEqual(true);
      expect(call[1].message.includes("[pr_title](review_comment_url)")).toEqual(true);
      expect(call[1].message.includes("sender_github_username")).toEqual(true);
      expect(call[1].message.includes("@github_user_1 LGTM!")).toEqual(true);
    });   
  });
});
