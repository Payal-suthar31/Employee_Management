import React, { useEffect, useState } from 'react';
import { employeeApi } from '../../services/api';
import EmployeeModal from '../../components/EmployeeModal';

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const response = await employeeApi.getAllEmployees();
      setEmployees(response.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingEmployee(null);
    setModalOpen(true);
  };

  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeApi.deleteEmployee(id);
        fetchEmployees();
      } catch (err) {
        console.error('Failed to delete employee:', err);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingEmployee) {
        await employeeApi.updateEmployee(editingEmployee.id, formData);
      } else {
        await employeeApi.createEmployee(formData);
      }
      setModalOpen(false);
      fetchEmployees();
    } catch (err) {
      console.error('Failed to save employee:', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-[#f7fafd] via-[#f8f6f2] to-[#e6e6e6] flex items-center justify-center">
        <div className="text-center text-lg text-[#232946]/70 font-semibold">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#f7fafd] via-[#f8f6f2] to-[#e6e6e6]">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-3xl font-extrabold text-[#232946] tracking-tight drop-shadow">Manage Employees</h1>
        <button
          onClick={handleAddClick}
          className="bg-gradient-to-r from-[#bfa181] to-[#8B7355] text-white px-8 py-2 rounded-xl shadow-lg hover:from-[#8B7355] hover:to-[#bfa181] transition-colors font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-[#bfa181]"
        >
          + Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white/80 rounded-2xl shadow-xl border border-[#bfa181]/30 flex flex-col justify-between h-full glass-card transition-all duration-300"
            style={{ minHeight: '280px' }}
          >
            <div className="p-6 flex-1 flex flex-col gap-2">
              <div className="text-lg font-bold text-[#232946] mb-1 truncate">{employee.fullName}</div>
              <div className="text-sm text-[#bfa181] font-semibold">{employee.email}</div>
              <div className="text-xs text-[#232946]/70 mb-1">{employee.department}</div>
              <div className="text-xs text-[#232946]/60 mb-1">{employee.position}</div>
              <div className="mt-2">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                    employee.isActive
                      ? 'bg-[#eafaf1] text-[#2ecc71]'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {employee.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-[#eaf0fa] bg-[#f7fafd]/60 rounded-b-2xl">
              <button
                onClick={() => handleEditClick(employee)}
                className="px-4 py-1 rounded-lg font-semibold bg-gradient-to-r from-[#bfa181] to-[#8B7355] text-white shadow hover:from-[#8B7355] hover:to-[#bfa181] transition-colors focus:outline-none focus:ring-2 focus:ring-[#bfa181]"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(employee.id)}
                className="px-4 py-1 rounded-lg font-semibold bg-gradient-to-r from-red-400 to-red-700 text-white shadow hover:from-red-700 hover:to-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <EmployeeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        employee={editingEmployee}
      />
      <style>{`
        .glass-card {
          backdrop-filter: blur(12px) saturate(160%);
          -webkit-backdrop-filter: blur(12px) saturate(160%);
        }
      `}</style>
    </div>
  );
};

export default ManageEmployees; 