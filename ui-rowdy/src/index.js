import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ApolloClient } from "apollo-client";
import { createUploadLink } from "apollo-upload-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import { ApolloProvider } from "@apollo/react-hooks";
import * as serviceWorker from "./serviceWorker";

const cache = new InMemoryCache();
const httpLink = createUploadLink({
  includeExtensions: true,
  uri: process.env.REACT_APP_GATEWAY_URL
});
const authLink = setContext((_, operation) => {
  const token = localStorage.getItem("token");
  if (token) {
    return {
      headers: {
        ...operation.headers,
        authorization: `Bearer ${token}`
      }
    };
  } else {
    return operation;
  }
});

const link = authLink.concat(httpLink);

const client = new ApolloClient({ cache, link });

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
