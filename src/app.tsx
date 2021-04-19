import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { QueryClient, QueryClientProvider } from "react-query";
import { format, formatRelative } from "date-fns";
import * as s from "./app.styles";
import { useGithubIssueComments, IssueQuery } from "./api/github-events.api";
import ErrorDetails from "./components/error-details";
import { GithubIssue } from "./api/github-events.model";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GithubIssuesBrowser />
    </QueryClientProvider>
  );
}

function GithubIssuesBrowser() {
  const [issueQuery, setIssueQuery] = useState({
    user: "microsoft",
    repo: "TypeScript",
  });

  return (
    <s.container>
      <s.h1>GitHub Issues and Comments</s.h1>
      <GithubIssueForm
        onSubmit={(issueQuery) => {
          setIssueQuery(issueQuery);
        }}
      />
      <GithubIssuesView issueQuery={issueQuery} />
    </s.container>
  );
}

function GithubIssuesView({ issueQuery }: { issueQuery: IssueQuery }) {
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
    <>
      {(data ?? []).map((githubIssue) => (
        <GithubIssueView key={githubIssue.id} githubIssue={githubIssue} />
      ))}
    </>
  );
}

function GithubIssueView({ githubIssue }: { githubIssue: GithubIssue }) {
  return (
    <>
      <s.h2>{githubIssue.title}</s.h2>
      <Byline
        alternate={true}
        login={githubIssue.user.login}
        created_at={githubIssue.created_at}
      />
      <Body body={githubIssue.body} />
      {githubIssue.comments.length > 0 ? (
        <GithubIssueCommentsViewer comments={githubIssue.comments} />
      ) : null}
    </>
  );
}

function GithubIssueCommentsViewer({
  comments,
}: {
  comments: GithubIssue["comments"];
}) {
  return (
    <>
      {comments.map((comment) => (
        <s.box key={comment.id}>
          <Byline
            alternate={false}
            login={comment.user.login}
            created_at={comment.created_at}
          />
          <Body body={comment.body} />
        </s.box>
      ))}
    </>
  );
}

function Byline({
  alternate,
  login,
  created_at,
}: {
  alternate: boolean;
  login: string;
  created_at: string;
}) {
  return (
    <s.byline
      title={format(new Date(created_at), "d MMM y k:m")}
      alternate={alternate}
    >
      By <strong>{login}</strong> •{" "}
      {formatRelative(new Date(created_at), new Date())}
    </s.byline>
  );
}

function Body({ body }: { body: string }) {
  return (
    <s.body>
      <ReactMarkdown>{body}</ReactMarkdown>
    </s.body>
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
