import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import departmentService from '../../services/departmentService';

const PendingRequests = () => {
  const [pendingEmployees, setPendingEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const checkAuthAndFetchData = useCallback(async () => {
    try {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
        setError('Please login to continue');
        navigate('/login', { replace: true });
        return;
      }

      // Verify token format and expiration
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
        
        if (Date.now() >= expirationTime) {
          setError('Session expired. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          navigate('/login', { replace: true });
          return;
        }

        // Verify admin role from token
        const roleFromToken = tokenData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        if (roleFromToken !== 'Admin') {
          setError('Access denied. Admin privileges required.');
          navigate('/login', { replace: true });
          return;
        }
      } catch (e) {
        console.error('Error parsing token:', e);
        setError('Invalid token. Please login again.');
        navigate('/login', { replace: true });
      return;
    }

    if (!userRole || userRole.toLowerCase() !== 'admin') {
        setError('Access denied. Admin privileges required.');
        navigate('/login', { replace: true });
      return;
    }

      await Promise.all([
        fetchPendingEmployees(),
        fetchDepartments()
      ]);
      setPositions(departmentService.getPositions());
    } catch (error) {
      console.error('Error in initialization:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        navigate('/login', { replace: true });
      } else {
        setError('Failed to initialize page');
      }
    }
  }, [navigate]);

  useEffect(() => {
    checkAuthAndFetchData();
  }, [checkAuthAndFetchData]);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const data = await departmentService.getAllDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      if (error.response?.status === 401) {
        navigate('/login', { replace: true });
        return;
      }
      setError('Failed to load departments');
    }
  };

  const fetchPendingEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get('http://localhost:5181/api/Account/pending-requests', {
        headers: {
          'Authorization': token,
          'Accept': 'application/json'
        }
      });
      setPendingEmployees(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching pending employees:', error);
      if (error.response?.status === 401) {
        navigate('/login', { replace: true });
        return;
      }
      setError('Failed to load pending employees');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (employeeId, departmentId, position) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Current token:', token); // Debug token

      if (!token) {
        setError('Please login to continue');
        navigate('/login', { replace: true });
        return;
      }

      const selectedDepartment = departments.find(d => d.id === parseInt(departmentId));
      
      if (!selectedDepartment) {
        setError('Please select a valid department');
        return;
      }

      const requestData = {
        department: selectedDepartment.name,
        position: position
      };
      console.log('Request data:', requestData); // Debug request data

      // Simple request matching the curl format
      const response = await axios({
        method: 'post',
        url: `http://localhost:5181/api/Account/approve-user/${employeeId}`,
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        data: requestData
      });

      console.log('Response:', response); // Debug response

      if (response.status === 200) {
        setError(null);
        await fetchPendingEmployees();
      }
    } catch (error) {
      console.error('Full error object:', error); // Debug full error
      console.error('Error response:', error.response); // Debug error response
      
      if (error.response?.status === 401) {
        // Check if token is expired
        try {
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
          if (Date.now() >= expirationTime) {
            setError('Session expired. Please login again.');
            localStorage.removeItem('token'); // Clear expired token
            localStorage.removeItem('userRole'); // Clear role
            navigate('/login', { replace: true });
            return;
          }
        } catch (e) {
          console.error('Error parsing token:', e);
        }

        setError('Unauthorized. Please login again.');
        navigate('/login', { replace: true });
        return;
      }
      setError(error.response?.data || 'Failed to approve employee');
    }
  };

  const handleReject = async (employeeId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to continue');
        navigate('/login', { replace: true });
        return;
      }

      const response = await axios.post(
        `http://localhost:5181/api/Account/reject-user/${employeeId}`,
        {},
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setError(null);
        await fetchPendingEmployees();
      }
    } catch (error) {
      console.error('Error rejecting employee:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        navigate('/login', { replace: true });
        return;
      }
      setError('Failed to reject employee');
    }
  };

  if (loading) return (
      <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error) return (
    <div className="container mx-auto p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Pending Requests</h2>
      {pendingEmployees.length === 0 ? (
        <p className="text-gray-500">No pending requests</p>
        ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
                <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Department</th>
                <th className="px-6 py-3 text-left">Position</th>
                <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
            <tbody>
              {pendingEmployees.map((employee) => (
                <tr key={employee.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{employee.fullName}</td>
                  <td className="px-6 py-4">{employee.email}</td>
                    <td className="px-6 py-4">
                      <select
                      className="w-full rounded-md border border-gray-300 p-2"
                      onChange={(e) => {
                        const updatedEmployees = pendingEmployees.map(emp => 
                          emp.id === employee.id 
                            ? {...emp, departmentId: e.target.value}
                            : emp
                        );
                        setPendingEmployees(updatedEmployees);
                      }}
                      value={employee.departmentId || ''}
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                      className="w-full rounded-md border border-gray-300 p-2"
                      onChange={(e) => {
                        const updatedEmployees = pendingEmployees.map(emp => 
                          emp.id === employee.id 
                            ? {...emp, position: e.target.value}
                            : emp
                        );
                        setPendingEmployees(updatedEmployees);
                      }}
                      value={employee.position || ''}
                    >
                      <option value="">Select Position</option>
                      {positions.map(pos => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                      </select>
                    </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        onClick={() => handleApprove(employee.id, employee.departmentId, employee.position)}
                        disabled={!employee.departmentId || !employee.position}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={() => handleReject(employee.id)}
                      >
                        Reject
                      </button>
                    </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

export default PendingRequests;
