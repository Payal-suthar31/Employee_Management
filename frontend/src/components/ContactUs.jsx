import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    timestamp: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const validateForm = () => {
    let tempErrors = {
      name: '',
      email: '',
      message: ''
    };
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      tempErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      tempErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      tempErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Message validation
    if (!formData.message.trim()) {
      tempErrors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = 'Message must be at least 10 characters';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });
    const timestamp = new Date().toISOString();
    
    try {
      await emailjs.send(
        'service_152g5yx',
        'template_cxgcuco',
        {
          ...formData,
          timestamp: timestamp
        },
        'b5iD5Id_p4DQ3YCzg'
      );
      setSubmitStatus({
        type: 'success',
        message: 'Thank you! Your message has been sent successfully.'
      });
      setFormData({ name: '', email: '', message: '', timestamp: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-white to-[#bfa181]/5 flex flex-col">
      {/* Hero Section - Compact */}
      <motion.div 
        className="relative bg-white/50 backdrop-blur-sm py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-3xl font-extrabold text-[#bfa181] mb-2">
              Get in Touch
            </h1>
            <p className="text-black/80 leading-relaxed">
              Have questions? We're here to help! Send us a message.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content Area - Fixed Height */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Contact Form Section */}
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 overflow-hidden flex flex-col"
          {...fadeInUp}
        >
          <form onSubmit={handleSubmit} className="flex flex-col h-full gap-4">
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <label htmlFor="name" className="block text-sm font-medium text-black">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-[#bfa181]'} bg-white/50 py-2 px-3 text-black placeholder-black/40 shadow-sm focus:border-[#bfa181] focus:ring-[#bfa181] focus:ring-opacity-50 transition-all duration-200`}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-[#bfa181]'} bg-white/50 py-2 px-3 text-black placeholder-black/40 shadow-sm focus:border-[#bfa181] focus:ring-[#bfa181] focus:ring-opacity-50 transition-all duration-200`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="flex-1">
              <label htmlFor="message" className="block text-sm font-medium text-black">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                id="message"
                required
                value={formData.message}
                onChange={handleChange}
                className={`mt-1 block w-full h-[calc(100%-2rem)] rounded-md border ${errors.message ? 'border-red-500' : 'border-[#bfa181]'} bg-white/50 py-2 px-3 text-black placeholder-black/40 shadow-sm focus:border-[#bfa181] focus:ring-[#bfa181] focus:ring-opacity-50 transition-all duration-200 resize-none`}
                placeholder="Your message here... (minimum 10 characters)"
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-500">{errors.message}</p>
              )}
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.4 }} className="flex justify-center w-full">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-8 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#bfa181] hover:bg-[#bfa181]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bfa181] transition-all duration-200 flex items-center justify-center ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className="text-center">Send Message</span>
                )}
              </button>
            </motion.div>

            {submitStatus.message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center p-2 rounded-md ${
                  submitStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}
              >
                {submitStatus.message}
              </motion.div>
            )}
          </form>
        </motion.div>

        {/* Contact Information Cards - Grid */}
        <div className="grid grid-rows-3 gap-4">
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 flex items-center space-x-4 hover:shadow-xl transition-all duration-300"
            {...fadeInUp}
            transition={{ delay: 0.5 }}
          >
            <div className="text-[#bfa181] text-2xl">📍</div>
            <div>
              <h3 className="text-sm font-semibold text-black">Our Location</h3>
              <p className="text-sm text-black/70">102 Shanti Villa, Near Sadar Bazar, Udaipur, Rajasthan – 313001</p>
          </div>
          </motion.div>
          
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 flex items-center space-x-4 hover:shadow-xl transition-all duration-300"
            {...fadeInUp}
            transition={{ delay: 0.6 }}
          >
            <div className="text-[#bfa181] text-2xl">📧</div>
            <div>
              <h3 className="text-sm font-semibold text-black">Email Us</h3>
              <p className="text-sm text-black/70">
                <a href="mailto:contact@example.com" className="hover:text-[#bfa181] transition-colors">priyanshikarathore8@gmail.com</a>
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 flex items-center space-x-4 hover:shadow-xl transition-all duration-300"
            {...fadeInUp}
            transition={{ delay: 0.7 }}
          >
            <div className="text-[#bfa181] text-2xl">📞</div>
            <div>
              <h3 className="text-sm font-semibold text-black">Call Us</h3>
              <p className="text-sm text-black/70">+91 9123456789<br />Mon-Fri 9am-5pm EST</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hidden timestamp field */}
      <input
        type="hidden"
        name="timestamp"
        value={formData.timestamp}
      />
    </div>
  );
};

export default ContactUs; 