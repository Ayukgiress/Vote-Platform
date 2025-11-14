import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
