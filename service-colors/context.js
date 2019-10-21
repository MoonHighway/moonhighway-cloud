const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const writeFile = promisify(fs.writeFile);

let colors = require("./color.data.json");
const saveColors = async (newColors = colors) => {
  const fileName = path.join(__dirname, "color.data.json");
  const fileContents = JSON.stringify(newColors, null, 2);
  try {
    await writeFile(fileName, fileContents);
    colors = newColors;
    console.log(`${colors.length} colors saved`);
  } catch (error) {
    console.error("Error saving colors");
    console.error(error);
  }
};

const createContext = () => ({ req }) => ({
  colors,
  saveColors,
  currentUser: req.headers["user-email"]
});

module.exports = { createContext };
