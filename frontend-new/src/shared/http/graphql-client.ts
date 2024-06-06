import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  split,
  type DefaultOptions
} from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { logErrorMessages } from '@vue/apollo-util'
import { createClient } from 'graphql-ws'
import { useOidcStore } from 'vue3-oidc'

const oidcState = useOidcStore()

// Wrapper to inject bearer token into authentication header
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: 'Bearer ' + oidcState.state.value.token
    }
  }
})

// WebSocket connection to the API
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:8088/wsgraphql',
    lazy: true,
    connectionParams: () => {
      return {
        Authorization: 'Bearer ' + oidcState.state.value.token
      }
    }
  })
)

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'http://localhost:8088/graphql'
})

// Handle errors
const errorLink = onError((error) => {
  logErrorMessages(error)
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  errorLink.concat(authLink.concat(httpLink))
)

// Cache implementation
const cache = new InMemoryCache()

// Do not cache queries
const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore'
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  }
}

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: link,
  cache: cache,
  connectToDevTools: true,
  defaultOptions: defaultOptions
})
