const { ctrlWrapper, HttpError } = require("../../helpers");
const { User } = require("../../models");
const { BASE_URL } = process.env;
const { sendEmail } = require("../../middlewares");

const resendEmailVerification = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new HttpError(400, "missing required field email");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  if (user.verify) {
    throw new HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: user.email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/users/verify/${user.verificationToken}">Verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({
    code: 200,
    message: "Verification email sent",
  });
};

module.exports = ctrlWrapper(resendEmailVerification);
