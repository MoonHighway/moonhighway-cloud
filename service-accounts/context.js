const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");

const createContext = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      `MONGODB_URI undefined. Please provide this environment variable`
    );
  }

  if (!process.env.AUTH_SECRET) {
    throw new Error(
      `AUTH_SECRET undefined. Please provide this environment variable`
    );
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = client.db();
  const users = db.collection("users");

  return async ({ req }) => {
    let currentUser = null;
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace(/(B|b)earer/, "").trim();
      const { email } = jwt.verify(token, process.env.AUTH_SECRET);
      currentUser = await users.findOne({ email });
    }
    return {
      users,
      currentUser
    };
  };
};

module.exports = { createContext };
