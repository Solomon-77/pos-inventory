import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const URL = import.meta.env.VITE_API_URL;

const Login = () => {

   const [name, setName] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);

   const navigate = useNavigate();

   const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
         const response = await fetch(`${URL}/login`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: name, password }),
         });

         const data = await response.json();
         if (!response.ok) throw new Error(data.error || 'Failed to login');
         const { token } = data;
         localStorage.setItem('token', token);

         navigate('/dashboard');
         window.location.reload();
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   return (
      <form onSubmit={handleLogin} className="flex flex-col w-full max-w-[360px]">
         <h1 className="text-3xl font-semibold mb-4">Sign in</h1>
         {error && <p className="text-red-500 mb-4 text-sm font-semibold">{error}</p>}
         <h1 className="text-sm font-semibold">Username</h1>
         <input
            type="text"
            placeholder="Your Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="mb-4 border border-gray-400 rounded-md px-3 py-2 text-sm mt-2"
         />
         <h1 className="text-sm font-semibold">Password</h1>
         <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="mb-5 border border-gray-400 rounded-md px-3 py-2 text-sm mt-2"
         />
         <button
            type="submit"
            className={`mb-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md py-3 text-sm ${loading ? 'cursor-not-allowed' : ''}`}
            disabled={loading}
         >
            {loading ? 'Signing in...' : 'Sign in'}
         </button>
         <div className="flex justify-between">
            <Link to="/signup" className="text-sm hover:underline">Don't have an account? Sign up</Link>
            <Link to="/forgot-password" className="text-sm hover:underline">Forgot Password?</Link>
         </div>
      </form>
   );
};

export default Login;