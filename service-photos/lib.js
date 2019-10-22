const fs = require("fs");

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

const uploadFile = async (file, path) => {
  const { stream } = await file;
  return saveFile(stream, path);
};

module.exports = { saveFile, uploadFile };
