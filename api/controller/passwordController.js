const argon2 = require("argon2");
const nodemailer = require("nodemailer");
const User = require("../model/User");
const PasswordReset = require("../model/PasswordReset");

const transporter = nodemailer.createTransport({
   service: "Gmail",
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
   },
});

const validatePassword = (password) => {
   const minLength = 8;
   const hasUpperCase = /[A-Z]/.test(password);
   const hasLowerCase = /[a-z]/.test(password);
   const hasDigit = /\d/.test(password);
   const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

   if (password.length < minLength) return `Password must be at least ${minLength} characters long.`;
   if (!hasUpperCase) return "Password must contain at least one uppercase letter.";
   if (!hasLowerCase) return "Password must contain at least one lowercase letter.";
   if (!hasDigit) return "Password must contain at least one digit.";
   if (!hasSpecialChar) return "Password must contain at least one special character.";

   return null;
};

const requestPasswordReset = async (req, res) => {
   const { email } = req.body;

   try {
      const userExists = await User.findOne({ email });
      if (!userExists) {
         return res.status(400).json({ error: "Email not found" });
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 300000; // 5 minutes

      await PasswordReset.findOneAndUpdate(
         { email },
         { code, expiresAt },
         { upsert: true, new: true }
      );

      await transporter.sendMail({
         from: process.env.EMAIL_USER,
         to: email,
         subject: "Password Reset",
         html: `Your password reset code is: <b>${code}</b>`,
      });

      res.status(200).json({ message: "Reset code sent to email" });
   } catch (err) {
      res.status(500).json({ error: "Server error" });
   }
};

const verifyCode = async (req, res) => {
   const { email, code } = req.body;

   try {
      const resetToken = await PasswordReset.findOne({ email, code });
      if (!resetToken || resetToken.expiresAt < Date.now()) {
         return res.status(400).json({ error: "Invalid or expired reset code" });
      }

      res.status(200).json({ message: "Reset code is valid" });
   } catch (err) {
      res.status(500).json({ error: "Server error" });
   }
};

const resetPassword = async (req, res) => {
   const { email, code, newPassword } = req.body;

   const passwordError = validatePassword(newPassword);
   if (passwordError) return res.status(400).json({ error: passwordError });

   try {
      const resetToken = await PasswordReset.findOne({ email, code });
      if (!resetToken || resetToken.expiresAt < Date.now()) {
         return res.status(400).json({ error: "Invalid or expired reset code" });
      }

      const hashedPassword = await argon2.hash(newPassword);
      await User.updateOne({ email }, { password: hashedPassword });
      await PasswordReset.deleteOne({ email, code });

      res.status(200).json({ message: "Password reset successfully" });
   } catch (err) {
      res.status(500).json({ error: "Server error" });
   }
};

module.exports = { requestPasswordReset, resetPassword, verifyCode };