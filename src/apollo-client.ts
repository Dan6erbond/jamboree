import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  // TODO: Configure client for production
  uri: `http://${process.env.NEXT_PUBLIC_JAMBOREE_API_HOST}/${process.env.NEXT_PUBLIC_JAMBOREE_API_PATH}`,
  cache: new InMemoryCache({
    typePolicies: {
      Party: {
        keyFields: ["name"],
      },
    },
  }),
});
