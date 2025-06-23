import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyReports from '../components/MyReports';
import axios from 'axios';
import SubmitReport from '../components/SubmitReport';

const EmployeeDashboard = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportStats, setReportStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const navigate = useNavigate();
  const myReportsRef = React.useRef();

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  useEffect(() => {
    if (employeeData?.id) {
      fetchReportStats();
      // Refresh stats every 30 seconds
      const interval = setInterval(fetchReportStats, 30000);
      return () => clearInterval(interval);
    }
  }, [employeeData]);

  const fetchEmployeeData = async () => {
    try {
      const token = localStorage.getItem('token');
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const response = await axios.get('http://localhost:5181/api/Employees/me', {
        headers: {
          'Authorization': formattedToken,
          'Accept': 'application/json'
        }
      });
      setEmployeeData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employee data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
      }
      setLoading(false);
    }
  };

  const fetchReportStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      // First ensure we have employeeData
      if (!employeeData?.id) {
        return;
      }

      const response = await axios.get(`http://localhost:5181/api/Report/employee-stats/${employeeData.id}`, {
        headers: {
          'Authorization': formattedToken,
          'Accept': 'application/json'
        }
      });
      setReportStats({
        total: response.data.total,
        pending: response.data.pending,
        approved: response.data.approved,
        rejected: response.data.rejected
      });
    } catch (error) {
      console.error('Error fetching report stats:', error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('employeeId');
    navigate('/login');
  };

  const handleReportSubmitted = (newReport) => {
    if (myReportsRef.current?.addNewReport) {
      myReportsRef.current.addNewReport(newReport);
    }
    setShowReportModal(false);
    fetchReportStats();
  };

  const ProfileModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#BFA181] p-6 text-white relative">
          <button
            onClick={() => setShowProfileModal(false)}
            className="absolute right-4 top-4 text-white/80 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{employeeData?.fullName}</h2>
              <p className="text-white/80">{employeeData?.position}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#BFA181]">Email</label>
                <p className="text-gray-800 font-medium">{employeeData?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#BFA181]">Department</label>
                <p className="text-gray-800 font-medium">{employeeData?.department}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#BFA181]">Employee ID</label>
                <p className="text-gray-800 font-medium">{employeeData?.id}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#BFA181]">Date Joined</label>
                <p className="text-gray-800 font-medium">
                  {new Date(employeeData?.dateOfJoining).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#BFA181]">Status</label>
                <p className="inline-flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-gray-800 font-medium">Active</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={() => setShowProfileModal(false)}
              className="px-6 py-2 text-[#8B7355] hover:text-[#BFA181] font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex justify-between items-center px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Employee Management System</p>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
            <button
              onClick={handleSignOut}
              className="px-6 py-2.5 bg-[#BFA181] text-white rounded-lg hover:bg-[#8B7355] transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, {employeeData?.fullName || 'Employee'}!</h2>
          <p className="text-gray-600">Monitor and manage your reports and activities</p>
        </div>

        {/* Stats Section with White Theme */}
        <div className="bg-white rounded-xl p-8 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#BFA181]/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#BFA181]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-800">{reportStats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-800">{reportStats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-800">{reportStats.approved}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-800">{reportStats.rejected}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Submit Report Card */}
          <div 
            onClick={() => setShowReportModal(true)}
            className="bg-[#BFA181] rounded-xl p-6 text-white cursor-pointer hover:bg-[#8B7355] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Submit Report</h3>
                <p className="text-white/80">Create and submit a new report</p>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div 
            onClick={() => setShowProfileModal(true)}
            className="bg-[#BFA181] rounded-xl p-6 text-white cursor-pointer hover:bg-[#8B7355] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold">View Profile</h3>
                <p className="text-white/80">View your profile details</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <MyReports 
          ref={myReportsRef}
          onReportStatusChange={fetchReportStats}
        />

        {/* Submit Report Modal */}
        {showReportModal && (
          <SubmitReport
            isOpen={showReportModal}
            onClose={() => setShowReportModal(false)}
            onSubmitSuccess={handleReportSubmitted}
          />
        )}

        {/* Profile Modal */}
        {showProfileModal && <ProfileModal />}
      </div>
    </div>
  );
};

export default EmployeeDashboard;