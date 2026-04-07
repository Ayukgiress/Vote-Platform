import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, X, Upload, User, Loader2 } from 'lucide-react';
import { useTheme } from '../../Pages/Contexts/ThemeContext';
import API_URL from '../../Pages/Constants/Constants';

const AddContestantModal = ({ isOpen, onClose, contestId, setContests, contestStatus }) => {
  const { theme } = useTheme();
  const [contestants, setContestants] = useState([]);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  const isPublished = contestStatus === 'Published';

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
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
        setPhoto(compressedFile);
        setPreviewUrl(URL.createObjectURL(compressedFile));
        setError('');
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

  const handleAddContestant = () => {
    if (!name.trim() || !photo) {
      setError('Name and photo are required');
      return;
    }

    if (isPublished) {
      setError('Cannot add contestants. The contest is already published.');
      return;
    }

    const newContestant = { name: name.trim(), photo, previewUrl, id: Date.now() };
    setContestants((prev) => [...prev, newContestant]);
    setName('');
    setPhoto(null);
    setPreviewUrl('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveContestant = (id) => {
    setContestants((prev) => prev.filter((contestant) => contestant.id !== id));
  };

  const resetForm = () => {
    setContestants([]);
    setName('');
    setPhoto(null);
    setPreviewUrl('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isPublished) {
      setError('Cannot add contestants. The contest is already published.');
      return;
    }

    if (contestants.length === 0) {
      setError('Add at least one contestant before submitting');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    const token = localStorage.getItem('token');

    contestants.forEach((contestant, index) => {
      formData.append(`contestants[${index}]`, contestant.name);
    });

    contestants.forEach((contestant) => {
      if (contestant.photo) {
        formData.append('contestants', contestant.photo);
      }
    });

    formData.append('contestantCount', String(contestants.length));

    try {
      const response = await axios.post(
        `${API_URL}/contests/${contestId}/contestants`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success(`${contestants.length} contestant${contestants.length > 1 ? 's' : ''} added successfully!`);
        resetForm();
        onClose();

        try {
          const contestResponse = await axios.get(`${API_URL}/contests/${contestId}`);
          if (contestResponse.data?.success && setContests) {
            setContests((prev) =>
              prev.map((contest) =>
                contest._id === contestId ? contestResponse.data.contest : contest
              )
            );
          }
        } catch (fetchError) {
          console.error('Error refreshing contest data:', fetchError);
        }
      }
    } catch (error) {
      console.error('Error adding contestants:', error);
      toast.error('Failed to add contestants');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center p-4 ${
        !isOpen ? 'hidden' : ''
      }`}
      style={{
        backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-3xl rounded-2xl shadow-2xl border transition-all duration-300 max-h-[90vh] overflow-y-auto ${
          theme === 'dark'
            ? 'bg-white/10 border-white/20 backdrop-blur-xl'
            : 'bg-white border-slate-200/60'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
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
              Add Contestants
            </h1>
            <p className={`mt-1 text-sm ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Add participants to your contest
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
          {isPublished && (
            <div className={`mb-6 p-4 rounded-xl border ${
              theme === 'dark'
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              <p className="font-medium">Contest Already Published</p>
              <p className="text-sm mt-1">Contestants cannot be added to published contests.</p>
            </div>
          )}

          {!isPublished && (
            <div className="space-y-6">
              {/* Add Contestant Form */}
              <div className={`rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-xl ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 hover:border-sky-400/50'
                  : 'bg-slate-50 border-slate-200/60 hover:border-blue-300'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-800'
                }`}>
                  <Plus className={`h-5 w-5 ${
                    theme === 'dark' ? 'text-sky-400' : 'text-blue-600'
                  }`} />
                  Add New Contestant
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Contestant Name *
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 ${
                        theme === 'dark'
                          ? 'border-slate-600 bg-slate-700/50 text-white focus:ring-sky-500 focus:border-sky-500'
                          : 'border-slate-300 bg-white text-slate-800 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter contestant name"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Photo *
                    </label>
                    <div className="relative">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSubmitting}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 flex items-center justify-center gap-2 ${
                          theme === 'dark'
                            ? 'border-slate-600 bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white'
                            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Upload className="h-4 w-4" />
                        {photo ? photo.name : 'Choose Photo'}
                      </button>
                    </div>
                  </div>
                </div>

                {previewUrl && (
                  <div className="mb-4">
                    <p className={`text-sm font-semibold mb-2 ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>Preview:</p>
                    <div className="inline-block">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-xl border-2 border-slate-200"
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className={`mb-4 p-4 rounded-xl border ${
                    theme === 'dark'
                      ? 'bg-red-500/10 border-red-500/20 text-red-400'
                      : 'bg-red-50 border-red-200 text-red-600'
                  }`}>
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAddContestant}
                  disabled={isSubmitting || !name.trim() || !photo}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${
                    isSubmitting || !name.trim() || !photo
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : theme === 'dark'
                        ? 'bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  Add to List
                </button>
              </div>

              {/* Contestants List */}
              {contestants.length > 0 && (
                <div className={`rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-xl ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 hover:border-sky-400/50'
                    : 'bg-white border-slate-200/60 hover:border-blue-300'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-800'
                  }`}>
                    <User className={`h-5 w-5 ${
                      theme === 'dark' ? 'text-sky-400' : 'text-blue-600'
                    }`} />
                    Contestants to Add ({contestants.length})
                  </h3>

                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {contestants.map((contestant) => (
                      <div key={contestant.id} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                        theme === 'dark'
                          ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-600/50'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}>
                        <div className="flex items-center gap-4">
                          <img
                            src={contestant.previewUrl}
                            alt={contestant.name}
                            className="w-12 h-12 object-cover rounded-xl border-2 border-slate-200"
                          />
                          <div>
                            <p className={`font-medium ${
                              theme === 'dark' ? 'text-white' : 'text-slate-800'
                            }`}>{contestant.name}</p>
                            <p className={`text-sm ${
                              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                            }`}>{contestant.photo?.name}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveContestant(contestant.id)}
                          disabled={isSubmitting}
                          className={`p-2 rounded-xl transition-colors ${
                            isSubmitting
                              ? 'text-slate-400 cursor-not-allowed'
                              : theme === 'dark'
                                ? 'text-red-400 hover:bg-red-500/20'
                                : 'text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting || contestants.length === 0}
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${
                        isSubmitting || contestants.length === 0
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          : theme === 'dark'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white'
                            : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Adding Contestants...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Submit {contestants.length} Contestant{contestants.length > 1 ? 's' : ''}
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {contestants.length === 0 && (
                <div className={`rounded-2xl border p-8 text-center transition hover:-translate-y-1 hover:shadow-xl ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 hover:border-sky-400/50'
                    : 'bg-blue-50 border-blue-200 hover:border-blue-300'
                }`}>
                  <User className={`h-12 w-12 mx-auto mb-3 ${
                    theme === 'dark' ? 'text-sky-400' : 'text-blue-500'
                  }`} />
                  <p className={`font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-slate-800'
                  }`}>No contestants added yet</p>
                  <p className={`text-sm mt-1 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Fill in the form above and click "Add to List" to get started.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddContestantModal;
