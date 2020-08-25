import {
    ApolloProvider,
    ApolloClient,
    InMemoryCache,
} from "@apollo/react-hooks";
import React, { FC } from "react";

const createApolloClient = () => {
    return new ApolloClient({
        uri: "https://living-alpaca-60.hasura.app/v1/graphql",
        cache: new InMemoryCache({
            addTypename: false,
        }),
    });
};

export const GraphQlProvider: FC = ({ children }) => {
    const client = createApolloClient();
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
