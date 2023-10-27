const path = require("path");
const fs = require("fs/promises");
const { ctrlWrapper, HttpError } = require("../../helpers");
const { User } = require("../../models");
const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tmpUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tmpUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  const updateUserAvatar = await User.findByIdAndUpdate(_id, { avatarURL });
  if (!updateUserAvatar) {
    throw HttpError(404, "Not found");
  }
  res.json({
    status: "OK",
    code: 200,
    avatarURL,
  });
};

module.exports = ctrlWrapper(updateAvatar);
