const argon2 = require("argon2");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const VerificationCode = require("../model/VerificationCode");

const transporter = nodemailer.createTransport({
   service: "Gmail",
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
   },
});

const ROLE_CODES = {
   [process.env.ADMIN_ROLE_CODE]: "admin",
   [process.env.CASHIER_ROLE_CODE]: "cashier",
};

const generateVerificationCode = () =>
   Math.floor(100000 + Math.random() * 900000).toString();

const sendVerificationCode = async (email, code) => {
   try {
      await transporter.sendMail({
         from: "Medinet System" + process.env.EMAIL_USER,
         to: email,
         subject: "Email Verification Code",
         html: `Your verification code is: <b>${code}</b>`,
      });
   } catch (error) {
      console.error("Error sending verification code:", error);
   }
};

const validateEmail = (email) =>
   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

const register = async (req, res) => {
   const { username, email, password, roleCode } = req.body;

   if (!validateEmail(email)) return res.status(400).json({ error: "Invalid email format" });

   const passwordError = validatePassword(password);
   if (passwordError) return res.status(400).json({ error: passwordError });

   try {
      // Check if the user with the same email or username already exists
      if (await User.exists({ $or: [{ username }, { email }] })) {
         return res.status(400).json({ error: "Username or email already taken" });
      }

      const role = ROLE_CODES[roleCode];
      if (!role) return res.status(400).json({ error: "Invalid role code" });

      const hashedPassword = await argon2.hash(password);
      const verificationCode = generateVerificationCode();

      // Invalidate any previous verification codes
      await VerificationCode.deleteMany({ email });

      // Save the new verification code
      await VerificationCode.create({ email, code: verificationCode, username, password: hashedPassword, roleCode });
      await sendVerificationCode(email, verificationCode);

      res.status(201).json({ message: "User registration initiated. Please verify your email." });
   } catch (err) {
      res.status(500).json({ error: "Server error, please try again later." });
   }
};

const verifyEmail = async (req, res) => {
   const { email, code } = req.body;

   if (!validateEmail(email)) return res.status(400).json({ error: "Invalid email format" });

   try {
      // Find the most recent verification code
      const verificationCode = await VerificationCode.findOne({ email, code });

      if (!verificationCode) return res.status(400).json({ error: "Invalid or expired verification code" });

      const { username, password, roleCode } = verificationCode;
      const role = ROLE_CODES[roleCode];
      if (!role) return res.status(400).json({ error: "Invalid role code" });

      // Create the user and delete the verification code
      await User.create({ username, password, email, role });
      await VerificationCode.deleteMany({ email }); // Ensure all old codes are removed

      res.status(201).json({ message: "Email verified and user registered successfully." });
   } catch (err) {
      res.status(500).json({ error: "Server error, please try again later." });
   }
};

const login = async (req, res) => {
   const { email, password } = req.body;

   try {
      const user = await User.findOne({ email });
      if (!user || !(await argon2.verify(user.password, password))) {
         return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
         { userId: user._id, username: user.username, role: user.role },
         process.env.JWT_SECRET,
         { expiresIn: "7d" }
      );

      res.status(200).json({ token });
   } catch (err) {
      res.status(500).json({ error: "Server error, please try again later." });
   }
};

module.exports = { register, verifyEmail, login };
