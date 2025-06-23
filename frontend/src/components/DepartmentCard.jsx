import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DepartmentCard = ({ department, expanded = false }) => {
  const [departmentEmployees, setDepartmentEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (expanded) {
      fetchDepartmentEmployees();
    }
  }, [expanded, department.name]);

  const fetchDepartmentEmployees = async () => {
    if (!department?.name) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5181/api/employees/by-department/${department.name}`, {
        headers: {
          'Authorization': token,
          'Accept': 'application/json'
        }
      });
      setDepartmentEmployees(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching department employees:', err);
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  if (!department?.name) {
    return null;
  }

  if (!expanded) {
    return null;
  }

  return (
    <div className="p-6 bg-white">
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-lg bg-[#BFA181] flex items-center justify-center text-white font-semibold">
            {department.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{department.name}</h2>
            <p className="mt-1 text-gray-600">
              {departmentEmployees.length} {departmentEmployees.length === 1 ? 'Employee' : 'Employees'}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-[#BFA181] animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-t-2 border-b-2 border-[#D4C4B0] animate-spin animation-delay-150"></div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      ) : departmentEmployees.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-[#BFA181] flex items-center justify-center text-white font-medium">
                        {employee.fullName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.fullName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{employee.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{employee.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(employee.dateOfJoining).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-16 w-16 text-[#BFA181] mb-4">
            <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Employees Found</h3>
          <p className="text-gray-600">This department doesn't have any employees yet.</p>
        </div>
      )}
    </div>
  );
};

export default DepartmentCard; 