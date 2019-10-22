const { MongoClient } = require("mongodb");

const createContext = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      `MONGODB_URI undefined. Please provide this environment variable`
    );
  }
  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = client.db();
  const photos = db.collection("photos");

  return ({ req }) => ({
    photos,
    currentUser: req.headers["user-email"],
    appID: req.headers["app-id"]
  });
};

module.exports = { createContext };
