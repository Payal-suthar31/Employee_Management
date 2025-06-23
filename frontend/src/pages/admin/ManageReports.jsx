import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const response = await axios.get('http://localhost:5181/api/Report', {
        headers: {
          'Authorization': formattedToken,
          'Accept': 'application/json'
        }
      });
      setReports(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setError('Failed to fetch reports. Please try again.');
      setLoading(false);
    }
  };

  const handleApprove = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      await axios.post(`http://localhost:5181/api/Report/approve/${reportId}`, {}, {
        headers: {
          'Authorization': formattedToken,
          'Content-Type': 'application/json'
        }
      });
      await fetchReports();
    } catch (err) {
      console.error('Failed to approve report:', err);
      setError('Failed to approve report. Please try again.');
    }
  };

  const handleReject = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      await axios.post(`http://localhost:5181/api/Report/reject/${reportId}`, {}, {
        headers: {
          'Authorization': formattedToken,
          'Content-Type': 'application/json'
        }
      });
      await fetchReports();
    } catch (err) {
      console.error('Failed to reject report:', err);
      setError('Failed to reject report. Please try again.');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports.filter(report => 
    report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-600">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Reports</h1>
      
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <div key={report.reportId} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-[#BFA181] flex items-center justify-center text-white font-semibold text-lg mr-3">
                {report.employeeName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{report.employeeName}</h3>
                <p className="text-sm text-gray-600">{report.title}</p>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full ${
                report.status?.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                report.status?.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {report.status || 'Pending'}
              </span>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">{report.type}</p>
            
            {report.documentPath && (
              <button
                onClick={() => window.open(`http://localhost:5181/api/Report/${report.reportId}/document`, '_blank')}
                className="w-full mb-3 px-4 py-2 bg-[#BFA181] text-white rounded-lg flex items-center justify-center hover:bg-[#8B7355] transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Document
              </button>
            )}

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleApprove(report.reportId)}
                className="flex-1 px-3 py-2 bg-[#4CAF50] text-white rounded hover:bg-[#43A047] transition-colors text-sm font-medium"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(report.reportId)}
                className="flex-1 px-3 py-2 bg-[#F44336] text-white rounded hover:bg-[#E53935] transition-colors text-sm font-medium"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageReports;

 