import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import API_URL from '../Pages/Constants/Constants';
import Footer from './Footer';
import { FiCheck, FiX, FiLoader } from 'react-icons/fi';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('pending');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/users/verify-email/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setVerificationStatus('success');
          toast.success("Email verified successfully! You can now log in.");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setVerificationStatus('error');
          toast.error(data.message || "Verification failed. Please try again.");
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setVerificationStatus('error');
        toast.error("An error occurred during email verification.");
      }
    };

    verifyEmail();
  }, [token, navigate]);


  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center gap-8 p-8">
        <div className="max-w-md w-full text-center space-y-6">
          {verificationStatus === 'pending' && (
            <>
              <div className="relative">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiLoader className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50 rounded-full opacity-50" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 roboto-condensed-bold">Verifying your email...</h2>
              <p className="text-gray-600 roboto-condensed-regular">Please wait while we verify your email address</p>
            </>
          )}

          {verificationStatus === 'success' && (
            <>
              <div className="relative">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCheck className="w-10 h-10 text-green-600" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-green-50 rounded-full opacity-50" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 roboto-condensed-bold">Email verified successfully!</h2>
              <p className="text-gray-600 roboto-condensed-regular">Your account has been activated. Redirecting to login...</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-6">
                <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
              </div>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              <div className="relative">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiX className="w-10 h-10 text-red-600" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-red-50 rounded-full opacity-50" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 roboto-condensed-bold">Verification failed</h2>
              <p className="text-gray-600 roboto-condensed-regular">We couldn't verify your email. Please try again or contact support.</p>
              <button
                onClick={() => navigate("/login")}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl roboto-condensed-medium"
              >
                Go to Login
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
    </>
  );
};

export default VerifyEmail;