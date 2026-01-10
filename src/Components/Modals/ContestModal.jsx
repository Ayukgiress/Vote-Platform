import React, { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../../Pages/Contexts/AuthContext';
import { useTheme } from '../../Pages/Contexts/ThemeContext';
import API_URL from '../../Pages/Constants/Constants';

const ContestModal = ({ isOpen, onClose, setContests }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    coverPhoto: null,
    description: '',
    category: '',
    startDate: '',
    endDate: '',
    contestants: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { currentUser } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCoverPhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }

      try {
        // Compress image if needed
        const compressedFile = await compressImage(file);
        setFormData((prev) => ({
          ...prev,
          coverPhoto: compressedFile,
        }));
        setError(null);
      } catch (error) {
        console.error('Error compressing image:', error);
        setError('Failed to process image. Please try again.');
      }
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1920px width/height)
        let { width, height } = img;
        const maxDimension = 1920;

        if (width > height) {
          if (width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          0.8 // Quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.name || !formData.description || !formData.category || !formData.startDate || !formData.endDate) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.coverPhoto) {
        throw new Error('Please select a cover photo');
      }

      if (!currentUser) {
        throw new Error('User is not logged in. Please login again.');
      }

      const submitData = new FormData();

      submitData.append('userId', currentUser.id);

      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('startDate', formData.startDate);
      submitData.append('endDate', formData.endDate);
      submitData.append('coverPhoto', formData.coverPhoto);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const response = await axios.post(`${API_URL}/contests`, submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data?.success) {
        setContests((prev) => [...prev, response.data.data]);

        setFormData({
          name: '',
          coverPhoto: null,
          description: '',
          category: '',
          startDate: '',
          endDate: '',
          contestants: [],
        });
        onClose();
        toast.success('Contest created successfully!');
      } else {
        throw new Error(response.data?.error || 'Failed to create contest');
      }
    } catch (err) {
      console.error('Error submitting contest:', err);
      setError(err.message || 'Failed to create contest. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center p-4 ${
        !isOpen ? 'hidden' : ''
      }`}
      style={{
        backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl border transition-all duration-300 transform ${
        theme === 'dark'
          ? 'bg-white/10 border-white/20 backdrop-blur-xl'
          : 'bg-white border-slate-200/60'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'border-white/10' : 'border-slate-200/60'
        }`}>
          <div>
            <h1 className={`text-2xl font-bold ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'
            }`}>
              Create New Contest
            </h1>
            <p className={`mt-1 text-sm ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Set up your contest details and get ready to start voting
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              theme === 'dark'
                ? 'hover:bg-white/10 text-slate-400 hover:text-white'
                : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className={`mb-6 p-4 rounded-xl border ${
              theme === 'dark'
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contest Name */}
            <div className="space-y-2">
              <label htmlFor="name" className={`block text-sm font-semibold ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Contest Name *
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 ${
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-700/50 text-white focus:ring-sky-500 focus:border-sky-500'
                    : 'border-slate-300 bg-white text-slate-800 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Enter contest name"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className={`block text-sm font-semibold ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 resize-none ${
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-700/50 text-white focus:ring-sky-500 focus:border-sky-500'
                    : 'border-slate-300 bg-white text-slate-800 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Describe your contest and what participants can expect..."
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className={`block text-sm font-semibold ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 ${
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-700/50 text-white focus:ring-sky-500 focus:border-sky-500'
                    : 'border-slate-300 bg-white text-slate-800 focus:ring-blue-500 focus:border-blue-500'
                }`}
                required
              >
                <option value="">Select a category</option>
                <option value="political">Political</option>
                <option value="sports">Sports</option>
                <option value="entertainment">Entertainment</option>
                <option value="education">Education</option>
                <option value="business">Business</option>
                <option value="technology">Technology</option>
                <option value="arts">Arts & Culture</option>
                <option value="music">Music</option>
                <option value="gaming">Gaming</option>
                <option value="fashion">Fashion</option>
                <option value="food">Food & Beverage</option>
                <option value="travel">Travel</option>
                <option value="health">Health & Fitness</option>
                <option value="environment">Environment</option>
                <option value="charity">Charity & Non-Profit</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Cover Photo */}
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Cover Photo *
              </label>
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                theme === 'dark'
                  ? 'border-slate-600 hover:border-sky-400 bg-slate-700/30 hover:bg-slate-700/50'
                  : 'border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-slate-100'
              }`}>
                <input
                  type="file"
                  id="coverPhoto"
                  className="hidden"
                  accept="image/*"
                  onChange={handleCoverPhotoChange}
                />
                <label htmlFor="coverPhoto" className="cursor-pointer">
                  <Upload className={`mx-auto h-12 w-12 mb-4 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    <span className="font-medium">Click to upload</span> or drag and drop
                  </div>
                  <p className={`text-xs mt-1 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    PNG, JPG, GIF up to 10MB
                  </p>
                </label>
                {formData.coverPhoto && (
                  <div className={`mt-4 p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-sky-500/20' : 'bg-blue-50'
                  }`}>
                    <p className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-sky-300' : 'text-blue-700'
                    }`}>
                      ✓ {formData.coverPhoto.name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="startDate" className={`block text-sm font-semibold ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 ${
                    theme === 'dark'
                      ? 'border-slate-600 bg-slate-700/50 text-white focus:ring-sky-500 focus:border-sky-500'
                      : 'border-slate-300 bg-white text-slate-800 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="endDate" className={`block text-sm font-semibold ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 ${
                    theme === 'dark'
                      ? 'border-slate-600 bg-slate-700/50 text-white focus:ring-sky-500 focus:border-sky-500'
                      : 'border-slate-300 bg-white text-slate-800 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-slate-200/60">
              <button
                type="button"
                onClick={onClose}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  theme === 'dark'
                    ? 'border border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Contest...
                  </>
                ) : (
                  'Create Contest'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContestModal;
