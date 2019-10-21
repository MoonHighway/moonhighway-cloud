const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const me = (_, args, { currentUser }) => currentUser;

const authorize = async (_, { email, password }, { users }) => {
  let user = await users.findOne({ email });
  if (!user) {
    throw new Error(`Account for "${email}" does not exist.`);
  }
  if (!bcrypt.compareSync(password, user.password)) {
    throw new Error("Incorrect password.");
  }
  return {
    token: jwt.sign({ email }, process.env.AUTH_SECRET),
    user
  };
};

const createAccount = async (
  _,
  { input: { email, password, name } },
  { users }
) => {
  let existingUser = await users.findOne({ email });
  if (existingUser) {
    throw new Error(`an account for "${email}" already exists.`);
  }

  let hash = bcrypt.hashSync(password, 10);
  const {
    ops: [user]
  } = await users.insertOne({
    name,
    email,
    password: hash,
    created: new Date().toISOString()
  });

  const token = jwt.sign({ email }, process.env.AUTH_SECRET);

  return { token, user };
};

module.exports = {
  Query: { me },
  Mutation: { authorize, createAccount },
  User: {
    async __resolveReference({ email }, { users }) {
      const user = await users.findOne({ email });
      return user;
    }
  }
};
