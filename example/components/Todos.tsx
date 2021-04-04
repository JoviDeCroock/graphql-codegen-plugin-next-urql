import { gql } from "@urql/core";
import { useQuery } from "urql";
import { Todo, TODO_FRAGMENT } from './Todo';

const TODOS_QUERY = gql`
  query getTodosNested {
    todos {
      ...TodoFields
    }
  }

  ${TODO_FRAGMENT}
`;

export function Todos() {
  const [res] = useQuery({ query: TODOS_QUERY });
  return (
    <div>
      <h1>Todos</h1>
      {res.data.todos.map((todo) => <Todo key={todo.id} {...todo} />)}
    </div>
  );
}

