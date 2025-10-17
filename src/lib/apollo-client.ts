import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { Socket as PhoenixSocket } from 'phoenix';
import * as AbsintheSocket from '@absinthe/socket';
import { createAbsintheSocketLink } from '@absinthe/socket-apollo-link';

const HTTP_ENDPOINT =
  import.meta.env.VITE_GRAPHQL_HTTP_ENDPOINT || 'http://localhost:4000/api/graphql';
const WS_ENDPOINT = import.meta.env.VITE_GRAPHQL_WS_ENDPOINT || 'ws://localhost:4000/socket';

const httpLink = new HttpLink({ uri: HTTP_ENDPOINT });

// Phoenix socket client handles the channel protocol Absinthe expects.
const phoenixSocket = new PhoenixSocket(WS_ENDPOINT, {
  params: () => ({}),
});

phoenixSocket.connect();

const absintheSocket = AbsintheSocket.create(phoenixSocket);
const wsLink = createAbsintheSocketLink(absintheSocket);

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
});
