import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

const ContestModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    coverPhoto: null,
    description: '',
    startDate: '',
    endDate: '',
    contestants: [] // Added contestants array
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        coverPhoto: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.startDate || !formData.endDate) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.coverPhoto) {
        throw new Error('Please select a cover photo');
      }

      // Pass the formData directly to the parent's onSubmit
      await onSubmit(formData);
      
      // Reset form
      setFormData({
        name: '',
        coverPhoto: null,
        description: '',
        startDate: '',
        endDate: '',
        contestants: []
      });
      
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create contest. Please try again.');
      console.error('Error submitting contest:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${
        !isOpen ? 'hidden' : ''
      }`}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Create Contest</h1>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Contest Name
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
              required
            />
          </div>

          {/* Contest Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Contest Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
              rows="4"
              placeholder="Enter a short description for the contest"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Cover Photo</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                id="coverPhoto"
                className="hidden"
                accept="image/*"
                onChange={handleCoverPhotoChange}
              />
              <label htmlFor="coverPhoto" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm text-gray-600">
                  Click to upload cover photo
                </span>
              </label>
              {formData.coverPhoto && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected: {formData.coverPhoto.name}
                </p>
              )}
            </div>
          </div>

          {/* Start and End Date */}
          <div className="space-y-2">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="startDate" className="block text-sm font-medium">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  required
                />
              </div>
              <div className="flex-1">
                <label htmlFor="endDate" className="block text-sm font-medium">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 py-2 px-4 rounded-lg border"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Contest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContestModal;
