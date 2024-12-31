import React, { useState } from 'react';  

const AddContestantModal = ({ isOpen, onClose, contestId, onAddContestant }) => {  
  const [formData, setFormData] = useState({  
    name: '',  
    photo: null,  
  });  

  const handleSubmit = async (e) => {  
    e.preventDefault();  
    const data = new FormData();  
    data.append('name', formData.name);  
    if (formData.photo) {  
      data.append('photo', formData.photo);  
    }  

    try {  
      const response = await fetch(`http://localhost:5000/contests/${contestId}/contestants`, {  
        method: 'POST',  
        body: data,  
      });  

      if (response.ok) {  
        const result = await response.json();  
        onAddContestant(result.data); // Callback to add the contestant to the list  
        onClose(); // Close the modal  
      }  
    } catch (error) {  
      console.error('Error adding contestant:', error);  
    }  
  };  

  if (!isOpen) return null;  

  return (  
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">  
      <div className="bg-white shadow-lg rounded-lg w-96 p-6">  
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Add New Contestant</h2>  
        <form onSubmit={handleSubmit} className="space-y-4">  
          <div>  
            <label className="block text-sm font-medium text-gray-700">Name</label>  
            <input  
              type="text"  
              value={formData.name}  
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}  
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:ring-2 focus:ring-blue-500"  
              required  
            />  
          </div>  
          <div>  
            <label className="block text-sm font-medium text-gray-700">Photo</label>  
            <input  
              type="file"  
              onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}  
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"  
              accept="image/*"  
            />  
          </div>  
          <div className="flex justify-center mt-4 space-x-4">  
            <button  
              type="button"  
              onClick={onClose}  
              className="px-4 py-2 border rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition ease-in-out duration-200"  
            >  
              Cancel  
            </button>  
            <button  
              type="submit"  
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ease-in-out duration-200"  
            >  
              Add  
            </button>  
          </div>  
        </form>  
      </div>  
    </div>  
  );  
};  

export default AddContestantModal;