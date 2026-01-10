import React from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "../Contexts/ThemeContext";
import Sidebar from "../../Components/Sidebar";

const Dashboard = () => {
  const { theme } = useTheme();

  return (
    <div className={`flex h-screen ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
    }`}>
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className={`flex-1 overflow-auto p-4 sm:p-6 lg:p-8 xl:p-10 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          <div className="w-full mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
