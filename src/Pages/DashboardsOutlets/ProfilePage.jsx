import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Award, Edit3, Save, X, Camera, Loader2, Sun, Moon, Languages } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '../Contexts/AuthContext';
import { useTheme } from '../Contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import API_URL from '../Constants/Constants';

const ProfilePage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { i18n } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token missing");
    }
    return { Authorization: `Bearer ${token}` };
  };

  const fetchProfileData = async () => {
    try {
      if (!isAuthenticated || !currentUser) {
        console.log("User not authenticated, skipping profile fetch");
        return;
      }

      setLoading(true);

      // Use currentUser data from auth context
      const userData = {
        name: currentUser.username || 'User',
        email: currentUser.email || '',
        bio: currentUser.bio || 'No bio available',
        location: currentUser.location || 'Location not set',
        website: currentUser.website || '',
        joinDate: currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Unknown',
        avatar: currentUser.profileImage || null
      };

      setProfileData(userData);
      setEditData({ ...userData });
    } catch (error) {
      console.error("Fetch profile error:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const headers = getAuthHeaders();
      const updateData = {
        username: editData.name,
        bio: editData.bio,
        location: editData.location,
        website: editData.website
      };

      // Note: Email updates might require additional verification
      // For now, we'll update other fields
      const response = await axios.put(`${API_URL}/users/profile`, updateData, { headers });

      if (response.data?.success) {
        setProfileData({ ...editData });
        setIsEditing(false);
        toast.success('Profile updated successfully!');

        // Refresh current user data in auth context
        // You might need to implement a refresh function in AuthContext
        // For now, we'll update the local state
        setProfileData(prev => ({
          ...prev,
          name: editData.name,
          bio: editData.bio,
          location: editData.location,
          website: editData.website
        }));
      } else {
        throw new Error(response.data?.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error("Save profile error:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    fetchProfileData();
    fetchStats();
  }, [isAuthenticated, currentUser]);

  const [stats, setStats] = useState([
    { label: 'Total Contests', value: 'Loading...', icon: Award },
    { label: 'Active Contests', value: 'Loading...', icon: Calendar },
    { label: 'Total Votes', value: 'Loading...', icon: User }
  ]);

  const [activities, setActivities] = useState([]);

  const fetchStats = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_URL}/contests/all`, { headers });

      if (response.data?.success) {
        const contests = response.data.data;
        const now = new Date();

        const totalContests = contests.length;
        const activeContests = contests.filter(contest => new Date(contest.endDate) > now).length;
        const totalVotes = contests.reduce((total, contest) =>
          total + (contest.contestants?.reduce((sum, contestant) => sum + (contestant.votes || 0), 0) || 0), 0
        );

        setStats([
          { label: 'Total Contests', value: totalContests.toString(), icon: Award },
          { label: 'Active Contests', value: activeContests.toString(), icon: Calendar },
          { label: 'Total Votes', value: totalVotes.toString(), icon: User }
        ]);

        // Generate recent activities from contests data
        const recentActivities = [];
        contests.forEach(contest => {
          // Add contest creation activity
          if (contest.createdAt) {
            recentActivities.push({
              action: 'Created contest',
              item: contest.name,
              time: new Date(contest.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }),
              timestamp: new Date(contest.createdAt)
            });
          }

          // Add contest publication activity
          if (contest.isPublished && contest.updatedAt) {
            recentActivities.push({
              action: 'Published contest',
              item: contest.name,
              time: new Date(contest.updatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }),
              timestamp: new Date(contest.updatedAt)
            });
          }

          // Add contest ended activity
          if (contest.hasEnded || new Date(contest.endDate) < now) {
            recentActivities.push({
              action: 'Contest ended',
              item: contest.name,
              time: new Date(contest.endDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }),
              timestamp: new Date(contest.endDate)
            });
          }
        });

        // Sort activities by timestamp (most recent first) and take top 10
        recentActivities.sort((a, b) => b.timestamp - a.timestamp);
        setActivities(recentActivities.slice(0, 10));
      }
    } catch (error) {
      console.error("Fetch stats error:", error);
      setStats([
        { label: 'Total Contests', value: 'Error', icon: Award },
        { label: 'Active Contests', value: 'Error', icon: Calendar },
        { label: 'Total Votes', value: 'Error', icon: User }
      ]);
      setActivities([]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-custom-blue" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-slate-600 text-lg mb-4">Unable to load profile data</p>
          <button
            onClick={fetchProfileData}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section - Now matches card design */}
      <div className={`rounded-2xl shadow-lg border p-6 ${
        theme === 'dark'
          ? 'bg-white/5 border-white/10'
          : 'bg-white border-slate-200/60'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'
            }`}>
              Profile Settings
            </h1>
            <p className={`mt-2 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Manage your personal information and account details
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className={`rounded-2xl shadow-lg border p-6 transition hover:-translate-y-1 hover:shadow-xl ${
            theme === 'dark'
              ? 'bg-white/5 border-white/10 hover:border-sky-400/50'
              : 'bg-white border-slate-200/60 hover:border-blue-300'
          }`}>
            <div className="text-center">
              <div className="relative inline-block">
              <div className={`w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 ${
                theme === 'dark' ? 'from-sky-500 to-purple-600' : 'from-blue-500 to-purple-600'
              }`}>
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    <Camera className="h-4 w-4 text-slate-600" />
                  </button>
                )}
              </div>
              <h2 className="text-2xl font-bold text-slate-800">{profileData.name}</h2>
              <p className="text-slate-600 mt-1">{profileData.email}</p>
              <p className="text-slate-500 text-sm mt-2">Member since {profileData.joinDate}</p>
            </div>

            {/* Stats */}
            <div className="mt-6 space-y-4">
              {stats.map((stat, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-700/50 hover:bg-slate-600/50'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <stat.icon className={`h-5 w-5 ${
                      theme === 'dark' ? 'text-sky-400' : 'text-blue-600'
                    }`} />
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>{stat.label}</span>
                  </div>
                  <span className={`font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-slate-800'
                  }`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className={`rounded-2xl shadow-lg border p-6 transition hover:-translate-y-1 hover:shadow-xl ${
            theme === 'dark'
              ? 'bg-white/5 border-white/10 hover:border-sky-400/50'
              : 'bg-white border-slate-200/60 hover:border-blue-300'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-slate-800'
              }`}>Personal Information</h3>
              {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                disabled={saving}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      theme === 'dark'
                        ? 'border-slate-600 bg-slate-700/50 text-white focus:ring-sky-500'
                        : 'border-slate-300 bg-white text-slate-800'
                    }`}
                  />
                ) : (
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-slate-700/50'
                      : 'bg-slate-50'
                  }`}>
                    <User className={`h-5 w-5 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`} />
                    <span className={`${
                      theme === 'dark' ? 'text-white' : 'text-slate-800'
                    }`}>{profileData.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      theme === 'dark'
                        ? 'border-slate-600 bg-slate-700/50 text-white focus:ring-sky-500'
                        : 'border-slate-300 bg-white text-slate-800'
                    }`}
                  />
                ) : (
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-slate-700/50'
                      : 'bg-slate-50'
                  }`}>
                    <Mail className={`h-5 w-5 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`} />
                    <span className={`${
                      theme === 'dark' ? 'text-white' : 'text-slate-800'
                    }`}>{profileData.email}</span>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={editData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                      theme === 'dark'
                        ? 'border-slate-600 bg-slate-700/50 text-white focus:ring-sky-500'
                        : 'border-slate-300 bg-white text-slate-800'
                    }`}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <div className={`p-3 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-slate-700/50'
                      : 'bg-slate-50'
                  }`}>
                    <p className={`${
                      theme === 'dark' ? 'text-white' : 'text-slate-800'
                    }`}>{profileData.bio}</p>
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="City, Country"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">📍</span>
                    <span className="text-slate-800">{profileData.location}</span>
                  </div>
                )}
              </div>

              {/* Website */}
              {/* <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={editData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="https://yourwebsite.com"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">🌐</span>
                    <a
                      href={profileData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {profileData.website}
                    </a>
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className={`rounded-2xl shadow-lg border p-6 transition hover:-translate-y-1 hover:shadow-xl ${
        theme === 'dark'
          ? 'bg-white/5 border-white/10 hover:border-sky-400/50'
          : 'bg-white border-slate-200/60 hover:border-blue-300'
      }`}>
        <h3 className={`text-xl font-semibold mb-6 ${
          theme === 'dark' ? 'text-white' : 'text-slate-800'
        }`}>Appearance Settings</h3>
        <div className="space-y-4">
          <div className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'bg-slate-700/50 hover:bg-slate-600/50'
              : 'bg-slate-50 hover:bg-slate-100'
          }`}>
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Sun className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
              ) : (
                <Moon className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`} />
              )}
              <div>
                <p className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-slate-800'
                }`}>Theme Mode</p>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>Switch between light and dark themes</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                theme === 'dark' ? 'bg-sky-500' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'bg-slate-700/50 hover:bg-slate-600/50'
              : 'bg-slate-50 hover:bg-slate-100'
          }`}>
            <div className="flex items-center gap-3">
              <Languages className={`h-5 w-5 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <div>
                <p className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-slate-800'
                }`}>Language</p>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>Choose your preferred language</p>
              </div>
            </div>
            <select
              value={i18n.language}
              onChange={(e) => {
                const newLang = e.target.value;
                i18n.changeLanguage(newLang);
                toast.success(`Language changed to ${newLang === 'en' ? 'English' : 'Français'}`);
              }}
              className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                theme === 'dark'
                  ? 'border-slate-600 bg-slate-700/50 text-white focus:ring-sky-500'
                  : 'border-slate-300 bg-white text-slate-800'
              }`}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProfilePage;
