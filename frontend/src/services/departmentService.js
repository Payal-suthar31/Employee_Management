import axios from 'axios';

const API_URL = 'http://localhost:5181/api';

const departmentService = {
  getAllDepartments: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/Department`, {
        headers: {
          'Authorization': `${token}`, // Token already includes 'Bearer ' prefix
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },

  getPositions: () => {
    // Common positions - can be extended
    return [
      'Manager',
      'Team Lead',
      'Senior Developer',
      'Developer',
      'Junior Developer',
      'Intern',
      'HR Executive',
      'HR Manager',
      'Sales Executive',
      'Sales Manager',
      'Marketing Executive',
      'Marketing Manager',
      'QA Engineer',
      'DevOps Engineer',
      'System Administrator',
      'Project Manager'
    ];
  }
};

export default departmentService; 