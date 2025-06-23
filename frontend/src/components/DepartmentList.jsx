import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DepartmentCard from './DepartmentCard';
import DepartmentForm from './DepartmentForm';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [departmentEmployeeCounts, setDepartmentEmployeeCounts] = useState({});
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Check if token exists
      if (!token) {
        setError('No authentication token found. Please login again.');
        return;
      }

      const deptResponse = await axios.get('http://localhost:5181/api/Department', {
        headers: {
          'Authorization': token, // token already has 'Bearer ' prefix from login
          'Accept': '*/*'
        }
      });
      const apiDepartments = deptResponse.data;
      setDepartments(apiDepartments);
      
      // Fetch employee counts for each department
      const counts = {};
      await Promise.all(
        apiDepartments.map(async (dept) => {
          try {
            const response = await axios.get(`http://localhost:5181/api/employees/by-department/${dept.name}`, {
              headers: {
                'Authorization': token, // token already has 'Bearer ' prefix from login
                'Accept': '*/*'
              }
            });
            counts[dept.name] = response.data.length;
          } catch (err) {
            console.error(`Error fetching employees for ${dept.name}:`, err);
            counts[dept.name] = 0;
          }
        })
      );
      setDepartmentEmployeeCounts(counts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching departments:', error);
      if (error.response?.status === 401) {
        setError('Your session has expired. Please login again.');
        // Optionally redirect to login
        window.location.href = '/login';
      } else {
      setError('Failed to load departments');
      }
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedDepartment(null);
  };

  const handleAddDepartment = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please login again.');
        return;
      }

      // Get the next available ID (this is just for the request, backend will handle actual ID)
      const nextId = departments.length > 0 ? Math.max(...departments.map(d => d.id)) + 1 : 1;

      const response = await axios.post('http://localhost:5181/api/Department', 
        {
          id: nextId,
          name: formData.name
        },
        {
          headers: {
            'Authorization': token,
            'Accept': '*/*',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        fetchDepartments();
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding department:', error);
      if (error.response?.status === 401) {
        setError('Your session has expired. Please login again.');
        window.location.href = '/login';
      } else if (error.response?.status === 400) {
        setError(error.response?.data?.message || 'Invalid department data. Please check the department name.');
      } else {
        setError('Failed to add department');
      }
    }
  };

  const handleDeleteDepartment = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please login again.');
        return;
      }

      const response = await axios.delete(`http://localhost:5181/api/Department/${id}`, {
        headers: {
          'Authorization': token,
          'Accept': '*/*'
        }
      });
      
      if (response.data === "Department deleted successfully.") {
      fetchDepartments();
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      if (error.response?.status === 401) {
        setError('Your session has expired. Please login again.');
        window.location.href = '/login';
      } else {
      setError('Failed to delete department');
      }
    }
  };

  const handleDepartmentClick = async (dept) => {
    setSelectedDepartment(dept);
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(filterText.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#fdf8f6]">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-[#BFA181] animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-t-2 border-b-2 border-[#D4C4B0] animate-spin animation-delay-150"></div>
          </div>
          <p className="text-[#232946] font-medium">Loading departments...</p>
        </div>
    </div>
  );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#fdf8f6]">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-[#bfa181]/10">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-center text-[#232946] mb-2">Error Loading Departments</h3>
          <p className="text-[#232946]/70 text-center">{error}</p>
          <button
            onClick={fetchDepartments}
            className="mt-6 w-full px-4 py-2 bg-[#BFA181] text-white rounded-lg hover:bg-[#A69073] transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
    </div>
  );
  }

  if (selectedDepartment) {
    return (
      <div className="min-h-screen bg-[#fdf8f6]">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleBack}
            className="mb-6 inline-flex items-center text-sm font-medium text-[#232946] hover:text-[#BFA181] transition-colors"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Departments
          </button>
          <DepartmentCard 
            department={selectedDepartment}
            expanded={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f6]">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#232946]">Manage Departments</h1>
              <p className="mt-2 text-[#232946]/70">Organize and manage company departments</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search departments..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-4 py-2 border border-[#bfa181]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bfa181]/20 focus:border-transparent bg-white"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-[#bfa181]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            <button
              onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#BFA181] to-[#8B7355] text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Department
            </button>
            </div>
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDepartments.map((dept) => (
                <div
                  key={dept.id}
              className="group bg-white rounded-xl border border-[#bfa181]/10 p-6 hover:shadow-lg transition-all duration-300 hover:border-[#bfa181]/30 relative overflow-hidden"
                >
              {/* Background Gradient Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#BFA181]/5 to-[#8B7355]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Department Info */}
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div 
                    className="flex-grow cursor-pointer"
                    onClick={() => handleDepartmentClick(dept)}
                  >
                    <div className="h-12 w-12 rounded-lg bg-[#BFA181] flex items-center justify-center text-white font-semibold mb-4">
                      {dept.name.substring(0, 2).toUpperCase()}
                  </div>
                    <h3 className="text-lg font-semibold text-[#232946] mb-2">{dept.name}</h3>
                </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDepartment(dept.id);
                    }}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200"
                    title="Delete Department"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  </div>

                <div className="flex items-center text-[#232946]/70 mb-4">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  <span>{departmentEmployeeCounts[dept.name] || 0} Employees</span>
                  </div>

                {/* View Details Link */}
                <div 
                  className="mt-4 inline-flex items-center text-[#BFA181] hover:text-[#8B7355] transition-colors cursor-pointer"
                  onClick={() => handleDepartmentClick(dept)}
                >
                  <span className="text-sm font-medium">View Details</span>
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Department Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-[#BFA181] to-[#8B7355] px-6 py-4 rounded-t-xl flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Add New Department</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
            <DepartmentForm
              onSubmit={handleAddDepartment}
              onCancel={() => setShowAddForm(false)}
            />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList; 