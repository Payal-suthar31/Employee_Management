import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import ResetPassword from '../components/ResetPassword';
import authService from '../services/authService';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  // Reset Password States
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);

  const validateEmail = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    if (email.length > 100) {
      return 'Email must be less than 100 characters';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    if (name === 'email') setEmailError('');
    if (name === 'password') setPasswordError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmailError(validateEmail(value));
    if (name === 'password') setPasswordError(validatePassword(value));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate email before submission
    const emailValidationError = validateEmail(credentials.email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    // Validate password before submission
    const passwordValidationError = validatePassword(credentials.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    setLoading(true);
    setError('');
    setPasswordError('');

    try {
      const response = await authService.login(credentials.email, credentials.password);
      
      if (response.token) {
        // Store token and role
        localStorage.setItem('token', response.token);
        const userRole = response.role?.toLowerCase() || 'employee';
        localStorage.setItem('userRole', userRole);
        
        // Clear any existing employeeId
        localStorage.removeItem('employeeId');
        
        if (response.userId) {
          localStorage.setItem('userId', response.userId);
          
          // If user is an employee, fetch their employee details
          if (userRole === 'employee') {
            try {
              const employeeResponse = await axios.get(
                'http://localhost:5181/api/Employees/me',
                {
                  headers: {
                    'Authorization': response.token,
                    'Accept': '*/*'
                  }
                }
              );
              
              if (employeeResponse.data && employeeResponse.data.id) {
                localStorage.setItem('employeeId', employeeResponse.data.id);
              } else {
                throw new Error('Invalid employee data received');
              }
            } catch (error) {
              let errorMessage = 'Failed to fetch employee details. ';
              if (error.response?.status === 401) {
                errorMessage += 'Authentication failed. Please try logging in again.';
              } else if (error.response?.status === 404) {
                errorMessage += 'Employee record not found. Please contact support.';
              } else {
                errorMessage += 'Please try again or contact support.';
              }
              setError(errorMessage);
              setLoading(false);
              // Remove any invalid data
              localStorage.removeItem('token');
              localStorage.removeItem('userRole');
              localStorage.removeItem('userId');
              return;
            }
          }
        }
        
        // Navigate based on role
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/employee/dashboard');
        }
      }
    } catch (error) {
      setLoading(false);
      
      if (error.message === 'Invalid email or password.') {
        setPasswordError('Incorrect password. Please try again.');
        setCredentials(prev => ({ ...prev, password: '' })); // Clear password field
      } else if (error.response?.status === 401) {
        setPasswordError('Incorrect password. Please try again.');
        setCredentials(prev => ({ ...prev, password: '' })); // Clear password field
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const handleResetPassword = async () => {
    // Validate reset email
    const resetEmailError = validateEmail(resetEmail);
    if (resetEmailError) {
      setResetMessage(resetEmailError);
      return;
    }

    if (!resetEmail || !newPassword) {
      setResetMessage('Both fields are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5181/api/Account/reset-password', {
        email: resetEmail,
        newPassword: newPassword
      });

      setResetMessage('Password reset successful. You can now log in.');
      setTimeout(() => {
        setShowReset(false);
        setResetEmail('');
        setNewPassword('');
        setResetMessage('');
      }, 2000);
    } catch (err) {
      if (err.response?.data) {
        setResetMessage(err.response.data.message || 'Reset failed.');
      } else {
        setResetMessage('Something went wrong. Try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7fafd] via-[#f8f6f2] to-[#e6e6e6]">
      <div className="w-full max-w-3xl bg-white/80 rounded-2xl shadow-2xl border-t-4 border-[#bfa181] flex overflow-hidden">
        {/* Left: Form */}
        <div className="flex-1 p-10 flex flex-col justify-center">
          {/* Simple Login Heading */}
          <h2 className="text-4xl font-extrabold mb-8 text-[#bfa181] drop-shadow tracking-wider uppercase text-center">Login</h2>
          <p className="text-[#232946]/70 mb-6">Enter your credentials to access your dashboard.</p>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bfa181]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 01-8 0 4 4 0 018 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14v2m0 4h.01" /></svg>
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#bfa181] text-[#232946] bg-white/90 ${emailError ? 'border-red-500' : 'border-[#eaf0fa]'}`}
                placeholder="Enter your email"
                value={credentials.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bfa181]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17v.01" /></svg>
              </span>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#bfa181] text-[#232946] bg-white/90 ${passwordError ? 'border-red-500' : 'border-[#eaf0fa]'}`}
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {passwordError && <p className="text-red-400 text-sm mt-1">{passwordError}</p>}
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={loading || emailError || passwordError}
              className={`w-full py-3 bg-gradient-to-r from-[#bfa181] to-[#e6e6e6] text-[#232946] font-bold rounded-xl shadow-lg hover:from-[#e6e6e6] hover:to-[#bfa181] transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl flex justify-center items-center ${loading || emailError || passwordError ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                  <span className="ml-2">Logging in...</span>
                </div>
              ) : (
                'Login'
              )}
            </button>
            <div className="text-center mt-3 space-y-2">
              <span className="text-sm text-[#232946]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-[#bfa181] font-medium hover:underline"
                >
                  Register
                </button>
              </span>
              <div>
                <button
                  type="button"
                  onClick={() => setShowResetPassword(true)}
                  className="text-sm text-[#bfa181] font-medium hover:underline flex items-center justify-center mx-auto"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 4h.01M12 3v4M9 7h6m-3 10h.01M8 7V5c0-1.105.895-2 2-2h4c1.105 0 2 .895 2 2v2H8z" />
                  </svg>
                  Reset Password
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-sm text-[#bfa181] font-medium hover:underline flex items-center justify-center mx-auto"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* Right: Illustration with overlay */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-[#f7fafd] relative">
          <img src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=400&q=80" alt="Login Team" className="w-80 rounded-2xl shadow-lg relative z-10" />
          <div className="absolute w-72 h-72 bg-[#bfa181]/20 rounded-full blur-2xl -z-10 top-10 left-10"></div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showReset && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg border border-[#eaf0fa] p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-[#232946] mb-4">Reset Password</h2>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-[#232946] font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="Email"
                  className={`w-full px-4 py-3 rounded-lg border border-[#eaf0fa] bg-[#f7fafd] text-[#232946] focus:outline-none focus:ring-2 focus:ring-[#bfa181] ${resetMessage && resetMessage.includes('email') ? 'border-red-500' : ''}`}
                  value={resetEmail}
                  onChange={(e) => {
                    setResetEmail(e.target.value);
                    setResetMessage('');
                  }}
                  required
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                />
              </div>
              <div>
                <label className="block text-[#232946] font-semibold mb-2">New Password</label>
                <input
                  type="password"
                  placeholder="New password"
                  className="w-full px-4 py-3 rounded-lg border border-[#eaf0fa] bg-[#f7fafd] text-[#232946] focus:outline-none focus:ring-2 focus:ring-[#bfa181]"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
              {resetMessage && (
                <p className={`text-sm mt-2 ${resetMessage.toLowerCase().includes('success') ? 'text-[#2ecc71]' : 'text-red-400'}`}>{resetMessage}</p>
              )}
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowReset(false)}
                  className="px-6 py-2 text-[#232946] bg-[#eaf0fa] rounded-lg hover:bg-[#f7fafd] border border-[#eaf0fa]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#bfa181] text-white rounded-lg font-bold hover:bg-[#a68a6d] transition-colors duration-200"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ResetPassword
        isOpen={showResetPassword}
        onClose={() => setShowResetPassword(false)}
      />
    </div>
  );
};

export default Login;
