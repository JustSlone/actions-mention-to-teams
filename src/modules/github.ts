import { WebhookPayload } from "@actions/github/lib/interfaces";

const uniq = <T>(arr: T[]): T[] => [...new Set(arr)];

export const pickupUsername = (text: string) => {
  const pattern = /\B@[a-z0-9_-]+/gi;
  const hits = text.match(pattern);

  if (hits === null) {
    return [];
  }

  return uniq(hits).map((username) => username.replace("@", ""));
};

const acceptActionTypes = {
  issues: ["opened", "edited"],
  issue_comment: ["created", "edited"],
  pull_request: ["opened", "edited", "review_requested"],
  pull_request_review: ["submitted"],
  pull_request_review_comment: ["created", "edited"],
};

const buildError = (payload: object): Error => {
  return new Error(
    `unknown event hook: ${JSON.stringify(payload, undefined, 2)}`
  );
};

export const pickupPrInfoFromGithubPayload = (
  payload: WebhookPayload
) => {
  return {
    requestedGithubUsername: payload.requested_reviewer?.login as string,
    title: payload.pull_request?.title as string,
    url: payload.pull_request?.html_url as string,
    requestorUsername: payload.sender?.login as string,
  };
};

export const pickupInfoFromGithubPayload = (
  payload: WebhookPayload
): {
  body: string | null;
  title: string;
  url: string;
  senderName: string;
} => {
  const { action } = payload;

  if (action === undefined) {
    throw buildError(payload);
  }

  if (payload.issue) {
    if (payload.comment) {
      if (!acceptActionTypes.issue_comment.includes(action)) {
        throw buildError(payload);
      }

      return {
        body: payload.comment.body,
        title: payload.issue.title,
        url: payload.comment.html_url,
        senderName: payload.sender?.login || "",
      };
    }

    if (!acceptActionTypes.issues.includes(action)) {
      throw buildError(payload);
    }

    return {
      body: payload.issue.body || "",
      title: payload.issue.title,
      url: payload.issue.html_url || "",
      senderName: payload.sender?.login || "",
    };
  }

  if (payload.pull_request) {
    if (payload.review) {
      if (!acceptActionTypes.pull_request_review.includes(action)) {
        throw buildError(payload);
      }

      return {
        body: payload.review.body,
        title: payload.pull_request?.title || "",
        url: payload.review.html_url,
        senderName: payload.sender?.login || "",
      };
    }

    if (payload.comment) {
      if (!acceptActionTypes.issue_comment.includes(action)) {
        throw buildError(payload);
      }

      return {
        body: payload.comment.body,
        title: payload.pull_request.title,
        url: payload.comment.html_url,
        senderName: payload.sender?.login || "",
      };
    }

    if (!acceptActionTypes.pull_request.includes(action)) {
      throw buildError(payload);
    }

    return {
      body: payload.pull_request.body || "",
      title: payload.pull_request.title,
      url: payload.pull_request.html_url || "",
      senderName: payload.sender?.login || "",
    };
  }

  throw buildError(payload);
};