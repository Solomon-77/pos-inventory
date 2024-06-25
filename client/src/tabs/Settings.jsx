import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const URL = import.meta.env.VITE_API_URL;

const Settings = () => {
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setEmail(decodedToken.email);
    }
  }, []);

  const handleSaveProfile = async () => {
    if (!username.trim()) {
      setMessage('Username cannot be empty');
      return;
    }

    try {
      const response = await axios.put(`${URL}/update-username`, { username }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage(response.data.message);
      setUsername('');
      window.location.reload();
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) return 'Password must be at least 8 characters long.';
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter.';
    if (!hasLowerCase) return 'Password must contain at least one lowercase letter.';
    if (!hasDigit) return 'Password must contain at least one digit.';
    if (!hasSpecialChar) return 'Password must contain at least one special character.';

    return null;
  };

  const handleChangePassword = async () => {

    if (!currentPassword.trim()) {
      setMessage('Current password cannot be empty');
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setMessage(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    try {
      const response = await axios.put(`${URL}/change-password`, {
        currentPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage(response.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className='text-center mb-4 font-bold text-lg'>Update User Profile</h1>
      {message && <p className="text-center mb-4 font-medium text-red-500">{message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md p-6 rounded-md">
          <h2 className="text-lg font-bold mb-4">Profile Information</h2>
          <div className="mb-4">
            <label className="block font-medium mb-2 text-sm" htmlFor="username">Username</label>
            <input
              id="username"
              className="w-full px-4 py-2 rounded-md outline-none border border-gray-300 text-sm"
              placeholder="New Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2 text-sm">Email</label>
            <p className="font-bold">{email}</p>
          </div>
          <button
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-300"
            onClick={handleSaveProfile}
          >
            Save Profile
          </button>
        </div>

        <div className="bg-white shadow-md p-6 rounded-md">
          <h2 className="text-lg font-bold mb-4">Change Password</h2>
          <div className="mb-4">
            <label className="block font-medium text-sm mb-2" htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              className="w-full px-4 py-2 rounded-md outline-none border border-gray-300 text-sm"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-sm mb-2" htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              className="w-full px-4 py-2 rounded-md outline-none border border-gray-300 text-sm"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-sm mb-2" htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              className="w-full px-4 py-2 rounded-md outline-none border border-gray-300 text-sm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-300"
            onClick={handleChangePassword}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings;