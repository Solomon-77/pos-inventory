const { register, login, verifyEmail } = require("../controller/authController");
const { requestPasswordReset, resetPassword, verifyCode } = require("../controller/passwordController");

const route = require("express").Router();

route.post("/register", register);
route.post("/verify-email", verifyEmail);
route.post("/login", login);
route.post("/verify-code", verifyCode);
route.post("/request-password-reset", requestPasswordReset);
route.post("/reset-password", resetPassword);

module.exports = route;