import React, { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
// import homePageImage from "/src/assets/images/pexels-steve-29506613.jpg";
import { toast } from "sonner";

const Registration = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChanged = (e) => {
    const { id, value } = e.target;
    if (id === "username") setUsername(value);
    if (id === "email") setEmail(value);
    if (id === "password") setPassword(value);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) newErrors.username = "Username is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Object.values(errors).forEach((error) => {
        toast.error(error);
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        setRegistrationSuccess(true);
        toast.success("Registration successful! Please check your email for verification instructions.");
        navigate("/verify-email");
      } else if (response.status === 400) {
        const data = await response.json();
        setErrors({ email: "Email already exists. Please log in." });
        toast.error("Email already exists. Please log in.");
      } else {
        const data = await response.json();
        toast.error(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred during registration. Please try again later.");
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
            "Every vote is a voice, every voice is a choice. Empowering you to shape the future, one vote at a time."
          </p>
        </div>

        <div className="w-full lg:w-1/2 bg-custom-second rounded-lg shadow-md p-6 space-y-4 sm:p-8 2xl:h-[38rem]">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
            Create your account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleInputChanged}
                className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Username"
                required
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Your email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleInputChanged}
                className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

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
                  value={password}
                  onChange={handleInputChanged}
                  className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="••••••••"
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
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="w-full text-white bg-custom-blue hover:bg-custom-blue-dark focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                disabled={loading}
              >
                {loading ? "Registering..." : "Sign up"}
              </button>
            </div>

            <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-4 text-center">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Registration;
