import {
  GithubEvent,
  GithubIssue,
  GithubIssueCommentEvent,
  githubIssueCommentEvent,
} from "./github-events.model";
import axios from "axios";
import { useQuery } from "react-query";
import { fold } from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import * as t from "io-ts";

export function useGithubIssueComments() {
  const url = `/networks/microsoft/TypeScript/events?per_page=100`;

  return useQuery<GithubIssue[], Error>(url, () =>
    axios.get(url).then((res) => mapResult(res.data))
  );
}

export function mapResult(data: GithubEvent[]): GithubIssue[] {
  const githubIssueCommentEvents = getGithubIssueCommentEvents(data);
  const githubIssues = getGithubIssues(githubIssueCommentEvents);

  return githubIssues;
}

function getGithubIssueCommentEvents(
  githubEvents: GithubEvent[]
): GithubIssueCommentEvent[] {
  return githubEvents
    .map((githubEvent) =>
      pipe(
        githubIssueCommentEvent.decode(githubEvent),
        fold((_) => undefined, t.identity)
      )
    )
    .filter(isJust);
}

function getGithubIssues(
  githubIssueCommentEvents: GithubIssueCommentEvent[]
): GithubIssue[] {
  const githubIssuesMap = githubIssueCommentEvents.reduce(
    (issues, { payload }) => {
      const issue = issues.get(payload.issue.id) ?? {
        ...payload.issue,
        comments: [],
      };

      issue.comments.push(payload.comment);

      issues.set(issue.id, issue);

      return issues;
    },
    new Map<GithubIssue["id"], GithubIssue>()
  );

  return [...githubIssuesMap.values()];
}

function isJust<A>(a: A | undefined): a is A {
  return a !== undefined;
}
