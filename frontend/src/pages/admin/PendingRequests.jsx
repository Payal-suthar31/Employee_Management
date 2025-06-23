import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PendingRequests = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formValues, setFormValues] = useState({}); // for dept & position per user
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndFetchUsers();
  }, [navigate]);

  const showNotification = (message, type = 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const checkAdminAndFetchUsers = async () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      showNotification('Please login to continue');
      navigate('/login');
      return;
    }

    if (!userRole || userRole.toLowerCase() !== 'admin') {
      showNotification('Access denied. Admin privileges required.');
      navigate('/login');
      return;
    }

    fetchPendingUsers();
  };

  const fetchPendingUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5181/api/Account/pending-requests', {
        headers: {
          'Authorization': token,
          'Accept': 'application/json'
        }
      });
      setPendingUsers(response.data);

      // Set initial empty department/position for each user
      const initial = {};
      response.data.forEach(user => {
        initial[user.id] = { department: '', position: '' };
      });
      setFormValues(initial);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching pending users:', err);
      if (err.response?.status === 401) {
        showNotification('Session expired or unauthorized. Please login again as admin.');
        navigate('/login');
      } else {
        setError('Failed to load pending user requests');
      }
      setLoading(false);
    }
  };

  const handleChange = (userId, field, value) => {
    setFormValues(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value
      }
    }));
  };

  const handleApprove = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('Please login to continue');
        navigate('/login');
        return;
      }

      const { department, position } = formValues[userId] || {};
      if (!department || !position) {
        showNotification('Please select both department and position');
        return;
      }

      const response = await axios.post(
        `http://localhost:5181/api/Account/approve-user/${userId}`,
        {
          department: department,
          position: position
        },
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );

      showNotification(response.data || 'User approved successfully', 'success');
      fetchPendingUsers();
    } catch (err) {
      console.error('Error approving user:', err);
      if (err.response?.status === 401) {
        showNotification('Session expired or unauthorized. Please login again as admin.');
        navigate('/login');
      } else {
        const errorMessage = err.response?.data || 'Failed to approve user';
        showNotification(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      }
    }
  };

  const handleReject = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5181/api/Account/reject-user/${userId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      showNotification('User rejected successfully', 'success');
      fetchPendingUsers();
    } catch (err) {
      console.error('Error rejecting user:', err);
      showNotification(err.response?.data?.message || 'Failed to reject user');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bfa181]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <p className="font-medium">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fafd] via-[#f8f6f2] to-[#e6e6e6] p-8">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 rounded-lg shadow-lg p-4 ${
          notification.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            )}
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#232946] mb-8">Pending Registration Requests</h1>

        {pendingUsers.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center">
            <p className="text-[#232946]/70">No pending registration requests</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4">{user.fullName}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <select
                        className="border rounded p-1"
                        value={formValues[user.id]?.department || ''}
                        onChange={(e) => handleChange(user.id, 'department', e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="HR">HR</option>
                        <option value="IT">IT</option>
                        <option value="Sales">Sales</option>
                        <option value="Marketing">Marketing</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        className="border rounded p-1"
                        value={formValues[user.id]?.position || ''}
                        onChange={(e) => handleChange(user.id, 'position', e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="Manager">Manager</option>
                        <option value="Developer">Developer</option>
                        <option value="Intern">Intern</option>
                        <option value="Executive">Executive</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleApprove(user.id)}
                        className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-full mr-2"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-full"
                      >
                        ✕ Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingRequests;
