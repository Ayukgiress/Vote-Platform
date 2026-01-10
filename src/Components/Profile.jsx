import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CiLogout } from "react-icons/ci";
import { useAuth } from "../Pages/Contexts/AuthContext";
import { UserCircle, Mail, LogOut } from "lucide-react";

const Profile = () => {
  const { currentUser, currentUserLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUserLoading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, currentUserLoading, navigate]);

  const handleLogout = () => {
    console.log('Logging out...');
    logout();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  if (currentUserLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-neutral-900">
        <div className="animate-pulse text-lg text-gray-300">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; 
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* User Info Section */}
      <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">
            {currentUser.username?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate">
            {currentUser.username || 'User'}
          </p>
          <div className="flex items-center gap-1">
            <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <p className="text-slate-400 text-xs truncate">
              {currentUser.email}
            </p>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 px-3 py-2 rounded-lg transition-all duration-200 group"
      >
        <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
        <span className="font-medium text-sm">Logout</span>
      </button>
    </div>
  );
};

export default Profile;