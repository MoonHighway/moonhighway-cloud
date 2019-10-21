const { generate } = require("shortid");

module.exports = {
  Query: {
    totalColors: (_, args, { colors }) => colors.length,
    allColors: (_, { email }, { colors }) =>
      email ? colors.filter(color => color.user === email) : colors
  },
  Mutation: {
    addColor(_, { title, value }, { saveColors, colors, currentUser }) {
      if (!currentUser) {
        throw new Error(`You must be logged in to add new colors`);
      }

      const newColor = {
        id: generate(),
        title,
        value,
        created: new Date().toISOString(),
        createdBy: {
          email: currentUser
        }
      };
      saveColors([...colors, newColor]);
      return newColor;
    }
  },
  Color: {
    reviews: ({ id }) => ({ itemID: id })
  },
  User: {
    postedColors: ({ email }, args, { colors }) =>
      colors.filter(c => c.createdBy.email === email)
  },
  Review: {
    color: ({ itemID }, args, { colors }) => {
      console.log("finding color: ", itemID);
      return colors.find(c => c.id === itemID);
    }
  }
};
