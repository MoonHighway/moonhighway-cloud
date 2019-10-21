module.exports = {
  Query: {
    totalReviews: (_, args, { countReviews }) => countReviews(),
    allReviews: (_, args, { findReviews }) => findReviews()
  },
  Mutation: {
    async addReview(
      _,
      {
        input: { itemID, rating, comment }
      },
      { db, currentUser, appID }
    ) {
      if (!currentUser) {
        throw new Error(
          "A user must be logged in to add a review. Check http headers and make sure 'user-email' is getting set upstream."
        );
      }

      if (!appID) {
        throw new Error(
          "appID not found! Check http headers and make sure 'app-id' is getting set upstream."
        );
      }

      if (itemID.indexOf(":") != -1) {
        throw new Error(
          "Invalid itemID. The itemID cannot contain ':' collins."
        );
      }

      const created = new Date().toISOString();
      const key = `review:${appID}:${currentUser}:${itemID}:${rating}:${created}`;
      await db.set(key, comment);
      return {
        id: key,
        itemID,
        rating,
        created,
        comment,
        user: { email: currentUser }
      };
    }
  },
  ItemReview: {
    yourReview: async (
      { itemID },
      args,
      { currentUser, appID, findReviews }
    ) => {
      const [review] = await findReviews(
        `review:${appID}:${currentUser}:${itemID}:*`
      );
      return review;
    },
    __resolveReference: async ({ itemID }, args, { appID, findReviews }) => {
      const reviews = await findReviews(`review:${appID}:*:${itemID}:*`);
      const ratings = reviews.map(r => r.rating);
      const total =
        ratings.length > 1
          ? ratings.reduce((p, n) => p + n)
          : ratings.length === 1
          ? ratings[0]
          : 0;
      const adv = total / ratings.length;
      return {
        itemID,
        advRating: adv || 0,
        reviews
      };
    }
  },
  Review: {
    __resolveReference: async ({ id }, args, { db }) => {
      const [, , email, itemID, rating, created] = id.split(":");
      const comment = await db.get(id);
      return {
        id,
        itemID,
        rating,
        created,
        comment,
        user: { email }
      };
    }
  }
};
