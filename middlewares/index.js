const validateBody = require("./validateBody");
const isValidId = require("./isValidId");
const authentication = require("./authentication");
const upload = require("./upload");
const resizeAvatar = require("./resizeAvatar");

module.exports = {
  isValidId,
  validateBody,
  authentication,
  upload,
  resizeAvatar,
};
