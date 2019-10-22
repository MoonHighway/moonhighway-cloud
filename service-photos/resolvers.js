const { ObjectID } = require("mongodb");
const { saveFile } = require("./lib");
const path = require("path");
const fs = require("fs");

const totalPhotos = (_, args, { photos }) => photos.countDocuments();
const allPhotos = (_, args, { photos }) => photos.find().toArray();
const Photo = (_, { id }) => photos.findOne({ _id: ObjectID(id) });
const postPhoto = async (
  _,
  { input: { name, description, category, file } },
  { currentUser, photos }
) => {
  if (!currentUser) {
    throw new Error("only an authorized user can post a photo");
  }

  const newPhoto = {
    name,
    description,
    category,
    user: currentUser,
    created: new Date()
  };

  const { insertedId } = await photos.insertOne(newPhoto);
  newPhoto.id = insertedId.toString();

  var toPath = path.join(__dirname, "assets", "photos", `${newPhoto.id}.jpg`);

  const bucketPath = path.join(__dirname, "..", "bucket", file);
  await saveFile(fs.createReadStream(bucketPath), toPath);
  fs.unlink(bucketPath, f => f);

  return newPhoto;
};

module.exports = {
  Query: {
    totalPhotos,
    allPhotos,
    Photo
  },
  Mutation: {
    postPhoto
  },
  Photo: {
    id: parent => parent.id || parent._id.toString(),
    url: parent =>
      `http://localhost:${process.env.PHOTO_FILE_PORT}/${parent.id ||
        parent._id.toString()}.jpg`,
    postedBy: ({ user }) => ({ email: user }),
    reviews: ({ _id }) => ({ itemID: _id })
  },
  Review: {
    photo: async ({ itemID }, args, { photos }) =>
      photos.findOne({ _id: ObjectID(itemID) })
  },
  User: {
    postedPhotos: ({ email }, args, { photos }) => {
      return photos.find({ user: email }).toArray();
    }
  }
};
