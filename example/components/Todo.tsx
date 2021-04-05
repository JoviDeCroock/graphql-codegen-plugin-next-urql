import { gql } from "@urql/core";

export const TODO_FRAGMENT = gql`
  fragment TodoFields on Todo {
    id
    text
  }
`;

export function Todo(todo) {
  return (
    <div key={todo.id}>
      {todo.id} - {todo.text}
    </div>
  );
}
