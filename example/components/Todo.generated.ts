import * as Types from '../__generated__/graphql';

import { initUrqlClient } from 'next-urql';
import { dedupExchange, ssrExchange, cacheExchange, fetchExchange, gql } from '@urql/core';
export const TodoFieldsFragmentDoc = gql`
    fragment TodoFields on Todo {
  id
  text
}
    `;