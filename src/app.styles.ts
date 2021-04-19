import styled from "styled-components";

const magenta = "#008080";
const purple = "#60739F";
const darkPurple = "#0A235C";
const grey = "#f3f3f3";

export const container = styled.div`
  font-family: sans-serif;
  color: ${darkPurple};
  max-width: 960px;
  margin: 0 auto;
  padding-top: 2em;
  padding-bottom: 2em;
  line-height: 1.5;
`;

export const h1 = styled.h1`
  font-size: 40px;
  font-family: serif;
`;

export const h2 = styled.h2`
  color: ${magenta};
  font-family: serif;
  font-size: 24px;
  margin-bottom: 0.25em;
`;

export const byline = styled.p`
  color: ${(props: { alternate: boolean }) =>
    props.alternate ? purple : darkPurple};
  font-weight: ${(props: { alternate: boolean }) =>
    props.alternate ? "normal" : "bold"};
  margin-top: 0;
`;

export const body = styled.div`
  h1 {
    font-size: 24px;
  }

  h2 {
    font-size: 20px;
  }

  h3 {
    font-size: 16px;
  }

  pre {
    overflow-x: auto; // To be able to side-scroll large code snippets
  }
`;

export const box = styled.div`
  background-color: ${grey};
  padding-top: 1em;
  padding-bottom: 1em;
  padding-left: 1.5em;
  padding-right: 1.5em;
  margin-bottom: 0.5em;
`;
