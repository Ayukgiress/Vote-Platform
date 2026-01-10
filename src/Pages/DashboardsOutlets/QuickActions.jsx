import React, { useState } from 'react';
import {
  Zap,
  Plus,
  FileText,
  BarChart3,
  Users,
  Settings,
  Share2,
  Download,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../../Pages/Contexts/ThemeContext';
import { toast } from 'sonner';
import ContestModal from '../../Components/Modals/ContestModal';

const QuickActions = () => {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contests, setContests] = useState([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const quickActions = [
    {
      id: 'create-contest',
      title: 'Create Contest',
      description: 'Start a new voting contest',
      icon: Plus,
      color: 'blue',
      action: openModal
    },
    {
      id: 'view-active',
      title: 'Active Polls',
      description: 'See running contests',
      icon: FileText,
      color: 'green',
      action: () => window.location.href = '/dashboard/polls'
    },
    {
      id: 'view-analytics',
      title: 'Analytics',
      description: 'Check contest performance',
      icon: BarChart3,
      color: 'purple',
      action: () => window.location.href = '/dashboard/analytics'
    },
    {
      id: 'manage-contests',
      title: 'Manage Contests',
      description: 'Edit and organize contests',
      icon: Users,
      color: 'orange',
      action: () => window.location.href = '/dashboard'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure your account',
      icon: Settings,
      color: 'gray',
      action: () => window.location.href = '/dashboard/profile'
    },
    {
      id: 'share-platform',
      title: 'Share Platform',
      description: 'Invite others to join',
      icon: Share2,
      color: 'pink',
      action: () => {
        navigator.clipboard.writeText(window.location.origin);
        toast.success('Platform link copied to clipboard!');
      }
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: theme === 'dark'
        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
        : 'bg-blue-50 text-blue-700 border-blue-200',
      green: theme === 'dark'
        ? 'bg-green-500/20 text-green-300 border-green-500/30'
        : 'bg-green-50 text-green-700 border-green-200',
      purple: theme === 'dark'
        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
        : 'bg-purple-50 text-purple-700 border-purple-200',
      orange: theme === 'dark'
        ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
        : 'bg-orange-50 text-orange-700 border-orange-200',
      gray: theme === 'dark'
        ? 'bg-gray-500/20 text-gray-300 border-gray-500/30'
        : 'bg-gray-50 text-gray-700 border-gray-200',
      pink: theme === 'dark'
        ? 'bg-pink-500/20 text-pink-300 border-pink-500/30'
        : 'bg-pink-50 text-pink-700 border-pink-200'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Zap className={`w-8 h-8 ${
          theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
        }`} />
        <div>
          <h1 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Quick Actions
          </h1>
          <p className={`mt-1 ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Fast access to common tasks and features
          </p>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.action}
              className={`p-6 rounded-2xl border transition-all duration-200 hover:scale-105 hover:shadow-lg text-left group ${
                theme === 'dark'
                  ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/70'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl border ${getColorClasses(action.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {action.title}
                  </h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {action.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className={`p-6 rounded-2xl border ${
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700/50'
          : 'bg-white border-slate-200'
      }`}>
        <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          <FileText className="w-5 h-5" />
          Recent Activity
        </h2>

        <div className="space-y-3">
          <div className={`p-4 rounded-xl ${
            theme === 'dark' ? 'bg-slate-700/30' : 'bg-slate-50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  Welcome to Choosify!
                </p>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Your voting platform is ready to use
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-lg ${
                theme === 'dark'
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-green-100 text-green-700'
              }`}>
                New
              </span>
            </div>
          </div>

          <div className={`p-4 rounded-xl ${
            theme === 'dark' ? 'bg-slate-700/30' : 'bg-slate-50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  Quick Actions Available
                </p>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Access common tasks with one click
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-lg ${
                theme === 'dark'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                Tip
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contest Modal */}
      <ContestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        setContests={setContests}
      />
    </div>
  );
};

export default QuickActions;
