import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    Email: '',
    Password: '',
    FullName: '',
    Role: 'Employee'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    if (email.length > 100) return 'Email must be less than 100 characters';
    return '';
  };

  const validateFullName = (name) => {
    if (!name) return 'Full name is required';
    if (name.length < 3) return 'Full name must be at least 3 characters';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'FullName') setFullNameError('');
    if (name === 'Email') setEmailError('');
    if (name === 'Password') setPasswordError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'FullName') setFullNameError(validateFullName(value));
    if (name === 'Email') setEmailError(validateEmail(value));
    if (name === 'Password') setPasswordError(validatePassword(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailValidationError = validateEmail(formData.Email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5181/api/Account/register',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.data.token) navigate('/login');
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.data;
        setError(typeof errorMessage === 'string' ? errorMessage : 'Registration failed.');
      } else if (error.request) {
        setError('No response from server. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7fafd] via-[#f8f6f2] to-[#e6e6e6]">
      <div className="w-full max-w-3xl bg-white/80 rounded-2xl shadow-2xl border-t-4 border-[#bfa181] flex overflow-hidden">
        {/* Left: Form */}
        <div className="flex-1 p-10 flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold mb-8 text-[#bfa181] drop-shadow tracking-wider uppercase text-center">Register</h2>
          <p className="text-[#232946]/70 mb-6 text-center">Join our platform and empower your team with modern management tools.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bfa181]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </span>
              <input
                id="FullName"
                name="FullName"
                type="text"
                required
                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#bfa181] text-[#232946] bg-white/90 ${fullNameError ? 'border-red-500' : 'border-[#eaf0fa]'}`}
                placeholder="Enter your full name"
                value={formData.FullName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {fullNameError && <p className="text-red-400 text-sm mt-1">{fullNameError}</p>}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bfa181]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 01-8 0 4 4 0 018 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14v2m0 4h.01" /></svg>
              </span>
              <input
                id="Email"
                name="Email"
                type="email"
                required
                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#bfa181] text-[#232946] bg-white/90 ${emailError ? 'border-red-500' : 'border-[#eaf0fa]'}`}
                placeholder="Enter your email"
                value={formData.Email}
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
                id="Password"
                name="Password"
                type="password"
                required
                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#bfa181] text-[#232946] bg-white/90 ${passwordError ? 'border-red-500' : 'border-[#eaf0fa]'}`}
                placeholder="Create a password"
                value={formData.Password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {passwordError && <p className="text-red-400 text-sm mt-1">{passwordError}</p>}
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={loading || emailError || fullNameError || passwordError}
              className={`w-full py-3 bg-gradient-to-r from-[#bfa181] to-[#e6e6e6] text-[#232946] font-bold rounded-xl shadow-lg hover:from-[#e6e6e6] hover:to-[#bfa181] transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl flex justify-center items-center ${loading || emailError || fullNameError || passwordError ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                  <span className="ml-2">Registering...</span>
                </div>
              ) : (
                'Register'
              )}
            </button>
            <div className="text-center mt-3 space-y-2">
              <span className="text-sm text-[#232946]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-[#bfa181] font-medium hover:underline"
                >
                  Login
                </button>
              </span>
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
          <img src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=400&q=80" alt="Register Team" className="w-80 rounded-2xl shadow-lg relative z-10" />
          <div className="absolute w-72 h-72 bg-[#bfa181]/20 rounded-full blur-2xl -z-10 top-10 left-10"></div>
        </div>
      </div>
    </div>
  );
};

export default Register; 