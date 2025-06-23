import React, { useState, useEffect, forwardRef } from 'react';
import axios from 'axios';

const MyReports = forwardRef((props, ref) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5181/api/Report/my', {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      if (Array.isArray(response.data)) {
        // Sort reports by createdAt date, newest first
        const sortedReports = response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setReports(sortedReports);
        // Call onReportStatusChange to update stats
        if (props.onReportStatusChange) {
          props.onReportStatusChange();
        }
      } else {
        console.warn("Unexpected response format:", response.data);
        setReports([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });

      if (err.response?.status === 401) {
        setError('Your session has expired. Please login again.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view these reports.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later or contact support.');
      } else {
        setError('Failed to load reports. Please try again.');
      }
      
      setReports([]);
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchReports();
  }, []);

  // Set up periodic refresh
  useEffect(() => {
    const interval = setInterval(fetchReports, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Function to add a new report to the list
  const addNewReport = (report) => {
    setReports(prevReports => {
      const newReports = [report, ...prevReports];
      return newReports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[300px]">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
        <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-4 border-[#1a237e] border-t-transparent"></div>
      </div>
      <span className="ml-4 text-gray-600 text-lg font-medium">Loading reports...</span>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg shadow-lg" role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="ml-4">
          <p className="text-lg font-semibold text-red-700">Error!</p>
          <p className="mt-1 text-red-600">{error}</p>
        </div>
      </div>
    </div>
  );

  const getStatusStyle = (status) => {
    const baseStyle = 'inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200';
    switch (status) {
      case 'Pending':
        return `${baseStyle} bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border border-yellow-200 shadow-sm shadow-yellow-100`;
      case 'Approved':
        return `${baseStyle} bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200 shadow-sm shadow-green-100`;
      case 'Rejected':
        return `${baseStyle} bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200 shadow-sm shadow-red-100`;
      default:
        return `${baseStyle} bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200 shadow-sm shadow-gray-100`;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Approved':
        return (
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'Rejected':
        return (
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">My Reports</h3>
          <p className="text-gray-500">View and manage your submitted reports</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchReports}
            className="px-4 py-2 text-[#BFA181] hover:text-[#8B7355] transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-100">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 text-xl font-medium mb-2">No Reports Found</p>
          <p className="text-gray-400">Your submitted reports will appear here</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-white">
                  <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Content</th>
                  <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report, index) => (
                  <tr 
                    key={report.reportId || index}
                    className={`group transition-all duration-200 hover:bg-gray-50 cursor-default
                      ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-[#1a237e] transition-colors duration-200">
                          {report.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                        {report.type}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 truncate group-hover:text-gray-900 transition-colors duration-200">
                          {report.content}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={getStatusStyle(report.status)}>
                        {getStatusIcon(report.status)}
                        {report.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                        {new Date(report.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
});

export default MyReports; 