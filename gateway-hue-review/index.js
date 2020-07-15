const { ApolloServer } = require("apollo-server");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const fetch = require("node-fetch");

const gateway = new ApolloGateway({
  serviceList: [
    { name: "users", url: "http://localhost:5000" },
    { name: "reviews", url: "http://localhost:5002" },
    { name: "colors", url: "http://localhost:5001" },
  ],
  introspectionHeaders: {
    "app-id": "hue-review",
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
              Authorization: context.Authorization,
            },
            body: JSON.stringify({ query }),
          };
          const {
            data: { me },
          } = await fetch("http://localhost:5000", options)
            .then((res) => res.json())
            .catch(console.error);

          if (me) {
            request.http.headers.set("Authorization", context.Authorization);
            request.http.headers.set("user-email", me.email);
          }
        }
        request.http.headers.set("app-id", "hue-review");
      },
    });
  },
});

const start = async () => {
  const context = ({ req }) => ({ Authorization: req.headers.authorization });
  const server = new ApolloServer({ gateway, subscriptions: false, context });

  server.listen(process.env.PORT).then(({ url }) => {
    console.log(`\n\n🖍`);
    console.log(`🖍 🖍`);
    console.log(`🎨🎨🎨      The Hue Review Gateway API`);
    console.log(`👨‍👨‍👧‍👦    running at ${url}`);
    console.log(`⭐️⭐ `);
    console.log(`⭐️ \n\n\n`);
  });
};

start();
