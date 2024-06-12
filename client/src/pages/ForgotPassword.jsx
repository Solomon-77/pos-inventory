import { useState } from "react";
import { Link } from "react-router-dom";
import ResetPassword from "./ResetPassword";

const URL = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
   const [email, setEmail] = useState("");
   const [isResetClicked, setIsResetClicked] = useState(false);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const handleResetClick = async () => {
      setLoading(true);
      setError("");
      try {
         const response = await fetch(`${URL}/request-password-reset`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
         });

         const result = await response.json();

         if (response.ok) {
            setIsResetClicked(true);
         } else {
            setError(result.error || "Failed to send reset code");
         }
      } catch (error) {
         setError("An error occurred");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex flex-col max-w-[360px]">
         {isResetClicked ? (
            <ResetPassword email={email} />
         ) : (
            <>
               <h1 className="text-2xl text-center font-bold">Forgot Password</h1>
               <p className="my-5 text-center text-gray-500 font-medium">
                  Enter your email address and we'll send you a code to reset your password.
               </p>
               <h1 className="text-sm font-semibold mb-2">Email Address</h1>
               <input
                  type="email"
                  placeholder="user@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-400 rounded-md px-3 py-2 text-sm mb-4"
               />
               {error && <p className="text-red-500 text-sm mb-4 font-semibold">{error}</p>}
               <button
                  onClick={handleResetClick}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md py-3 text-sm"
                  disabled={loading}
               >
                  {loading ? "Sending..." : "Reset Password"}
               </button>
               <Link to="/login" className="text-center mt-4 text-sm hover:underline">
                  Go back to login
               </Link>
            </>
         )}
      </div>
   );
};

export default ForgotPassword;