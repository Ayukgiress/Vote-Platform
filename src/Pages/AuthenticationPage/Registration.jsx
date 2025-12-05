import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiUser,
  FiArrowRight,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { toast } from "sonner";
import { useTheme } from "../Contexts/ThemeContext";
import Footer from "../../Components/Footer";
import LogoImage from "/src/assets/images/2fa8fddc3b07465da808456a6a979854-free.png";
import API_URL from "../Constants/Constants";

const Registration = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setLoading(false);

      const responseText = await response.text();
      console.log("Response Text:", responseText);

      if (response.ok) {
        const responseData = JSON.parse(responseText);
        toast.success(
          "Registration successful! Please check your email for verification instructions."
        );
        navigate("/verify-email");
      } else {
        let errorData = {};
        try {
          errorData = JSON.parse(responseText);
        } catch (error) {
          errorData = { message: "Unknown error occurred" };
        }
        console.log("Error Data:", errorData);
        toast.error(errorData.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        "An error occurred during registration. Please try again later."
      );
      setLoading(false);
    }
  };

  return (
    <>
      <section className={`relative flex min-h-screen items-center justify-center text-white ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
          : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
      }`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_45%),_radial-gradient(circle_at_bottom,_rgba(129,140,248,0.14),_transparent_40%)]" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6 md:flex-row md:px-12">
          <div className="flex w-full flex-col justify-center gap-6 md:w-2/5">
            <div className="flex items-center gap-3">
              <img
                src={LogoImage}
                alt="VoteHub logo"
                className={`h-12 w-auto rounded-md p-2 ${
                  theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'
                }`}
              />
              <span className={`text-sm font-semibold uppercase tracking-[0.28em] ${
                theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
              }`}>
                Choosify
              </span>
            </div>
            <h1 className={`text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Your secure, human-centered voting platform starts here.
            </h1>
            <p className={`text-base sm:text-lg ${
              theme === 'dark' ? 'text-slate-200' : 'text-gray-600'
            }`}>
              Design elections, configure nominations, and coordinate voting
              experiences that scale with your organization.
            </p>
            <div className={`grid gap-4 text-sm ${
              theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
            }`}>
              <div className={`rounded-2xl border p-4 ${
                theme === 'dark'
                  ? 'border-white/10 bg-white/5'
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                }`}>Compliance ready</p>
                <p className={`mt-2 text-xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  GDPR & SOC2 aligned
                </p>
              </div>
              <div className={`rounded-2xl border p-4 ${
                theme === 'dark'
                  ? 'border-white/10 bg-white/5'
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                }`}>Support coverage</p>
                <p className={`mt-2 text-xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  24/7 launch engineers
                </p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/5">
            <div className={`rounded-3xl border p-8 backdrop-blur ${
              theme === 'dark'
                ? 'border-white/10 bg-white/5'
                : 'border-gray-200 bg-white/80'
            }`}>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className={`text-2xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Create your organization
                  </h2>
                  <p className={`mt-1 text-sm ${
                    theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                  }`}>
                    We’ll guide you through a secure onboarding in just a few
                    steps.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    className={`inline-flex items-center text-sm font-medium transition ${
                      theme === 'dark'
                        ? 'text-sky-300 hover:text-sky-200'
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    Already a member?
                    <FiArrowRight className="ml-1" />
                  </Link>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label
                    className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-slate-200' : 'text-gray-700'
                    }`}
                    htmlFor="username"
                  >
                    Full name
                  </label>
                  <div className="relative">
                    <FiUser className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-gray-400'
                    }`} />
                    <input
                      id="username"
                      type="text"
                      placeholder="Ada Lovelace"
                      className={`w-full rounded-2xl border py-3 pl-12 pr-4 text-sm outline-none transition ${
                        theme === 'dark'
                          ? 'border-white/10 bg-slate-950/60 text-white focus:border-sky-400 focus:bg-slate-950'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:bg-gray-50'
                      }`}
                      {...register("username", {
                        required: "Full name is required",
                      })}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-sm text-rose-400">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-slate-200' : 'text-gray-700'
                    }`}
                    htmlFor="email"
                  >
                    Work email
                  </label>
                  <div className="relative">
                    <FiMail className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-gray-400'
                    }`} />
                    <input
                      id="email"
                      type="email"
                      placeholder="you@organization.com"
                      className={`w-full rounded-2xl border py-3 pl-12 pr-4 text-sm outline-none transition ${
                        theme === 'dark'
                          ? 'border-white/10 bg-slate-950/60 text-white focus:border-sky-400 focus:bg-slate-950'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:bg-gray-50'
                      }`}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^@]+@[^@]+\.[^@]+$/,
                          message: "Enter a valid email",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-rose-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-slate-200' : 'text-gray-700'
                    }`}
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-gray-400'
                    }`} />
                    <input
                      id="password"
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Create a secure password"
                      className={`w-full rounded-2xl border py-3 pl-12 pr-12 text-sm outline-none transition ${
                        theme === 'dark'
                          ? 'border-white/10 bg-slate-950/60 text-white focus:border-sky-400 focus:bg-slate-950'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:bg-gray-50'
                      }`}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Use at least 8 characters",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible((prev) => !prev)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 transition ${
                        theme === 'dark'
                          ? 'text-slate-300 hover:text-white'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {passwordVisible ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    Must contain numbers, letters, and at least one symbol.
                  </p>
                  {errors.password && (
                    <p className="text-sm text-rose-400">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className={`flex w-full items-center justify-center rounded-full py-3 text-sm font-semibold text-white shadow-lg transition ${
                    theme === 'dark'
                      ? 'bg-sky-500 shadow-sky-500/30 hover:bg-sky-400'
                      : 'bg-blue-600 shadow-blue-500/30 hover:bg-blue-700'
                  }`}
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Launch onboarding"}
                </button>
              </form>

              <p className={`mt-6 text-center text-sm ${
                theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
              }`}>
                By continuing you agree to our{" "}
                <a
                  href="#"
                  className={`font-semibold transition ${
                    theme === 'dark'
                      ? 'text-sky-300 hover:text-sky-200'
                      : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className={`font-semibold transition ${
                    theme === 'dark'
                      ? 'text-sky-300 hover:text-sky-200'
                      : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default Registration;
