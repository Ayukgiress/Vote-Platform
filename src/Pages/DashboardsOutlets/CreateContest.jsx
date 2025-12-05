import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { useTheme } from '../../Pages/Contexts/ThemeContext';
import ContestModal from '../../Components/Modals/ContestModal';

const CreateContest = () => {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contests, setContests] = useState([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Create Contest
          </h1>
          <p className={`mt-2 ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Start a new voting contest and engage your audience
          </p>
        </div>
        <button
          onClick={openModal}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
          }`}
        >
          <Plus className="w-5 h-5" />
          New Contest
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl border transition-all duration-200 hover:scale-105 ${
          theme === 'dark'
            ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/70'
            : 'bg-white border-slate-200 hover:border-slate-300'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${
              theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-50'
            }`}>
              <Plus className={`w-6 h-6 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                {contests.length}
              </p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Active Contests
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border transition-all duration-200 hover:scale-105 ${
          theme === 'dark'
            ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/70'
            : 'bg-white border-slate-200 hover:border-slate-300'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${
              theme === 'dark' ? 'bg-green-500/20' : 'bg-green-50'
            }`}>
              <Sparkles className={`w-6 h-6 ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                0
              </p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Total Votes
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border transition-all duration-200 hover:scale-105 ${
          theme === 'dark'
            ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/70'
            : 'bg-white border-slate-200 hover:border-slate-300'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${
              theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-50'
            }`}>
              <Sparkles className={`w-6 h-6 ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                0
              </p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Participants
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Contests */}
      <div className={`p-6 rounded-2xl border ${
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700/50'
          : 'bg-white border-slate-200'
      }`}>
        <h2 className={`text-xl font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          Recent Contests
        </h2>

        {contests.length === 0 ? (
          <div className="text-center py-12">
            <Plus className={`w-16 h-16 mx-auto mb-4 ${
              theme === 'dark' ? 'text-slate-600' : 'text-slate-400'
            }`} />
            <h3 className={`text-lg font-medium mb-2 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              No contests created yet
            </h3>
            <p className={`mb-6 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Create your first contest to get started with voting
            </p>
            <button
              onClick={openModal}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              }`}
            >
              Create Your First Contest
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Contest list would go here */}
          </div>
        )}
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

export default CreateContest;
