const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { readFileSync } = require("fs");
const { join } = require("path");
const resolvers = require("./resolvers");
const { createContext } = require("./context");

const start = async () => {
  const typeDefs = readFileSync(join(__dirname, "typeDefs.graphql"), "UTF-8");
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

  server.listen(process.env.PORT).then(({ url }) => {
    console.log(`🎨 🖍  Color service running at: ${url}`);
  });
};

start();
