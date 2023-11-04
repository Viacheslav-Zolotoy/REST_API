const express = require("express");
const {
  validateBody,
  authentication,
  upload,
  resizeAvatar,
} = require("../../middlewares");
const { schemas } = require("../../models");
const ctrl = require("../../controllers/auth");
const router = express.Router();

router.post("/signup", validateBody(schemas.registrationSchema), ctrl.signup);

router.get("/verify/:verificationToken", ctrl.verifyEmail);

router.post(
  "/verify",
  validateBody(schemas.verifySchema),
  ctrl.resendEmailVerification
);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authentication, ctrl.getCurrent);

router.post("/logout", authentication, ctrl.logout);

router.patch("/", authentication, ctrl.updateSubscription);
router.patch(
  "/avatars",
  authentication,
  upload.single("avatar"),
  resizeAvatar,
  ctrl.updateAvatar
);

module.exports = router;
