import { useState } from 'react';
import { Link } from 'react-router-dom';

const URL = import.meta.env.VITE_API_URL;

const ResetPassword = ({ email }) => {
   const [code, setCode] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [isConfirmed, setIsConfirmed] = useState(false);
   const [isPasswordChanged, setIsPasswordChanged] = useState(false);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const handleCodeVerification = async () => {
      setLoading(true);
      setError(""); // Clear any previous error messages
      try {
         const response = await fetch(`${URL}/verify-code`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, code }),
         });

         if (response.ok) {
            setIsConfirmed(true);
         } else {
            const result = await response.json();
            setError(result.error || "Invalid code");
         }
      } catch (error) {
         setError("An error occurred");
      } finally {
         setLoading(false);
      }
   };

   const handleConfirm = async () => {
      setLoading(true);
      setError(""); // Clear any previous error messages
      try {
         const response = await fetch(`${URL}/reset-password`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, code, newPassword }),
         });

         if (response.ok) {
            setIsPasswordChanged(true);
         } else {
            const result = await response.json();
            setError(result.error || "Failed to reset password");
         }
      } catch (error) {
         setError("An error occurred");
      } finally {
         setLoading(false);
      }
   };

   const handleRegisterPassword = () => {
      if (newPassword !== confirmPassword) {
         setError("Passwords do not match");
         return;
      }
      handleConfirm();
   };

   return (
      <div className="flex flex-col max-w-[360px]">
         {isPasswordChanged ? (
            <>
               <h1 className="text-2xl font-bold text-center">Password Changed Successfully</h1>
               <p className="text-gray-500 text-center font-medium my-5">Your password has been updated. You can now log in with your new password.</p>
               <Link to="/login" className="bg-gray-900 hover:bg-gray-800 text-white text-center font-medium rounded-md py-3 text-sm">Continue to Login</Link>
            </>
         ) : isConfirmed ? (
            <>
               <h1 className="text-2xl text-center font-bold mb-3">Enter your new password</h1>
               <h1 className="text-sm font-semibold">New Password</h1>
               <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border border-gray-400 rounded-md px-3 py-2 text-sm mb-3"
               />
               <h1 className="text-sm font-semibold">Confirm Password</h1>
               <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border border-gray-400 rounded-md px-3 py-2 text-sm mb-4"
               />
               {error && <p className="text-red-500 text-sm mb-4 font-semibold">{error}</p>}
               <button
                  onClick={handleRegisterPassword}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md py-3 text-sm"
                  disabled={loading}
               >
                  {loading ? "Registering..." : "Register Password"}
               </button>
            </>
         ) : (
            <>
               <h1 className="text-2xl text-center font-bold">Confirm Code</h1>
               <p className="my-5 text-center text-gray-500 font-medium">We've sent a reset code to your email. Please enter the code below to reset your password.</p>
               <h1 className="mb-2 text-sm font-semibold">Reset Password Code</h1>
               <input
                  type="text"
                  placeholder="ex. 123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="border border-gray-400 rounded-md px-3 py-2 text-sm mb-4"
               />
               {error && <p className="text-red-500 text-sm mb-4 font-semibold">{error}</p>}
               <button
                  onClick={handleCodeVerification}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md py-3 text-sm"
                  disabled={loading}
               >
                  {loading ? "Confirming..." : "Confirm"}
               </button>
            </>
         )}
      </div>
   );
}

export default ResetPassword;
