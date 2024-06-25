const express = require('express');
const authRouter = express.Router();
const User = require('../model/User');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
   try {
      return jwt.verify(token, process.env.JWT_SECRET);
   } catch (error) {
      return null;
   }
};

const authMiddleware = async (req, res, next) => {
   const token = req.headers.authorization?.split(' ')[1];
   if (!token) {
      return res.status(401).json({ error: 'No token provided' });
   }

   const decoded = verifyToken(token);
   if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
   }

   req.user = decoded;
   next();
};

authRouter.get('/user-info', authMiddleware, async (req, res) => {
   try {
      const user = await User.findById(req.user.userId).select('username email role');
      if (!user) {
         return res.status(404).json({ error: 'User not found' });
      }
      res.json({ username: user.username, email: user.email, role: user.role });
   } catch (error) {
      console.error('Error fetching user info:', error);
      res.status(500).json({ error: 'Server error' });
   }
});

authRouter.put('/update-username', async (req, res) => {
   try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
         return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
         return res.status(401).json({ error: 'Invalid token' });
      }

      const { username } = req.body;
      const userId = decoded.userId;

      await User.findByIdAndUpdate(userId, { username });
      res.json({ message: 'Username updated successfully' });
   } catch (error) {
      res.status(500).json({ error: 'Server error' });
   }
});

authRouter.put('/change-password', async (req, res) => {
   try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
         return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
         return res.status(401).json({ error: 'Invalid token' });
      }

      const { currentPassword, newPassword } = req.body;
      const userId = decoded.userId;

      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({ error: 'User not found' });
      }

      const isMatch = await argon2.verify(user.password, currentPassword);
      if (!isMatch) {
         return res.status(400).json({ error: 'Current password is incorrect' });
      }

      const hashedPassword = await argon2.hash(newPassword);
      user.password = hashedPassword;
      await user.save();

      res.json({ message: 'Password changed successfully' });
   } catch (error) {
      res.status(500).json({ error: 'Server error' });
   }
});

module.exports = authRouter;