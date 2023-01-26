import { useMemo } from "react";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  DefaultOptions,
  split,
  ApolloLink,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { createClient } from "graphql-ws";

/* eslint-disable no-console */

/**
 * Will give use the client to use with GQL
 */

interface apolloClientProps {
  apolloClientParams: {
    serviceUri: string;
    authToken: string;
    refreshToken?: string;
    setRefreshToken?: (refreshToken: string) => void;
    hasWssConnection?: boolean;
    wssServiceUri?: string;
  };
}

export function useApolloClient({
  apolloClientParams,
}: apolloClientProps): ApolloClient<any> {
  const {
    serviceUri,
    authToken,
    refreshToken,
    hasWssConnection,
    wssServiceUri,
  } = apolloClientParams;
  const createApolloClient = useMemo(() => {
    const myAccessToken = {
      value: authToken,
    };

    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      }
      if (networkError) console.log(`[Network error]: ${networkError}`);
    });

    /**
     * Http linker
     */
    const httpLink = new HttpLink({
      uri: serviceUri,
    });

    let splitLink: ApolloLink = httpLink;

    if (hasWssConnection) {
      if (!wssServiceUri)
        throw new Error("REACT_APP_TRAINING_V2_WSS_GQL is empty!");

      /**
       * wss linker
       */
      const wsLink = new GraphQLWsLink(
        createClient({
          url: wssServiceUri,
          connectionParams: () => {
            return {
              headers: {
                Authorization: `Bearer ${myAccessToken.value}`,
              },
            };
          },
        })
      );

      // The split function takes three parameters:
      //
      // * A function that's called for each operation to execute
      // * The Link to use for an operation if the function returns a "truthy" value
      // * The Link to use for an operation if the function returns a "falsy" value

      splitLink = split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      );
    }
    const authLink = new ApolloLink((operation, forward) => {
      operation.setContext(({ headers }: { headers: any }) => ({
        headers: {
          ...headers,
          Authorization: `Bearer ${myAccessToken.value}`,
        },
      }));
      return forward(operation);
    }).concat(splitLink);
    const retryLink = new RetryLink({
      delay: {
        initial: 2000,
        max: Infinity,
        jitter: true,
      },
      attempts: {
        max: 10,
        retryIf: (error) => !!error,
      },
    });

    /**
     * Caching mechanism
     */
    const defaultOptions: DefaultOptions = {
      watchQuery: {
        fetchPolicy: "cache-and-network",
        errorPolicy: "ignore",
      },
      query: {
        fetchPolicy: "network-only",
        errorPolicy: "all",
      },
    };

    /**
     * Create client
     */
    return new ApolloClient({
      link: from([errorLink, retryLink, authLink]),
      cache: new InMemoryCache({ resultCaching: false }),
      defaultOptions,
    });
  }, [serviceUri, authToken, refreshToken, hasWssConnection, wssServiceUri]);
  return createApolloClient;
}
