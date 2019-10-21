const Redis = require("ioredis");
const db = new Redis(process.env.REDIS_URL);

const clearAllKeys = async (search, label = "removing") => {
  const keys = await db.keys(search || "*");
  const pipeline = db.pipeline();
  console.log(`${label} ${keys.length} reviews`);
  keys.forEach(key => pipeline.del(key));
  pipeline.exec();
};

const countReviews = async (search = `review:*`) =>
  (await db.keys(search)).length;

const findReviews = async (search = `review:*`) => {
  const keys = await db.keys(search);
  const promises = keys.map(async key => {
    const [, , email, itemID, rating, created] = key.split(":");
    const comment = await db.get(key);
    return {
      id: key,
      itemID,
      rating,
      created,
      comment,
      user: { email }
    };
  });
  return await Promise.all(promises);
};

const createContext = async () => ({ req }) => {
  return {
    db,
    countReviews,
    findReviews,
    clearAllKeys,
    currentUser: req.headers["user-email"],
    appID: req.headers["app-id"]
  };
};

module.exports = { createContext, clearAllKeys };
