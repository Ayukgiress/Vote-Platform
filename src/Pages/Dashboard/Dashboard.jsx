import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar';

const Dashboard = () => {
  return (
    <div className='flex items-start justify-start min-h-screen'>
      <div className='w-64 sm:w-1/4'>
        <Sidebar />
      </div>

      <main className='flex flex-col w-full sm:w-3/4 mr-32'>
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
