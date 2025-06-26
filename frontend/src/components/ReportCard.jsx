import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ReportCard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5181/api/Report', {
        headers: {
          'Authorization': token,
          'Accept': 'application/json'
        }
      });
      setReports(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      if (error.response) {
        setError(`Failed to load reports: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        setError('Failed to receive response from server');
      } else {
        setError(`Error: ${error.message}`);
      }
      setLoading(false);
    }
  };

  const handleReportAction = async (reportId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5181/api/Report/${reportId}/status`, {
        status: action === 'approve' ? 'Approved' : 'Rejected'
      }, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      fetchReports();
    } catch (error) {
      if (error.response) {
        setError(`Failed to update report: ${error.response.data.message || error.response.statusText}`);
      } else {
        setError(`Error: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#BFA181]"></div>
        <p className="ml-2 text-[#232946]">Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="font-medium text-red-600">Error</p>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 rounded-xl shadow-lg border border-[#bfa181]/10 p-6">
      <h3 className="text-xl font-bold text-[#232946] mb-6">Reports Management</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#bfa181]/10">
          <thead className="bg-[#f8f6f2]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#232946] uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#232946] uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#232946] uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#232946] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#232946] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#bfa181]/10">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-[#f8f6f2] transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-[#232946]">{report.employeeName}</div>
                  <div className="text-sm text-[#bfa181]">{report.employeeEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#232946]">{report.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#232946]">
                  {new Date(report.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                    report.status === 'Pending' ? 'bg-[#fff7ed] text-[#c2410c]' : 
                    report.status === 'Approved' ? 'bg-[#eafaf1] text-[#2ecc71]' : 
                    'bg-red-100 text-red-800'}`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {report.status === 'Pending' && (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleReportAction(report.id, 'approve')}
                        className="px-4 py-1 rounded-lg text-sm font-semibold bg-[#BFA181] text-white hover:bg-[#A69073] transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReportAction(report.id, 'reject')}
                        className="px-4 py-1 rounded-lg text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 