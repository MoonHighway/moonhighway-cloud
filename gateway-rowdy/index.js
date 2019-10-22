const { ApolloServer } = require("apollo-server");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const saveFile = (stream, path) =>
  new Promise((resolve, reject) => {
    stream
      .on("error", error => {
        if (stream.truncated) {
          fs.unlinkSync(path);
        }
        reject(error);
      })
      .on("end", resolve)
      .pipe(fs.createWriteStream(path));
  });

const gateway = new ApolloGateway({
  serviceList: [
    { name: "users", url: "http://localhost:4000" },
    { name: "reviews", url: "http://localhost:4001" },
    { name: "photos", url: "http://localhost:4004" }
  ],
  buildService({ url }) {
    return new RemoteGraphQLDataSource({
      url,
      async willSendRequest({ request, context }) {
        if (request.variables.input && request.variables.input.file) {
          const file = await request.variables.input.file;
          const stream = file.createReadStream();
          const timestamp = new Date().toISOString();
          const filename = `${timestamp}-${file.filename}`;

          try {
            await saveFile(
              stream,
              path.join(__dirname, "..", "bucket", filename)
            );
          } catch (fileError) {
            console.error("Error saving file");
            console.error(fileError);
          }

          request.variables.input.file = filename;
        }

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
        request.http.headers.set("app-id", "rowdy");
      }
    });
  }
});

(async () => {
  const { schema, executor } = await gateway.load();

  const context = ({ req }) => ({ Authorization: req.headers.authorization });

  const server = new ApolloServer({ schema, executor, context });

  server.listen(process.env.PORT).then(({ url }) => {
    console.log(`🌄 🌅 🌆 🌉 🌌 ${url}`);
  });
})();
