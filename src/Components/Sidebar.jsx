import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoSettingsOutline } from "react-icons/io5";

import Profile from './Profile';
import {
  Home,
  Clock,
  Award,
  Users,
  BarChart3,
  User,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const NAVIGATION_ITEMS = [
  { path: '/', label: 'Home', icon: <Home className="h-5 w-5" /> },
  { path: '/dashboard', label: 'Overview', icon: <Users className="h-5 w-5" /> },
  { path: '/dashboard/notifications', label: 'Notifications', icon: <Bell className="h-5 w-5" /> },
    { path: '/dashboard/history', label: 'History', icon: <Clock className="h-5 w-5" /> },
 { path: '/dashboard/analytics', label: 'Analytics', icon: <BarChart3 className="h-5 w-5" /> },
   { path: '/dashboard/profile', label: 'Settings', icon: <IoSettingsOutline className="h-5 w-5" /> },
  { path: '/dashboard/help', label: 'Help', icon: <HelpCircle className="h-5 w-5" /> }
];

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <>

      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg text-black sm:hidden"
        aria-label="Toggle menu"
      >
        <span className="text-2xl">☰</span>
      </button>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={toggleMenu}
        />
      )}

      <aside
        className={`
          fixed sm:static top-0 left-0 h-screen
          bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
          transform transition-all duration-300 ease-in-out
          flex flex-col z-50 sm:translate-x-0 shadow-2xl
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'w-16' : 'w-64'}
        `}
      >
        <div className="flex flex-col h-screen">
          <div className="p-4 flex items-center justify-between border-b border-slate-700/50">
            {!isCollapsed && (
              <h1 className="text-white text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Choosify
              </h1>
            )}
            <button
              onClick={toggleCollapse}
              className="hidden sm:flex text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200"
              aria-label="Toggle sidebar"
            >
              {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            {isMenuOpen && (
              <button
                onClick={toggleMenu}
                className="sm:hidden text-white p-2"
                aria-label="Close menu"
              >
                <span className="text-2xl">×</span>
              </button>
            )}
          </div>

          <nav className="flex-1 p-4">
            <ul className="flex flex-col gap-2">
              {NAVIGATION_ITEMS.map(({ path, label, icon }) => (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl w-full
                      hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600
                      transition-all duration-200 group
                      ${location.pathname === path
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                        : 'hover:shadow-md'
                      }
                    `}
                    title={isCollapsed ? label : ''}
                  >
                    <div className={`
                      ${location.pathname === path ? 'text-white' : 'text-slate-300 group-hover:text-white'}
                      transition-colors duration-200
                    `}>
                      {React.cloneElement(icon, {
                        className: `${icon.props.className} ${location.pathname === path ? 'text-white' : 'text-slate-300 group-hover:text-white'}`
                      })}
                    </div>
                    {!isCollapsed && (
                      <span className={`
                        ${location.pathname === path ? 'text-white font-medium' : 'text-slate-300 group-hover:text-white'}
                        transition-colors duration-200
                      `}>
                        {label}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {!isCollapsed && (
            <div className="p-4 border-t border-slate-700/50">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30">
                <Profile />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
