const Jimp = require("jimp");
const { HttpError } = require("../helpers");

const resizeAvatar = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const { path } = req.file;

  try {
    const image = await Jimp.read(path);
    await image.resize(250, 250).write(path);
    next();
  } catch {
    next(HttpError(500, "Error resizing image"));
  }
};

module.exports = resizeAvatar;
