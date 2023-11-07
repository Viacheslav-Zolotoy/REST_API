const resendEmailVerification = require("./email/resendEmailVerification");
const sendEmail = require('../middlewares/sendEmail');
const verifyEmail = require('./email/verifyEmail');

module.exports = {
    resendEmailVerification,
    sendEmail,
    verifyEmail,
};