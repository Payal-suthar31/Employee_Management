import React, { useState } from 'react';

const validateEmail = (email) => {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setSuccess('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(form.email)) newErrors.email = 'Please enter a valid email address';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess('');
      return;
    }
    setErrors({});
    setSuccess('Thank you! Your message has been sent.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7fafd] via-[#f8f6f2] to-[#e6e6e6] py-8 px-2">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left: Contact Info */}
        <div className="md:w-1/2 w-full flex flex-col justify-center p-6 gap-6 bg-white">
          <div className="mb-2">
            <span className="inline-flex items-center text-[#2196f3] text-2xl mr-2 align-middle">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a2 2 0 011.789 1.106l1.387 2.773a2 2 0 01-.217 2.18l-1.516 1.89a11.042 11.042 0 005.516 5.516l1.89-1.516a2 2 0 012.18-.217l2.773 1.387A2 2 0 0121 18.72V21a2 2 0 01-2 2h-1C9.163 23 1 14.837 1 5V4a2 2 0 012-2z" /></svg>
            </span>
            <span className="font-bold text-[#232946] text-base align-middle">Call Us</span>
            <div className="text-[#232946]/70 text-sm ml-8">+1 234 567 890</div>
          </div>
          <div className="mb-2">
            <span className="inline-flex items-center text-[#bfa181] text-2xl mr-2 align-middle">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-8 0v-1m8 0V7a4 4 0 00-8 0v5" /></svg>
            </span>
            <span className="font-bold text-[#232946] text-base align-middle">Email Us</span>
            <div className="text-[#232946]/70 text-sm ml-8">info@ems.com</div>
          </div>
          <div>
            <span className="inline-flex items-center text-[#2196f3] text-2xl mr-2 align-middle">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 12.414a2 2 0 00-2.828 0l-4.243 4.243A8 8 0 1116.657 7.343z" /></svg>
            </span>
            <span className="font-bold text-[#232946] text-base align-middle">Address</span>
            <div className="text-[#232946]/70 text-sm ml-8">123 Main Street, City, Country</div>
          </div>
        </div>
        {/* Right: Form */}
        <div className="md:w-1/2 w-full flex flex-col justify-center p-6 bg-[#f7fafd]">
          <div className="mb-2 text-center md:text-left">
            <div className="text-[#bfa181] text-sm font-semibold">Find us</div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#232946] mb-2">Contact Us</h2>
          </div>
          <form className="space-y-3" onSubmit={handleSubmit} noValidate>
            <div className="flex gap-3">
              <div className="flex-1 min-w-0">
                <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className={`w-full px-3 py-2 rounded-lg border ${errors.name ? 'border-red-400' : 'border-[#eaf0fa]'} focus:outline-none focus:ring-2 focus:ring-[#bfa181] text-[#232946] text-sm bg-white/90`} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div className="flex-1 min-w-0">
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className={`w-full px-3 py-2 rounded-lg border ${errors.email ? 'border-red-400' : 'border-[#eaf0fa]'} focus:outline-none focus:ring-2 focus:ring-[#bfa181] text-[#232946] text-sm bg-white/90`} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
            <input type="text" name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-[#eaf0fa] focus:outline-none focus:ring-2 focus:ring-[#bfa181] text-[#232946] text-sm bg-white/90" />
            <div>
              <textarea name="message" placeholder="Message" rows={4} value={form.message} onChange={handleChange} className={`w-full px-3 py-2 rounded-lg border ${errors.message ? 'border-red-400' : 'border-[#eaf0fa]'} focus:outline-none focus:ring-2 focus:ring-[#bfa181] text-[#232946] text-sm bg-white/90`} />
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
            </div>
            <button type="submit" className="w-full py-2 bg-gradient-to-r from-[#bfa181] to-[#e6e6e6] text-[#232946] font-bold rounded-lg shadow hover:from-[#e6e6e6] hover:to-[#bfa181] transition-colors text-base mt-2 flex justify-center items-center">Send Message</button>
            {success && <div className="text-green-600 text-center mt-2 font-semibold">{success}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs; 