import { useState, useEffect } from "react";
import { Route, Routes, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthProvider } from "./Pages/Contexts/AuthContext";
import { useTheme } from "./Pages/Contexts/ThemeContext";
import HomePage from "./Pages/LandingPage/HomePage";
import Login from "./Pages/AuthenticationPage/Login";
import Registration from "./Pages/AuthenticationPage/Registration";
import { Toaster } from "sonner";
import { FiSun, FiMoon, FiGlobe } from "react-icons/fi";
import LogoImage from "/src/assets/images/2fa8fddc3b07465da808456a6a979854-free.png";
import VerifyEmails from "./Components/VerifyEmails";
import VerifyEmail from "./Components/VerifyEmail";
import Dashboard from "./Pages/Dashboard/Dashboard";
import History from "./Pages/DashboardsOutlets/History";
import Overview from "./Pages/DashboardsOutlets/Overview";
import Analytics from "./Pages/DashboardsOutlets/Analytics";
import ProfilePage from "./Pages/DashboardsOutlets/ProfilePage";
import Notifications from "./Pages/DashboardsOutlets/Notifications";
import Help from "./Pages/DashboardsOutlets/Help";
import Vote from "./Pages/DashboardsOutlets/Vote";
import Footer from "./Components/Footer";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const handleClick = (event) => {
      const href = event.target.getAttribute("href");
      if (href && href.startsWith("#")) {
        event.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  const isAuthOrVoteRoute = location.pathname === "/login" || location.pathname === "/register" || location.pathname.match(/^\/\w+\/vote$/);

  return (
    <AuthProvider>
      <Toaster richColors />
      <div className={`min-h-screen ${
        theme === 'dark'
          ? 'bg-slate-950 text-white'
          : 'bg-white text-gray-900'
      }`}>
        {!isDashboardRoute && !isAuthOrVoteRoute && (
          <header className={`sticky top-0 z-50 border-b backdrop-blur ${
            theme === 'dark'
              ? 'border-white/10 bg-slate-950/95'
              : 'border-gray-200 bg-white/95'
          }`}>
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 md:px-12">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src={LogoImage}
                  alt="VoteHub logo"
                  className="h-10 w-auto rounded-md"
                />
                <span className={`text-lg font-semibold tracking-wide ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  VoteHub
                </span>
              </Link>

              <button
                type="button"
                className={`inline-flex items-center rounded-full border p-2 transition hover:bg-white/10 sm:hidden ${
                  theme === 'dark'
                    ? 'border-white/10 text-white'
                    : 'border-gray-300 text-gray-900'
                }`}
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation"
              >
                <span className="relative flex h-5 w-6 flex-col justify-between">
                  <span className="h-0.5 rounded bg-current" />
                  <span className="h-0.5 rounded bg-current" />
                  <span className="h-0.5 rounded bg-current" />
                </span>
              </button>

              <ul className={`hidden items-center gap-8 text-sm font-medium sm:flex ${
                theme === 'dark' ? 'text-slate-100' : 'text-gray-900'
              }`}>
                <li>
                  <a className="transition hover:text-sky-400" href="#features">
                    {t('nav.features')}
                  </a>
                </li>
                <li>
                  <a className="transition hover:text-sky-400" href="#categories">
                    {t('nav.useCases')}
                  </a>
                </li>
                <li>
                  <a className="transition hover:text-sky-400" href="#roadmap">
                    {t('nav.howItWorks')}
                  </a>
                </li>
                <li>
                  <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-lg transition ${
                      theme === 'dark'
                        ? 'hover:bg-white/10'
                        : 'hover:bg-gray-100'
                    }`}
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? <FiSun className="h-5 w-5 text-yellow-400" /> : <FiMoon className="h-5 w-5 text-gray-600" />}
                  </button>
                </li>
                <li>
                  <button
                    onClick={toggleLanguage}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      theme === 'dark'
                        ? 'border-white/10 text-white hover:bg-white/10'
                        : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                    }`}
                    aria-label="Toggle language"
                  >
                    <FiGlobe className="h-4 w-4" />
                    {i18n.language === 'en' ? 'FR' : 'EN'}
                  </button>
                </li>
                <li>
                  <Link className="transition hover:text-sky-400" to="/login">
                    {t('nav.logIn')}
                  </Link>
                </li>
                <li>
                  <Link
                    className="inline-flex items-center rounded-full bg-sky-500 px-4 py-2 text-white transition hover:bg-sky-400"
                    to="/register"
                  >
                    {t('nav.getStarted')}
                  </Link>
                </li>
              </ul>
            </nav>

            {isMenuOpen && (
              <div className={`border-t px-4 pb-6 pt-2 font-medium backdrop-blur sm:hidden ${
                theme === 'dark'
                  ? 'border-white/10 bg-slate-950/95 text-slate-100'
                  : 'border-gray-200 bg-white/95 text-gray-900'
              }`}>
                <ul className="space-y-4">
                  <li>
                    <a className="block" href="#hero">
                      {t('nav.home')}
                    </a>
                  </li>
                  <li>
                    <a className="block" href="#features">
                      {t('nav.features')}
                    </a>
                  </li>
                  <li>
                    <a className="block" href="#categories">
                      {t('nav.useCases')}
                    </a>
                  </li>
                  <li>
                    <a className="block" href="#roadmap">
                      {t('nav.howItWorks')}
                    </a>
                  </li>
                  <li>
                    <Link className="block" to="/login">
                      {t('nav.logIn')}
                    </Link>
                  </li>
                  <li>
                    <Link className="block" to="/register">
                      {t('nav.getStarted')}
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={toggleTheme}
                      className="block p-2 rounded-lg transition hover:bg-gray-100"
                      aria-label="Toggle theme"
                    >
                      {theme === 'dark' ? <FiSun className="h-5 w-5 text-yellow-400" /> : <FiMoon className="h-5 w-5 text-gray-600" />}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={toggleLanguage}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                        theme === 'dark'
                          ? 'border-white/10 text-white hover:bg-white/10'
                          : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                      }`}
                      aria-label="Toggle language"
                    >
                      <FiGlobe className="h-4 w-4" />
                      {i18n.language === 'en' ? 'FR' : 'EN'}
                    </button>
                  </li>
                  <li>
                    <Link className="block" to="/register">
                      {t('nav.getStarted')}
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </header>
        )}



        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/verify-email" element={<VerifyEmails />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />

            <Route path="/:contestId/vote" element={<Vote />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Overview />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="contests" element={<Overview />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="history" element={<History />} />
              <Route path="help" element={<Help />} />
            </Route>
          </Routes>
        </main>
        {!isDashboardRoute && !isAuthOrVoteRoute && <Footer />}
        </div>
      </AuthProvider>
  );
};

export default App;
