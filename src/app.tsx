import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import * as s from "./app.styles";
import { useGithubIssueComments, IssueQuery } from "./api/github-events.api";
import ErrorDetails from "./components/error-details";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GithubIssueViewer />
    </QueryClientProvider>
  );
}

function GithubIssueViewer() {
  const [issueQuery, setIssueQuery] = useState({
    user: "microsoft",
    repo: "TypeScript",
  });

  return (
    <>
      <GithubIssueForm
        onSubmit={(issueQuery) => {
          setIssueQuery(issueQuery);
        }}
      />
      <GithubIssues issueQuery={issueQuery} />
    </>
  );
}

function GithubIssues({ issueQuery }: { issueQuery: IssueQuery }) {
  const { data, isLoading, isError, error } = useGithubIssueComments(
    issueQuery
  );

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (isError) {
    return <ErrorDetails error={error} />;
  }

  return (
    <s.container>
      <s.header>Recent comments on {issueQuery.repo} issues:</s.header>
      {data?.map((issue) => (
        <div key={issue.id}>
          <s.issuer_title>{issue.title}</s.issuer_title>
          <pre>{issue.body}</pre>
          {issue.comments.map((comment) => (
            <s.comment_body key={comment.id}>
              <div>
                {comment.created_at} {comment.user.login}:
              </div>
              <pre>{comment.body}</pre>
            </s.comment_body>
          ))}
        </div>
      ))}
    </s.container>
  );
}

function GithubIssueForm({
  onSubmit,
}: {
  onSubmit: (issueQuery: IssueQuery) => void;
}) {
  const [user, setUser] = useState("");
  const [repo, setRepo] = useState("");

  return (
    <form
      onSubmit={(e) => {
        onSubmit({ user, repo });

        setUser("");
        setRepo("");

        e.preventDefault();
      }}
    >
      <input
        type="text"
        placeholder="user"
        onChange={(e) => {
          setUser(e.target.value);
        }}
      />
      {"/"}
      <input
        type="text"
        placeholder="repo"
        onChange={(e) => {
          setRepo(e.target.value);
        }}
      />
      <button disabled={user === "" || repo === ""}>Go fetch</button>
    </form>
  );
}
