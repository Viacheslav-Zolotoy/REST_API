const bcrypt = require("bcryptjs");
const { User } = require("../../models");
const { ctrlWrapper } = require("../../helpers");
const gravatar = require("gravatar");
require("dotenv").config();
const { sendEmail } = require("../../middlewares");
const { BASE_URL } = process.env;
const { nanoid } = require("nanoid");

const signup = async (req, res) => {
  const { email, password } = req.body;
  const verificationToken = nanoid();
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: newUser.email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/users/verify/${newUser.verificationToken}">Verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      user: {
        name: newUser.name,

        email: newUser.email,
        subscription: "starter",
      },
    },
  });
};
module.exports = ctrlWrapper(signup);
