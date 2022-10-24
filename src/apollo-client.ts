import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  // TODO: Configure client for production
  uri: process.env.NEXT_PUBLIC_JAMBOREE_API_URL,
  cache: new InMemoryCache({
    typePolicies: {
      Party: {
        keyFields: ["name"],
      },
    },
  }),
});
