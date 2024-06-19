import { useState } from "react";
import { Link } from "react-router-dom";
import VerifyEmail from "./VerifyEmail";

const URL = import.meta.env.VITE_API_URL;

const Signup = () => {
   const [formData, setFormData] = useState({
      username: '',
      email: '',
      accessCode: '',
      password: '',
      confirmPassword: '',
   });
   const [isSignedUp, setIsSignedUp] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleSignup = async (e) => {
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
         setError("Passwords do not match");
         return;
      }
      setIsLoading(true);
      try {
         const response = await fetch(`${URL}/register`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               username: formData.username,
               email: formData.email,
               password: formData.password,
               roleCode: formData.accessCode,
            }),
         });
         const data = await response.json();
         if (!response.ok) throw new Error(data.error);
         setIsSignedUp(true);
      } catch (err) {
         setError(err.message);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="     flex-col items-center w-full max-w-[360px]">
         {!isSignedUp ? (
            <form onSubmit={handleSignup} className="flex flex-col w-full">
               <h1 className="text-3xl font-semibold mb-4">Sign up</h1>
               {error && <p className="text-red-500 mb-4 text-sm font-semibold">{error}</p>}
               <h1 className="text-sm font-semibold">Name</h1>
               <input
                  type="text"
                  name="username"
                  value={formData.username}
                  required
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="mb-4 border border-gray-400 rounded-md px-3 py-2 text-sm mt-2"
               />
               <h1 className="text-sm font-semibold">Email</h1>
               <input
                  type="text"
                  name="email"
                  value={formData.email}
                  required
                  onChange={handleChange}
                  placeholder="user@gmail.com | use gmail only"
                  className="mb-4 border border-gray-400 rounded-md px-3 py-2 text-sm mt-2"
               />
               <h1 className="text-sm font-semibold">Access Code</h1>
               <input
                  type="text"
                  name="accessCode"
                  value={formData.accessCode}
                  required
                  onChange={handleChange}
                  placeholder="ex. ABC345"
                  className="mb-4 border border-gray-400 rounded-md px-3 py-2 text-sm mt-2"
               />
               <h1 className="text-sm font-semibold">Password</h1>
               <input
                  type="password"
                  name="password"
                  value={formData.password}
                  required
                  placeholder="Abcd123."
                  onChange={handleChange}
                  className="mb-4 border border-gray-400 rounded-md px-3 py-2 text-sm mt-2"
               />
               <h1 className="text-sm font-semibold">Confirm Password</h1>
               <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  required
                  onChange={handleChange}
                  className="mb-5 border border-gray-400 rounded-md px-3 py-2 text-sm mt-2"
               />
               <button
                  type="submit"
                  className="mb-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md py-3 text-sm"
                  disabled={isLoading}
               >
                  {isLoading ? 'Signing up...' : 'Sign up'}
               </button>
               <Link to="/login" className="text-center text-sm hover:underline">
                  Already have an account? Sign in
               </Link>
            </form>
         ) : (
            <VerifyEmail email={formData.email} />
         )}
      </div>
   );
};

export default Signup;