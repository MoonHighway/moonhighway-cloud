const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { readFileSync } = require("fs");
const { join } = require("path");
const { createContext, clearAllKeys } = require("./context");
const resolvers = require("./resolvers");
const argv = require("minimist")(process.argv.slice(2));

const start = async () => {
  const typeDefs = readFileSync(join(__dirname, "typeDefs.graphql"), "UTF-8");
  const context = await createContext();
  if (argv.clearReviews) await clearAllKeys();
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
    console.log(`⭐️ ⭐️ ⭐️ ⭐️ ⭐️ Review service running at: ${url}`);
  });
};

start();
