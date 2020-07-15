const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { readFileSync } = require("fs");
const { join } = require("path");
const resolvers = require("./resolvers");
const { createContext } = require("./context");

const start = async () => {
  const fileName = join(__dirname, "typeDefs.graphql");
  const typeDefs = readFileSync(fileName, "UTF-8");
  const context = await createContext();
  const server = new ApolloServer({
    context,
    schema: buildFederatedSchema([
      {
        resolvers,
        typeDefs: gql`
          ${typeDefs}
        `,
      },
    ]),
  });
  server.listen(process.env.PORT).then(({ url }) => {
    console.log(`\n\n\n     👨‍ `);
    console.log(`     👨‍👨‍      Account service`);
    console.log(`     👨‍👨‍👧‍    running at: ${url}`);
    console.log(`     👨‍👨‍👧‍👦 \n\n\n`);
  });
};

start();
