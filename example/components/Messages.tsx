import { gql } from "@urql/core";
import { useQuery } from "urql";

const MESSAGES_QUERY = gql`
  query getMessages {
    messages
  }
`;

export function Messages() {
  const [res] = useQuery({ query: MESSAGES_QUERY });
  return (
    <div>
      <h1>Messages</h1>
      {res.data.messages.map((msg, i) => <p key={i}>{msg}</p>)}
    </div>
  );
}

