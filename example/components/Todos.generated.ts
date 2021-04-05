import * as Types from '../__generated__/graphql';

import { TodoFieldsFragmentDoc } from './Todo.generated';
import { initUrqlClient } from 'next-urql';
import { dedupExchange, ssrExchange, cacheExchange, fetchExchange, gql } from '@urql/core';

export const GetTodosNestedDocument = gql`
    query getTodosNested {
  todos {
    ...TodoFields
  }
}
    ${TodoFieldsFragmentDoc}`;
export async function getGetTodosNestedData(
      variables?: Types.GetTodosNestedQueryVariables
    ): Promise<{ props: { urqlState: { [key: string]: object } } }> {
      const ssrCache = ssrExchange({ isClient: false });
      const client = initUrqlClient({
        url: "http://localhost:3000/api/graphql",
        exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange]
      }, false);

      await client.query<Types.GetTodosNestedQuery>(GetTodosNestedDocument, variables).toPromise();
    
      return { props: { urqlState: ssrCache.extractData() } };
    }