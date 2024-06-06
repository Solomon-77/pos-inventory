const nodemailer = require("nodemailer");
const argon2 = require("argon2");
const User = require("../model/User");

const requestPasswordReset = async (req, res) => {
   const { email } = req.body;

   try {
      const user = await User.findOneAndUpdate(
         { email },
         {
            $set: {
               resetPasswordToken: Math.floor(100000 + Math.random() * 900000).toString(), // 6 digits
               resetPasswordExpires: Date.now() + 3000, // 5 minutes
            }
         },
         { new: true }
      );

      if (!user) return res.status(400).json({ error: "Email not found" });

      const transporter = nodemailer.createTransport({
         service: "Gmail",
         auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
         },
      });

      await transporter.sendMail({
         from: process.env.EMAIL_USER,
         to: email,
         subject: "Password Reset",
         text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                Please copy this code and paste it in the application to reset your password:\n\n
                Code: ${user.resetPasswordToken}\n\n
                If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      });
      res.status(200).json({ message: "Reset code sent to email" });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};

const resetPassword = async (req, res) => {
   const { email, resetCode, newPassword } = req.body;

   try {
      const hashedPassword = await argon2.hash(newPassword);

      const user = await User.findOneAndUpdate(
         {
            email,
            resetPasswordToken: resetCode,
            resetPasswordExpires: { $gt: Date.now() }
         },
         {
            $set: { password: hashedPassword },
            $unset: { resetPasswordToken: "", resetPasswordExpires: "" }
         },
         { new: true }
      );

      if (!user) return res.status(400).json({ error: "Invalid or expired reset token" });

      res.status(200).json({ message: "Password reset successfully" });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};

module.exports = { requestPasswordReset, resetPassword };