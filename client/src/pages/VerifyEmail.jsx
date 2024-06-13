import { useState } from "react";
import { Link } from "react-router-dom";

const URL = import.meta.env.VITE_API_URL;

const VerifyEmail = ({ email }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const response = await fetch(`${URL}/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setIsVerified(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[360px]">
      {!isVerified ? (
        <div className="flex flex-col w-full">
          <h1 className="text-2xl font-bold text-center">Verify your email</h1>
          <p className="text-center text-gray-500 font-medium my-5">
            We've sent a verification code to your email. Please enter the code below to verify your account.
          </p>
          {error && <p className="text-red-500 mb-4 text-sm font-semibold">{error}</p>}
          <h1 className="text-sm font-semibold mb-2">Verification Code</h1>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="ex. 123456"
            className="border border-gray-400 rounded-md px-3 py-2 text-sm mb-5"
            disabled={isLoading} // Disable input when loading
          />
          <button
            onClick={handleVerify}
            className={`bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md py-3 text-sm ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? 'Verifying...' : 'Verify'} {/* Show loading text */}
          </button>
        </div>
      ) : (
        <div className="flex flex-col w-full max-w-[360px]">
          <h1 className="text-2xl font-bold text-center">Email Verified!</h1>
          <p className="text-center text-gray-500 font-medium my-4">Your email has been successfully verified.</p>
          <Link to="/login" className="bg-gray-900 hover:bg-gray-800 text-white text-center font-medium rounded-md py-3 text-sm">Continue to Login</Link>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
