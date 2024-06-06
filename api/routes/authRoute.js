const { register, login } = require("../controller/authController");
const { requestPasswordReset, resetPassword } = require("../controller/passwordController");

const route = require("express").Router();

route.post("/register", register);
route.post("/login", login);
route.post("/request-password-reset", requestPasswordReset);
route.post("/reset-password", resetPassword);

module.exports = route;