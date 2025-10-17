import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, X, Upload, User } from 'lucide-react';
import API_URL from '../../Pages/Constants/Constants';

const AddContestantModal = ({ isOpen, onClose, contestId, setContests, contestStatus }) => {
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

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setPhoto(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
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
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add Contestants</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {isPublished && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            <p className="font-medium">Contest Already Published</p>
            <p className="text-sm mt-1">Contestants cannot be added to published contests.</p>
          </div>
        )}

        {!isPublished && (
          <div className="space-y-6">
            {/* Add Contestant Form */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Contestant
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contestant Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter contestant name"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-700"
                    >
                      <Upload className="h-4 w-4" />
                      {photo ? photo.name : 'Choose Photo'}
                    </button>
                  </div>
                </div>
              </div>

              {previewUrl && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <div className="inline-block">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddContestant}
                disabled={isSubmitting || !name.trim() || !photo}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  isSubmitting || !name.trim() || !photo
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Plus className="h-4 w-4" />
                Add to List
              </button>
            </div>

            {/* Contestants List */}
            {contestants.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contestants to Add ({contestants.length})
                </h3>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {contestants.map((contestant) => (
                    <div key={contestant.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-4">
                        <img
                          src={contestant.previewUrl}
                          alt={contestant.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-300"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{contestant.name}</p>
                          <p className="text-sm text-gray-500">{contestant.photo?.name}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveContestant(contestant.id)}
                        disabled={isSubmitting}
                        className={`p-2 rounded-lg transition-colors ${
                          isSubmitting
                            ? 'text-gray-400 cursor-not-allowed'
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
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      isSubmitting || contestants.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
              <div className="bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-xl text-center">
                <User className="h-12 w-12 mx-auto mb-3 text-blue-500" />
                <p className="font-medium">No contestants added yet</p>
                <p className="text-sm mt-1">Fill in the form above and click "Add to List" to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddContestantModal;
