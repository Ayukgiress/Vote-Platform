import React, { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { setRefetchCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = async ({ email, password }) => {
    setLoading(true);
  
    try {
      const response = await fetch(`http://localhost:5000/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Invalid email or password.");
        return;
      }
  
      const data = await response.json();
      localStorage.setItem("token", data.accessToken); 
      toast.success("Login successful");
      navigate("/dashboard");
      setRefetchCurrentUser(prev => !prev);
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <section className="bg-custom-first min-h-screen flex items-center justify-center">
      <div className="flex flex-col lg:flex-row w-full max-w-7xl px-6 py-8 gap-12 lg:gap-24">
        
        {/* Left Content (Text Section) */}
        <div className="flex flex-col justify-center items-start w-full lg:w-1/2">
          <h1 className="text-4xl font-bold text-center lg:text-left text-white mb-4 t">
            It's Your Voice to be Heard
          </h1>
          <p className="text-lg text-center lg:text-left text-white mb-8 md:px-8">
            "Every vote is a voice, every voice is a choice. Empowering you to shape the future, one vote at a time. In a world where every voice matters, your vote is more than just a mark on a ballot—it’s a chance to stand for what you believe in and make a lasting impact."
          </p>
        </div>

        {/* Right Content (Login Form) */}
        <div className="w-full lg:w-1/2 bg-custom-second rounded-lg shadow-md p-6 space-y-4 sm:p-8 2xl:h-[38rem]">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
            Sign in to your account
          </h2>
          <form className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Password
                </label>
                <Link to="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-white"
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button
                type="submit"
                className="w-full text-white bg-custom-blue hover:bg-custom-blue-dark focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
            </div>

            {/* Sign up link */}
            <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-4 text-center">
              Don’t have an account yet?{" "}
              <Link to="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
