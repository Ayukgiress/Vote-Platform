import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiEyeOff, FiMail, FiLock, FiArrowRight, FiSun, FiMoon } from "react-icons/fi";
import { toast } from "sonner";
import { useAuth } from "../Contexts/AuthContext";
import { useTheme } from "../Contexts/ThemeContext";
import Footer from "../../Components/Footer";
import API_URL from "../Constants/Constants";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setRefetchCurrentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    console.log("Submitted data:", data);
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setLoading(false);

      if (response.ok) {
        const { accessToken, refreshToken } = await response.json();
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setRefetchCurrentUser((prev) => !prev);
        toast.success("Login Successfull")
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        toast.error(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-40 border-b ${
        theme === 'dark'
          ? 'border-slate-800/50 bg-slate-950/80'
          : 'border-gray-200/50 bg-white/80'
      } backdrop-blur-md`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 transition hover:opacity-80">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className={`text-lg font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Choosify
            </span>
          </Link>
        </div>
      </div>

      <section className={`relative flex min-h-screen items-center justify-center text-white ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
          : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
      }`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_45%),_radial-gradient(circle_at_bottom,_rgba(16,185,129,0.12),_transparent_40%)]" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6 md:flex-row md:px-12 pt-32">
          <div className="flex w-full flex-col justify-center gap-6 md:w-1/2">
            <span className={`w-fit rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
              theme === 'dark'
                ? 'border-white/10 bg-white/10 text-sky-200'
                : 'border-gray-200 bg-gray-100 text-blue-600'
            }`}>
              Welcome back to Choosify
            </span>
            <h1 className={`text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Manage every election, contest, and decision from one secure console.
            </h1>
            <p className={`text-base sm:text-lg ${
              theme === 'dark' ? 'text-slate-200' : 'text-gray-600'
            }`}>
              Log in to monitor voter turnout, certify results, and keep your community engaged in real time.
            </p>
            <div className={`grid grid-cols-2 gap-4 text-sm sm:text-base ${
              theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
            }`}>
              <div className={`rounded-2xl border p-4 ${
                theme === 'dark'
                  ? 'border-white/10 bg-white/5'
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                }`}>Organization seats</p>
                <p className={`mt-2 text-2xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Unlimited</p>
              </div>
              <div className={`rounded-2xl border p-4 ${
                theme === 'dark'
                  ? 'border-white/10 bg-white/5'
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                }`}>Turnout insights</p>
                <p className={`mt-2 text-2xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Live dashboards</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className={`rounded-3xl border p-8 backdrop-blur ${
              theme === 'dark'
                ? 'border-white/10 bg-white/5'
                : 'border-gray-200 bg-white/80'
            }`}>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className={`text-2xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Sign in</h2>
                  <p className={`mt-1 text-sm ${
                    theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                  }`}>
                    Enter your credentials to access your workspace.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    to="/register"
                    className={`inline-flex items-center text-sm font-medium transition ${
                      theme === 'dark'
                        ? 'text-sky-300 hover:text-sky-200'
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    Create account
                    <FiArrowRight className="ml-1" />
                  </Link>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-slate-200' : 'text-gray-700'
                  }`} htmlFor="email">
                    Work email
                  </label>
                  <div className="relative">
                    <FiMail className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-gray-400'
                    }`} />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@organization.com"
                      className={`w-full rounded-2xl border py-3 pl-12 pr-4 text-sm outline-none transition ${
                        theme === 'dark'
                          ? 'border-white/10 bg-slate-950/60 text-white focus:border-sky-400 focus:bg-slate-950'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:bg-gray-50'
                      }`}
                      {...register("email", { required: "Email is required" })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-rose-400">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-slate-200' : 'text-gray-700'
                  }`} htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-gray-400'
                    }`} />
                    <input
                      id="password"
                      type={passwordVisible ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className={`w-full rounded-2xl border py-3 pl-12 pr-12 text-sm outline-none transition ${
                        theme === 'dark'
                          ? 'border-white/10 bg-slate-950/60 text-white focus:border-sky-400 focus:bg-slate-950'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:bg-gray-50'
                      }`}
                      {...register("password", {
                        required: "Password is required",
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
                  <div className={`flex items-center justify-between text-xs ${
                    theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        className={`h-4 w-4 rounded bg-transparent focus:ring-2 ${
                          theme === 'dark'
                            ? 'border-white/20 text-sky-500 focus:ring-sky-400'
                            : 'border-gray-300 text-blue-600 focus:ring-blue-500'
                        }`}
                      />
                      Remember me
                    </label>
                    <a className={`font-medium transition ${
                      theme === 'dark'
                        ? 'text-sky-300 hover:text-sky-200'
                        : 'text-blue-600 hover:text-blue-700'
                    }`} href="#">
                      Forgot password?
                    </a>
                  </div>
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
                  {loading ? "Signing in..." : "Access dashboard"}
                </button>
              </form>

              <p className={`mt-6 text-center text-sm ${
                theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Need an organization account?{" "}
                <Link to="/register" className={`font-semibold transition ${
                  theme === 'dark'
                    ? 'text-sky-300 hover:text-sky-200'
                    : 'text-blue-600 hover:text-blue-700'
                }`}>
                  Start here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default Login;
