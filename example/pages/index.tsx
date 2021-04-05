import { gql } from "@urql/core";
import { useQuery } from "urql";
import { getGetTodosData } from '../__generated__/pages';

const TODOS_QUERY = gql`
  query getTodos {
    todos {
      id
      text
    }
  }
`;

function Index() {
  const [res] = useQuery({ query: TODOS_QUERY });
  return (
    <div>
      {res.data.todos.map((todo) => (
        <div key={todo.id}>
          {todo.id} - {todo.text}
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  return await getGetTodosData();
}

export default Index
