import axios from "axios";

export const buildPrReviewRequestedMention  = (
  requestedGithubUsername: string,
  prTitle: string,
  prUrl: string,  
  requestorUsername: string
) => {
  console.log('buildPrReviewRequestedMention', requestedGithubUsername, prTitle, prUrl, requestorUsername);
  
  const message = `You (@${requestedGithubUsername}) has been requested to review [${prTitle}](${prUrl}) by @${requestorUsername}.`;

  const post: TeamsPostParam = {
    headline: prTitle,
    summary: `New PR Review Request from @${requestorUsername}!`,
    message: message,
    mentions: [requestedGithubUsername],
    isAlert: false,
  };

  return post;
};

export const buildTeamsNormalMention = (
  githubIdsForMention: string[],
  issueTitle: string,
  commentUrl: string,
  githubBody: string,
  senderName: string
) => {
  console.log('buildTeamsPostMessage', githubIdsForMention, issueTitle, commentUrl, githubBody, senderName);
  
  const body = githubBody
    .split("\n")
    .map((line) => `>\u2003⁣⁣⁣⁣⁣⁣‎‎‎‎${line}`)
    .join("\n\n");

  const message = `You have been mentioned at [${issueTitle}](${commentUrl}) by ${senderName}`;

  const post: TeamsPostParam =  {
    headline: issueTitle,
    summary: `New mention from @${senderName}!`,
    message: `${message}\n\n${body}`,
    mentions: githubIdsForMention,
    isAlert: false,
  }

  return post;
};


const openIssueLink =
  "https://github.com/justSlone/actions-mention-to-teams/issues/new";

export const buildTeamsErrorMessage = (
  error: Error,
  currentJobUrl?: string
) => {
  console.log('buildTeamsErrorMessage', error.message);
  const jobTitle = "mention-to-teams action";
  const jobLinkMessage = currentJobUrl
    ? `<${currentJobUrl}|${jobTitle}>`
    : jobTitle;

  return [
    `❗ An internal error occurred in ${jobLinkMessage}`,
    "(but action didn't fail as this action is not critical).",
    `To solve the problem, please copy and paste the text below and <${openIssueLink}|open an issue>`,
    "",
    "```",
    error.stack || error.message,
    "```",
  ].join("\n");
};

export type TeamsPostParam = {
  headline: string;
  summary: string;
  message: string;
  mentions: Array<string>;
  isAlert: boolean;
};

export const TeamsRepositoryImpl = {
  postToTeams: async (
    webhookUrl: string,   
    post: TeamsPostParam
  ) => {
    console.log('postToTeams', post);   

    await axios.post(webhookUrl, JSON.stringify(post), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
