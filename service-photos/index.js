const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { readFileSync } = require("fs");
const { join } = require("path");
const resolvers = require("./resolvers");
const { createContext } = require("./context");
const typeDefs = readFileSync(join(__dirname, "typeDefs.graphql"), "UTF-8");
const express = require("express");
const path = require("path");

const start = async () => {
  const context = await createContext();
  const server = new ApolloServer({
    context,
    schema: buildFederatedSchema([
      {
        resolvers,
        typeDefs: gql`
          ${typeDefs}
        `
      }
    ])
  });

  const photoServiceApp = express();
  photoServiceApp.use(express.static(path.join(__dirname, "assets", "photos")));

  photoServiceApp.listen(process.env.PHOTO_FILE_PORT, () => {
    console.log(
      `         🗄  - photo files being served at: http://localhost:${process.env.PHOTO_FILE_PORT}`
    );
  });

  server.listen(process.env.PORT).then(({ url }) => {
    console.log(`       🖼 📸  - ${url}`);
  });
};

start();
