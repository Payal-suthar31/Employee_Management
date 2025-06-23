import React, { useState, useEffect } from 'react';

export default function DepartmentForm({ department, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || '',
        description: department.description || ''
      });
    }
  }, [department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-brown-700 mb-1">Department Name</label>
        <div className="relative rounded-lg shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-brown-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
            className="block w-full pl-10 pr-3 py-2 border border-brown-200 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-brown-500 text-brown-900 placeholder-brown-400 text-sm transition-colors duration-200"
            placeholder="Enter department name"
        />
        </div>
      </div>
{/* 
      <div>
        <label className="block text-sm font-medium text-brown-700 mb-1">Description</label>
        <div className="relative rounded-lg shadow-sm">
          <div className="absolute top-3 left-3 text-brown-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
            rows={4}
            className="block w-full pl-10 pr-3 py-2 border border-brown-200 rounded-lg focus:ring-2 focus:ring-brown-500 focus:border-brown-500 text-brown-900 placeholder-brown-400 text-sm resize-none transition-colors duration-200"
            placeholder="Enter department description"
        />
        </div>
      </div> */}

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-white border border-brown-300 rounded-lg text-sm font-medium text-brown-700 hover:bg-brown-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-brown-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500 transition-all duration-200"
        >
          {department ? 'Update Department' : 'Add Department'}
        </button>
      </div>

      <style jsx>{`
        .text-brown-400 { color: #9c6b5f; }
        .text-brown-600 { color: #7c4f45; }
        .text-brown-700 { color: #63403a; }
        .text-brown-900 { color: #3d2a27; }
        .bg-brown-50 { background-color: #fdf8f6; }
        .bg-brown-600 { background-color: #7c4f45; }
        .bg-brown-700 { background-color: #63403a; }
        .border-brown-200 { border-color: #e7d5d0; }
        .border-brown-300 { border-color: #dbc7c2; }
        .placeholder-brown-400::placeholder { color: #9c6b5f; }
        .focus\:ring-brown-500:focus { --tw-ring-color: #8b5cf6; }
        .focus\:border-brown-500:focus { border-color: #8b5cf6; }
        .hover\:bg-brown-50:hover { background-color: #fdf8f6; }
        .hover\:bg-brown-700:hover { background-color: #63403a; }
      `}</style>
    </form>
  );
} 