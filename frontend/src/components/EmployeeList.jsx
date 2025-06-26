import React, { useState, useEffect } from 'react';
import { employeeApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import axios from 'axios';
import departmentService from '../services/departmentService';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token === 'null' || token === 'undefined') {
      setError('You are not logged in. Please log in again.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    fetchEmployees();
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

  const handleAddEmployee = async (employeeData) => {
    try {
      console.log('Sending employee data:', employeeData);
      const token = localStorage.getItem('token');
      
      // Check if token exists and is valid
      if (!token) {
        setError('Not authenticated. Please log in again.');
        navigate('/login');
        return;
      }

      // Use the new admin-add-employee endpoint
      const response = await axios.post(
        'http://localhost:5181/api/Account/admin-add-employee',
        {
          fullName: employeeData.fullName,
          email: employeeData.email,
          password: employeeData.password,
          department: employeeData.department,
          position: employeeData.position
        },
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
            'Accept': '*/*'
          }
        }
      );

      console.log('Server response:', response.data);
      fetchEmployees(); // Refresh the list
      setShowAddForm(false);
      setError('');
      
      // Show success message
      setSuccessMessage('Employee added successfully!');
      // Auto hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error adding employee:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to add employee. Please check all fields and try again.');
      }
    }
  };

  const handleEditEmployee = async (employeeData) => {
    try {
      const response = await employeeApi.updateEmployee(selectedEmployee.id, employeeData);
      fetchEmployees();
      setShowAddForm(false);
      setSelectedEmployee(null);
      setError('');
    } catch (err) {
      console.error('Error updating employee:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to update employee. Please check all fields and try again.');
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowAddForm(true);
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await employeeApi.deleteEmployee(id);
      fetchEmployees();
    } catch (err) {
      console.error('Error deleting employee:', err);
      setError('Failed to delete employee');
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setSelectedEmployee(null);
    setError('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-2">Loading employees...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fafd] via-[#f8f6f2] to-[#e6e6e6] py-8 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 animate-gradient-move bg-gradient-to-tr from-[#bfa181]/20 via-[#f8f6f2]/60 to-[#8B7355]/10 blur-2xl opacity-80 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {successMessage && (
          <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in-down">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {successMessage}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl font-extrabold text-[#232946] tracking-tight drop-shadow">Manage Employees</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-[#bfa181] to-[#8B7355] text-white px-8 py-2 rounded-xl shadow-lg hover:from-[#8B7355] hover:to-[#bfa181] transition-colors font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-[#bfa181]"
          >
            + Add Employee
          </button>
        </div>

        {/* Modal for Add/Edit Form */}
        {showAddForm && (
          <Modal isOpen={showAddForm} onClose={resetForm}>
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-auto">
              <h2 className="text-xl font-bold text-[#232946] mb-4">
                {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <EmployeeFormContent
                initialData={selectedEmployee}
                onSubmit={selectedEmployee ? handleEditEmployee : handleAddEmployee}
                onCancel={resetForm}
              />
            </div>
          </Modal>
        )}

        {/* Employee Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white/90 rounded-2xl shadow-lg border border-[#bfa181]/10 flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:border-[#bfa181]/30 group"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-[#bfa181]/10 flex items-start space-x-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#bfa181] to-[#8B7355] flex items-center justify-center text-white font-semibold text-lg shadow-md">
                  {employee.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-[#232946] mb-1 group-hover:text-[#8B7355] transition-colors duration-300">
                    {employee.fullName}
                  </h3>
                  <p className="text-[#bfa181] text-sm font-medium truncate">
                    {employee.email}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-[#bfa181]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-sm font-medium text-[#232946]/70">
                    {employee.department}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-[#bfa181]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-[#232946]/70">
                    {employee.position}
                  </span>
                </div>


              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0 mt-auto">
                <div className="flex space-x-3">
                        <button
                    onClick={() => handleEdit(employee)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-[#bfa181] to-[#8B7355] text-white rounded-xl shadow-md hover:from-[#8B7355] hover:to-[#bfa181] transition-all duration-300 text-sm font-semibold flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                        <button
                    onClick={() => handleDeleteEmployee(employee.id)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-[#966F33] to-[#7B3F00] text-white rounded-xl shadow-md hover:from-[#7B3F00] hover:to-[#966F33] transition-all duration-300 text-sm font-semibold flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Separate form component to manage its own state
const EmployeeFormContent = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
    password: '',
    department: initialData?.department || '',
    position: initialData?.position || '',
    role: initialData?.role || 'Employee'
  });

  const [departments, setDepartments] = useState([]);
  const [positions] = useState(departmentService.getPositions());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await axios.get('http://localhost:5181/api/Department', {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        setDepartments(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Failed to load departments');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

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
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-semibold text-[#232946] mb-2">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-[#bfa181]/30 rounded-lg focus:ring-2 focus:ring-[#bfa181] focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#232946] mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-[#bfa181]/30 rounded-lg focus:ring-2 focus:ring-[#bfa181] focus:border-transparent"
          required
        />
      </div>
      {!initialData && (
        <div>
          <label className="block text-sm font-semibold text-[#232946] mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#bfa181]/30 rounded-lg focus:ring-2 focus:ring-[#bfa181] focus:border-transparent"
            required
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-semibold text-[#232946] mb-2">Department</label>
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-[#bfa181]/30 rounded-lg focus:ring-2 focus:ring-[#bfa181] focus:border-transparent"
          required
          disabled={loading}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#232946] mb-2">Position</label>
        <select
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-[#bfa181]/30 rounded-lg focus:ring-2 focus:ring-[#bfa181] focus:border-transparent"
          required
        >
          <option value="">Select Position</option>
          {positions.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#232946] mb-2">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-[#bfa181]/30 rounded-lg focus:ring-2 focus:ring-[#bfa181] focus:border-transparent"
          required
        >
          <option value="Employee">Employee</option>
          <option value="Admin">Admin</option>
        </select>
      </div>
      <div className="md:col-span-2 flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-[#bfa181] to-[#8B7355] text-white px-6 py-2 rounded-lg font-semibold hover:from-[#8B7355] hover:to-[#bfa181] transition-colors focus:outline-none focus:ring-2 focus:ring-[#bfa181] disabled:opacity-50"
        >
          {initialData ? 'Update' : 'Add'} Employee
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EmployeeList; 