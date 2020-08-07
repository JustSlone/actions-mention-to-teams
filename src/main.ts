import * as core from "@actions/core";
import { context } from "@actions/github";
import { WebhookPayload } from "@actions/github/lib/interfaces";

import {
  pickupUsername,
  pickupPrInfoFromGithubPayload,
  pickupInfoFromGithubPayload,
} from "./modules/github";
import {
  buildPrReviewRequestedMention,
  buildTeamsNormalMention,
  buildTeamsErrorMessage,
  TeamsRepositoryImpl,
  TeamsPostParam,
} from "./modules/teams";

export type AllInputs = {
  teamsWebhookUrl: string;
  runId?: string;
};

export const execPrReviewRequestedMention = async (
  payload: WebhookPayload,
  allInputs: AllInputs,
  teamsClient: typeof TeamsRepositoryImpl
) => {
  console.log("execPrReviewRequestedMention");

  const prInfo = pickupPrInfoFromGithubPayload(payload);
  
  if (!prInfo.title) {
    throw new Error("prInfo.title is null or undefined");
  }

  if (!prInfo.requestedGithubUsername) {
    throw new Error("prInfo.requestedGithubUsername is null or undefined");
  }

  if (!prInfo.url) {
    throw new Error("prInfo.url is null or undefined");    
  }

  const post = buildPrReviewRequestedMention(
    prInfo.requestedGithubUsername,
    prInfo.title,
    prInfo.url,
    prInfo.requestorUsername
  );

  const { teamsWebhookUrl } = allInputs;

  await teamsClient.postToTeams(teamsWebhookUrl, post);
};

export const execNormalMention = async (
  payload: WebhookPayload,
  allInputs: AllInputs,
  teamsClient: typeof TeamsRepositoryImpl
) => {
  console.log("execNormalMention");
  const info = pickupInfoFromGithubPayload(payload);

  if (info.body === null) {
    throw new Error("info.body === null");
  }

  const githubUsernames = pickupUsername(info.body);
  if (githubUsernames.length === 0) {
    throw new Error("githubUsernames.length === 0");
  }

  const post = buildTeamsNormalMention(
    githubUsernames,
    info.title,
    info.url,
    info.body,
    info.senderName
  );

  const { teamsWebhookUrl } = allInputs;

  await teamsClient.postToTeams(teamsWebhookUrl, post);
};

const buildCurrentJobUrl = (runId: string) => {
  const { owner, repo } = context.repo;
  return `https://github.com/${owner}/${repo}/runs/${runId}`;
};

export const execPostError = async (
  error: Error,
  allInputs: AllInputs,
  teamsClient: typeof TeamsRepositoryImpl
) => {
  const { runId } = allInputs;
  const currentJobUrl = runId ? buildCurrentJobUrl(runId) : undefined;
  const message = buildTeamsErrorMessage(error, currentJobUrl);

  core.warning(message);

  const { teamsWebhookUrl } = allInputs;

  const post: TeamsPostParam = {
    headline: "ERROR",
    summary: "Error!",
    message: message,
    mentions: ["userForErrorNotifications"],
    isAlert: true,
  };

  await teamsClient.postToTeams(teamsWebhookUrl, post);
};

const getAllInputs = (): AllInputs => {
  const teamsWebhookUrl = core.getInput("teams-webhook-url", {
    required: true,
  });

  if (!teamsWebhookUrl) {
    core.setFailed("Error! Need to set `teams-webhook-url`.");
  }

  const runId = core.getInput("run-id", { required: false });

  const allInputs = {
    teamsWebhookUrl,
    runId,
  };
  console.log("got inputs", allInputs);
  return allInputs;
};

export const main = async () => {
  console.log("Start of run");

  const { payload } = context;
  const allInputs = getAllInputs();

  try {
    if (payload.action === "review_requested") {
      await execPrReviewRequestedMention(
        payload,
        allInputs,
        TeamsRepositoryImpl
      );
      return;
    }

    await execNormalMention(payload, allInputs, TeamsRepositoryImpl);
  } catch (error) {
    console.log("Caught error:", error.message);
    await execPostError(error, allInputs, TeamsRepositoryImpl);
  }
};
