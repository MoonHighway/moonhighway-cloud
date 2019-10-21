const { ApolloServer } = require("apollo-server");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const fetch = require("node-fetch");

const gateway = new ApolloGateway({
  serviceList: [
    { name: "users", url: "http://localhost:4000" },
    { name: "reviews", url: "http://localhost:4001" },
    { name: "colors", url: "http://localhost:4002" }
  ],
  introspectionHeaders: {
    "app-id": "hue-review"
  },
  buildService({ url }) {
    return new RemoteGraphQLDataSource({
      url,
      async willSendRequest({ request, context }) {
        if (context.Authorization) {
          const query = `
              query findUserEmail { me { email } }
            `;
          const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: context.Authorization
            },
            body: JSON.stringify({ query })
          };
          const {
            data: { me }
          } = await fetch("http://localhost:4000", options)
            .then(res => res.json())
            .catch(console.error);

          if (me) {
            request.http.headers.set("Authorization", context.Authorization);
            request.http.headers.set("user-email", me.email);
          }
        }
        request.http.headers.set("app-id", "hue-review");
      }
    });
  }
});

const start = async () => {
  const { schema, executor } = await gateway.load();
  const context = ({ req }) => ({ Authorization: req.headers.authorization });
  const server = new ApolloServer({ schema, executor, context });

  server.listen(process.env.PORT).then(({ url }) => {
    console.log(`🌄 🌅 🌆 🌉 🌌 ${url}`);
  });
};

start();
