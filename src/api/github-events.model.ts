import * as t from "io-ts";

const githubUser = t.exact(
  t.type({
    id: t.number,
    login: t.string,
  })
);

export type GithubUser = t.TypeOf<typeof githubUser>;

const githubComment = t.exact(
  t.type({
    id: t.number,
    created_at: t.string,
    user: githubUser,
    body: t.string,
  })
);

export type GithubComment = t.TypeOf<typeof githubComment>;

export type GithubEvent = {
  id: string;
  type: string;
  actor: GithubUser;
  created_at: string;
  payload: {
    issue: {
      id: number;
      created_at: string;
      user: GithubUser;
      title: string;
      body: string;
    };
    comment: GithubComment;
  };
};

export const githubIssueCommentEvent = t.exact(
  t.type({
    id: t.string,
    type: t.literal("IssueCommentEvent"),
    actor: githubUser,
    created_at: t.string,
    payload: t.exact(
      t.type({
        issue: t.exact(
          t.type({
            id: t.number,
            created_at: t.string,
            user: githubUser,
            title: t.string,
            body: t.string,
          })
        ),
        comment: githubComment,
      })
    ),
  })
);

export type GithubIssueCommentEvent = t.TypeOf<typeof githubIssueCommentEvent>;

const githubIssue = t.type({
  id: t.number,
  created_at: t.string,
  user: githubUser,
  title: t.string,
  body: t.string,
  comments: t.array(
    t.type({
      id: t.number,
      created_at: t.string,
      user: githubUser,
      body: t.string,
    })
  ),
});

export type GithubIssue = t.TypeOf<typeof githubIssue>;
