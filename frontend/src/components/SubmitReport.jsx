import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';

export default function SubmitReport({ isOpen, onClose, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: ''
  });
  const [document, setDocument] = useState(null);
  const [titleError, setTitleError] = useState('');
  const [typeError, setTypeError] = useState('');
  const [contentError, setContentError] = useState('');
  const [documentError, setDocumentError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setDocumentError('');

    if (!file) {
      setDocument(null);
      return;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setDocumentError('File size must be less than 5MB');
      setDocument(null);
      return;
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    if (!allowedTypes.includes(file.type)) {
      setDocumentError('Only PDF, DOC, DOCX, JPG, and PNG files are allowed');
      setDocument(null);
      return;
    }

    setDocument(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTitleError('');
    setTypeError('');
    setContentError('');
    setDocumentError('');

    let valid = true;
    if (!formData.title) {
      setTitleError('Title is required');
      valid = false;
    }
    if (!formData.type) {
      setTypeError('Type is required');
      valid = false;
    }
    if (!formData.content) {
      setContentError('Content is required');
      valid = false;
    }
    if (!valid) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        return;
      }

      const data = new FormData();
      data.append('Title', formData.title);
      data.append('Content', formData.content);
      data.append('Type', formData.type);
      data.append('Status', 'Pending');
      data.append('CreatedAt', new Date().toISOString());
      
      if (document) {
        data.append('Document', document);
      }

      const response = await axios.post('http://localhost:5181/api/Report', data, {
        headers: {
          'Authorization': token,
          'Content-Type': 'multipart/form-data',
          'Accept': '*/*'
        }
      });

      console.log('Report submitted successfully:', response.data);
      
      // Create a new report object with the submitted data
      const newReport = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        documentPath: response.data.documentPath || null
      };

      // Reset form
      setFormData({
        title: '',
        content: '',
        type: ''
      });
      setDocument(null);
      
      // Call onSubmitSuccess with the new report data
      if (onSubmitSuccess) {
        onSubmitSuccess(newReport);
      }
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      if (error.response?.status === 401) {
        setError('Your session has expired. Please login again.');
      } else if (error.response?.status === 413) {
        setError('The uploaded file is too large. Please choose a smaller file.');
      } else {
        setError(error.response?.data?.message || 'Failed to submit report. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Title
            </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter report title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BFA181] focus:border-transparent"
          />
          {titleError && <p className="text-red-500 text-xs mt-1">{titleError}</p>}
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BFA181] focus:border-transparent"
          >
            <option value="">Select Type</option>
            <option value="Weekly">Weekly Report</option>
            <option value="Monthly">Monthly Report</option>
            <option value="Quarterly">Quarterly Report</option>
            <option value="Leave">Leave Request</option>
            <option value="Expense">Expense Report</option>
            <option value="Issue">Issue Report</option>
            <option value="Other">Other</option>
          </select>
          {typeError && <p className="text-red-500 text-xs mt-1">{typeError}</p>}
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Content
            </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={4}
            placeholder="Enter report details"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BFA181] focus:border-transparent"
          />
          {contentError && <p className="text-red-500 text-xs mt-1">{contentError}</p>}
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Document (optional)
            </label>
            <div className="mt-1 flex items-center">
              <label
                className="px-4 py-2 text-sm text-[#BFA181] hover:text-[#8B7355] border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span>Choose file</span>
          <input
            type="file"
                  onChange={handleFileChange}
                  className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
              </label>
              <span className="ml-3 text-sm text-gray-500">
                {document ? document.name : 'No file chosen'}
              </span>
            </div>
          {documentError && <p className="text-red-500 text-xs mt-1">{documentError}</p>}
            <p className="text-xs text-gray-500 mt-1">
              Max file size: 5MB. Allowed formats: PDF, DOC, DOCX, JPG, PNG
            </p>
        </div>

        {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
              className="px-4 py-2 bg-[#BFA181] text-white rounded-lg hover:bg-[#8B7355] transition-colors"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
} 