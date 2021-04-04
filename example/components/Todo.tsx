import { gql } from "@urql/core";

// TODO: currently strugging with __key missmatch between getGetTodosData & this one
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
