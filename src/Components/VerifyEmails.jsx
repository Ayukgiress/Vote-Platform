import React from 'react';
import Footer from './Footer';
import { FiMail, FiClock } from 'react-icons/fi';

const VerifyEmails = () => {
  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center gap-8 p-8">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiMail className="w-10 h-10 text-blue-600" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50 rounded-full opacity-50" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 roboto-condensed-bold">
            Email Verification Link Sent Successfully
          </h1>

          <p className="text-gray-600 roboto-condensed-regular text-lg">
            Please check your inbox and click the link to verify your email. It expires in an hour.
          </p>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <FiMail className="w-5 h-5 text-blue-600" />
              <span className="roboto-condensed-regular">Check your email inbox</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <FiClock className="w-5 h-5 text-blue-600" />
              <span className="roboto-condensed-regular">Link expires in 1 hour</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 roboto-condensed-regular">
            Didn't receive the email? Check your spam folder or contact support.
          </p>
        </div>
      </div>
      <Footer />
    </div>
    </>
  );
};

export default VerifyEmails;