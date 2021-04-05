import * as Types from '../__generated__/graphql';

import { initUrqlClient } from 'next-urql';
import { dedupExchange, ssrExchange, cacheExchange, fetchExchange, gql } from '@urql/core';

export const GetMessagesDocument = gql`
    query getMessages {
  messages
}
    `;
export async function getGetMessagesData(
      variables?: Types.GetMessagesQueryVariables
    ): Promise<{ props: { urqlState: { [key: string]: object } } }> {
      const ssrCache = ssrExchange({ isClient: false });
      const client = initUrqlClient({
        url: "http://localhost:3000/api/graphql",
        exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange]
      }, false);

      await client.query<Types.GetMessagesQuery>(GetMessagesDocument, variables).toPromise();
    
      return { props: { urqlState: ssrCache.extractData() } };
    }