import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { employeeApi, reportApi } from '../services/api';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'fullName', direction: 'asc' });
  const [filterText, setFilterText] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const employeesPerSlide = 5;
  const [dashboardCounts, setDashboardCounts] = useState({
    activeEmployees: 0,
    departmentCount: 0,
    reportCount: 0
  });

  useEffect(() => {
    fetchEmployees();
    fetchDashboardCounts();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeApi.getAllEmployees();
      setEmployees(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees');
      setLoading(false);
    }
  };

  const fetchDashboardCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5181/api/Department/dashboard-count', {
        headers: {
          'Authorization': token,
          'Accept': '*/*'
        }
      });
      setDashboardCounts(response.data);
    } catch (err) {
      console.error('Error fetching dashboard counts:', err);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = React.useMemo(() => {
    let sortableEmployees = [...employees];
    if (filterText) {
      sortableEmployees = sortableEmployees.filter(employee => 
        employee.fullName.toLowerCase().includes(filterText.toLowerCase()) ||
        employee.email.toLowerCase().includes(filterText.toLowerCase()) ||
        employee.department.toLowerCase().includes(filterText.toLowerCase()) ||
        employee.position.toLowerCase().includes(filterText.toLowerCase())
      );
    }
    if (sortConfig.key) {
      sortableEmployees.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableEmployees;
  }, [employees, sortConfig, filterText]);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <span className="text-gray-400 ml-2">↕</span>;
    }
    return (
      <span className="ml-2">
        {sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Add this function to get current slide's employees
  const getCurrentSlideEmployees = () => {
    const start = currentSlide * employeesPerSlide;
    return sortedEmployees.slice(start, start + employeesPerSlide);
  };

  // Add this function to calculate total slides
  const totalSlides = Math.ceil(sortedEmployees.length / employeesPerSlide);

  // Add navigation functions
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
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
    <div className="min-h-screen bg-gradient-to-br from-[#f7fafd] via-[#f8f6f2] to-[#e6e6e6] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#bfa181]/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8B7355]/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      
      {/* Fixed Glassy Navbar/Header */}
      <nav
        className="fixed top-0 left-0 w-full z-40 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 bg-white/60 bg-gradient-to-br from-[#f8f6f2]/60 via-[#e6e6e6]/40 to-[#fff]/30 shadow-md border-b border-[#bfa181]/30 backdrop-blur-md transition-all duration-300 gap-3"
        style={{
          boxShadow: '0 4px 16px 0 rgba(191,161,129,0.08), 0 1.5px 6px 0 rgba(192,192,192,0.05)',
          borderTop: 'none',
        }}
      >
        {/* Logo and Title */}
        <div className="flex items-center gap-3 z-10 w-full sm:w-auto">
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#232946]">Admin Dashboard</h1>
            <p className="text-xs sm:text-sm text-[#bfa181] font-medium">Employee Management System</p>
          </div>
        </div>

        {/* Date and Sign Out */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 z-10 w-full sm:w-auto">
          <div className="flex items-center space-x-2 text-sm sm:text-base text-[#232946]/70 whitespace-nowrap">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="sm:hidden">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="inline-flex items-center px-4 sm:px-6 py-2 bg-gradient-to-r from-[#bfa181] to-[#8B7355] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </nav>
      {/* Navbar Animations & Glassmorphism */}
      <style>{`
        .logo-glass {
          background: rgba(255,255,255,0.35);
          backdrop-filter: blur(8px) saturate(180%);
          -webkit-backdrop-filter: blur(8px) saturate(180%);
        }
        .font-montserrat {
          font-family: 'Montserrat', Arial, sans-serif;
        }
      `}</style>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 relative z-10 pt-32 sm:pt-28 min-h-screen w-full">
        {/* Page Header */}
        <div className="mb-8 w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#232946] mb-2">Welcome back, Admin!</h2>
          <p className="text-[#232946]/70">Monitor and manage your organization's key metrics and operations</p>
        </div>

        {/* System Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* System Overview Card */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 w-full">
            <div>
              <h2 className="text-xl font-bold text-[#232946]">System Overview</h2>
              <p className="text-sm text-[#232946]/70 mb-4">Real-time statistics and system health</p>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-[#f7fafd] rounded-lg">
                  <p className="text-2xl sm:text-3xl font-bold text-[#CD853F]">{dashboardCounts.activeEmployees}</p>
                  <p className="text-xs sm:text-sm text-[#232946]/70 mt-1">Active Employees</p>
                </div>
                <div className="text-center p-4 bg-[#f7fafd] rounded-lg">
                  <p className="text-2xl sm:text-3xl font-bold text-[#CD853F]">{dashboardCounts.departmentCount}</p>
                  <p className="text-xs sm:text-sm text-[#232946]/70 mt-1">Departments</p>
                </div>
                <div className="text-center p-4 bg-[#f7fafd] rounded-lg">
                  <p className="text-2xl sm:text-3xl font-bold text-[#CD853F]">{dashboardCounts.reportCount}</p>
                  <p className="text-xs sm:text-sm text-[#232946]/70 mt-1">Reports</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Requests Card */}
          <Link to="/admin/pending-requests" className="group relative w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-[#bfa181]/20 to-[#8B7355]/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative h-full bg-white/90 backdrop-blur-xl rounded-lg p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col justify-center items-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#bfa181]/5 to-[#8B7355]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#bfa181] to-[#8B7355] rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#232946] mb-1">Pending Requests</h3>
                <p className="text-sm text-[#232946]/70">Review new registrations</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Main Management Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Employee Management Card */}
          <Link to="/admin/employees" className="group relative w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-[#bfa181]/20 to-[#8B7355]/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white/90 backdrop-blur-xl rounded-lg p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer overflow-hidden min-h-[200px] flex flex-col justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#bfa181]/5 to-[#8B7355]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#bfa181] to-[#8B7355] rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#232946] mb-3">Employee Management</h3>
                <p className="text-sm text-[#232946]/70">Manage employee records, roles, and permissions</p>
              </div>
            </div>
          </Link>

          {/* Department Management Card */}
          <Link to="/admin/departments" className="group relative w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-[#bfa181]/20 to-[#8B7355]/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white/90 backdrop-blur-xl rounded-lg p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer overflow-hidden min-h-[200px] flex flex-col justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#bfa181]/5 to-[#8B7355]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#bfa181] to-[#8B7355] rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#232946] mb-3">Department Management</h3>
                <p className="text-sm text-[#232946]/70">Organize and manage departmental structure</p>
              </div>
            </div>
          </Link>

          {/* Report Management Card */}
          <Link to="/admin/reports" className="group relative w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-[#bfa181]/20 to-[#8B7355]/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white/90 backdrop-blur-xl rounded-lg p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer overflow-hidden min-h-[200px] flex flex-col justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#bfa181]/5 to-[#8B7355]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#bfa181] to-[#8B7355] rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#232946] mb-3">Report Management</h3>
                <p className="text-sm text-[#232946]/70">View and manage employee reports</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Employee Table Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 mt-12">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#232946]">Employee Overview</h3>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search employees..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bfa181] text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort('fullName')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#bfa181]"
                  >
                    Name <SortIcon columnKey="fullName" />
                  </th>
                  <th
                    onClick={() => handleSort('email')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#bfa181]"
                  >
                    Email <SortIcon columnKey="email" />
                  </th>
                  <th
                    onClick={() => handleSort('department')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#bfa181]"
                  >
                    Department <SortIcon columnKey="department" />
                  </th>
                  <th
                    onClick={() => handleSort('position')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#bfa181]"
                  >
                    Position <SortIcon columnKey="position" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getCurrentSlideEmployees().map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-[#bfa181] flex items-center justify-center text-white font-medium text-sm">
                          {employee.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.fullName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalSlides > 1 && (
              <div className="flex items-center justify-between mt-4 border-t border-gray-200 pt-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700">
                    Showing {currentSlide * employeesPerSlide + 1} to {Math.min((currentSlide + 1) * employeesPerSlide, sortedEmployees.length)} of {sortedEmployees.length} employees
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={goToPrevSlide}
                    disabled={currentSlide === 0}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentSlide === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-[#bfa181] text-white hover:bg-[#8B7355]'
                    }`}
                  >
                    Previous
                  </button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          currentSlide === index
                            ? 'bg-[#bfa181] w-4'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={goToNextSlide}
                    disabled={currentSlide === totalSlides - 1}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentSlide === totalSlides - 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-[#bfa181] text-white hover:bg-[#8B7355]'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;