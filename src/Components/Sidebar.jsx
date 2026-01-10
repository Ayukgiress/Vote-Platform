import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoSettingsOutline } from "react-icons/io5";
import Profile from './Profile';
import ContestModal from './Modals/ContestModal';
import { useNotifications } from '../Pages/Contexts/NotificationContext';
import {
  Home,
  Clock,
  Users,
  BarChart3,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Plus,
  FileText,
  Zap,
  Settings
} from 'lucide-react';

const NAVIGATION_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/dashboard', label: 'Overview', icon: Users },
  { path: '/dashboard/create-contest', label: 'Create Contest', icon: Plus, action: 'modal' },
  { path: '/dashboard/polls', label: 'Active Polls', icon: FileText },
  { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/dashboard/history', label: 'History', icon: Clock },
  { path: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { path: '/dashboard/quick-actions', label: 'Quick Actions', icon: Zap },
  { path: '/dashboard/help', label: 'Help', icon: HelpCircle },
  { path: '/dashboard/profile', label: 'Settings', icon: Settings }
];

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isContestModalOpen, setIsContestModalOpen] = useState(false);
  const location = useLocation();
  const { unreadCount } = useNotifications();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-900 text-white shadow-lg lg:hidden hover:bg-slate-800 transition-colors"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen
          bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950
          transform transition-all duration-300 ease-in-out
          flex flex-col z-50
          border-r border-slate-800/50
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/50 min-h-[73px]">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <h1 className="text-white text-xl font-bold">
                Choosify
              </h1>
            </div>
          )}
          
          {/* Desktop Collapse Button */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/50 transition-all duration-200 ml-auto"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
          
          {/* Mobile Close Button */}
          {isMenuOpen && (
            <button
              onClick={toggleMenu}
              className="lg:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/50 transition-all ml-auto"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <ul className="flex flex-col gap-1">
            {NAVIGATION_ITEMS.map(({ path, label, icon: Icon, action }) => {
              const isActive = location.pathname === path;

              if (action === 'modal') {
                return (
                  <li key={path}>
                    <button
                      onClick={() => {
                        setIsContestModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg w-full
                        transition-all duration-200 group relative
                        text-slate-400 hover:bg-slate-800/50 hover:text-white
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                      title={isCollapsed ? label : ''}
                    >
                      {/* Icon */}
                      <div className="relative">
                        {typeof Icon === 'function' ? (
                          <Icon className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>

                      {/* Label */}
                      {!isCollapsed && (
                        <span className="font-medium text-sm">
                          {label}
                        </span>
                      )}

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                          {label}
                        </div>
                      )}
                    </button>
                  </li>
                );
              }

              return (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg w-full
                      transition-all duration-200 group relative
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                      }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                    title={isCollapsed ? label : ''}
                  >
                    {/* Icon */}
                    <div className="relative">
                      {typeof Icon === 'function' ? (
                        <Icon className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                      {isActive && !isCollapsed && (
                        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r" />
                      )}
                    </div>

                    {/* Label */}
                    {!isCollapsed && (
                      <span className="font-medium text-sm">
                        {label}
                      </span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        {label}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Profile Section */}
        <div className="p-3 border-t border-slate-800/50">
          {isCollapsed ? (
            <div className="flex justify-center">
              <Link 
                to="/dashboard/profile"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center hover:scale-105 transition-transform"
              >
                <span className="text-white font-bold">JD</span>
              </Link>
            </div>
          ) : (
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-3 border border-slate-700/30 hover:border-slate-600/50 transition-colors">
              <Profile />
            </div>
          )}
        </div>
      </aside>

      {/* Contest Modal */}
      <ContestModal
        isOpen={isContestModalOpen}
        onClose={() => setIsContestModalOpen(false)}
        setContests={() => {}} // Empty function since we're not managing contests in sidebar
      />
    </>
  );
};

export default Sidebar;