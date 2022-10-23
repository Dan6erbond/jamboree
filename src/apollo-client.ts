import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  // TODO: Configure client for production
  uri: "http://localhost:5001/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Party: {
        keyFields: ["name"],
      },
    },
  }),
});
