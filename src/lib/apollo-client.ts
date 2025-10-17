import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

// Configure your backend endpoint here
const HTTP_ENDPOINT = import.meta.env.VITE_GRAPHQL_HTTP_ENDPOINT || 'http://localhost:4000/graphql';
const WS_ENDPOINT = import.meta.env.VITE_GRAPHQL_WS_ENDPOINT || 'ws://localhost:4000/socket';

const httpLink = new HttpLink({
  uri: HTTP_ENDPOINT,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: WS_ENDPOINT,
  })
);

// Split links based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
