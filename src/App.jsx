import Overview from "./Pages/DashboardsOutlets/Overview";
import Analytics from "./Pages/DashboardsOutlets/Analytics";
import ProfilePage from "./Pages/DashboardsOutlets/ProfilePage";
import Notifications from "./Pages/DashboardsOutlets/Notifications";
import Help from "./Pages/DashboardsOutlets/Help";
import Vote from "./Pages/DashboardsOutlets/Vote";
import History from "./Pages/DashboardsOutlets/History";
import CreateContest from "./Pages/DashboardsOutlets/CreateContest";
import ActivePolls from "./Pages/DashboardsOutlets/ActivePolls";
import Results from "./Pages/DashboardsOutlets/Results";
import QuickActions from "./Pages/DashboardsOutlets/QuickActions";
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Pages/Contexts/AuthContext';
import { NotificationProvider } from './Pages/Contexts/NotificationContext';
import HomePage from './Pages/LandingPage/HomePage';
import Login from './Pages/AuthenticationPage/Login';
import Registration from './Pages/AuthenticationPage/Registration';
import About from './Pages/About';
import Contact from './Pages/Contact';
import NotFound from './Pages/NotFound';
import Dashboard from './Pages/Dashboard/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, currentUserLoading } = useAuth();

  if (currentUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, currentUserLoading } = useAuth();

  if (currentUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <HomePage />
            </PublicRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/vote/:contestId" element={<Vote />} />

        {/* Authentication Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Registration />
            </PublicRoute>
          }
        />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="vote" element={<Vote />} />
          <Route path="create-contest" element={<CreateContest />} />
          <Route path="polls" element={<ActivePolls />} />
          <Route path="results" element={<Results />} />
          <Route path="quick-actions" element={<QuickActions />} />
          <Route path="history" element={<History />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="help" element={<Help />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
