const argon2 = require("argon2");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

const ROLE_CODES = {
   ADMIN100: "admin",
   CASHIER405: "cashier",
};

const register = async (req, res) => {
   const { username, password, email, roleCode } = req.body;

   try {
      const userExists = await User.exists({ username });
      if (userExists) return res.status(400).json({ error: "Username already taken" });

      const emailExists = await User.exists({ email });
      if (emailExists) return res.status(400).json({ error: "Email already taken" });

      const hashedPassword = await argon2.hash(password);

      const role = ROLE_CODES[roleCode];
      if (!role) return res.status(400).json({ error: "Invalid access code" });

      const user = await User.create({
         username,
         password: hashedPassword,
         email,
         role
      });
      res.status(201).json({ message: "User registered successfully.", user });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};

const login = async (req, res) => {
   const { username, password } = req.body;

   try {
      const user = await User.findOne({ username });
      if (!user) return res.status(401).json({ error: "Invalid credentials." });

      const passwordMatch = await argon2.verify(user.password, password);
      if (!passwordMatch) return res.status(401).json({ error: "Invalid credentials." });

      const expirationTime = 60 * 60 * 24 * 7;

      const token = jwt.sign(
         { userId: user._id, role: user.role },
         process.env.JWT_SECRET,
         { expiresIn: expirationTime }
      );
      res.status(200).json({ token });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};

module.exports = { register, login };