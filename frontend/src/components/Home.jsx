import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="bg-[#f7fafd] min-h-screen font-sans">
      {/* Header */}
      <nav
        className={`flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-lg shadow-lg'
            : 'bg-transparent'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 z-10">
          <span
            className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#bfa181] via-[#e6e6e6] to-[#fff] shadow-lg border-2 border-[#bfa181] rounded-xl relative overflow-hidden group-hover:scale-105 transition-transform duration-300"
          >
            <span className="text-base sm:text-lg font-extrabold tracking-wide z-10 text-[#232323]">
              EMS
            </span>
          </span>
          <span className="hidden sm:inline-block text-lg font-bold tracking-wider text-[#bfa181] drop-shadow-sm ml-2">
            Employee Management
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link 
            to="/" 
            className="px-3 py-2 text-[#232946] hover:text-[#bfa181] rounded-lg transition-colors duration-200 font-medium text-sm lg:text-base"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="px-3 py-2 text-[#232946] hover:text-[#bfa181] rounded-lg transition-colors duration-200 font-medium text-sm lg:text-base"
          >
            About Us
          </Link>
          <Link 
            to="/contact" 
            className="px-3 py-2 text-[#232946] hover:text-[#bfa181] rounded-lg transition-colors duration-200 font-medium text-sm lg:text-base"
          >
            Contact Us
          </Link>
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          <Link 
            to="/login" 
            className="px-4 py-2 text-[#232946] hover:text-[#bfa181] rounded-lg transition-colors duration-200 font-medium text-sm lg:text-base"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="px-4 py-2 bg-[#bfa181] text-white rounded-lg hover:bg-[#a68a6d] transition-colors duration-200 font-medium text-sm lg:text-base"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden z-50 p-2 text-[#232946] hover:text-[#bfa181] transition-colors rounded-lg hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleMobileMenu}
        >
          {/* Mobile Menu Panel */}
          <div
            className={`absolute right-0 top-0 h-screen w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
              mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Content */}
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <span className="text-lg font-bold text-[#232946]">Menu</span>
              </div>
              
              {/* Mobile Menu Links */}
              <div className="flex flex-col p-4 space-y-2">
                <Link
                  to="/"
                  className="flex items-center space-x-2 text-[#232946] hover:text-[#bfa181] font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Home</span>
                </Link>
                <Link
                  to="/about"
                  className="flex items-center space-x-2 text-[#232946] hover:text-[#bfa181] font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>About Us</span>
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center space-x-2 text-[#232946] hover:text-[#bfa181] font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Contact Us</span>
                </Link>
                
                <div className="h-px bg-gray-200 my-4"></div>
                
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-[#232946] hover:text-[#bfa181] font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 bg-[#bfa181] text-white font-medium py-2 px-3 rounded-lg hover:bg-[#a68a6d] transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Register</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-10 py-8 sm:py-16 bg-gradient-to-r from-[#f8f6f2] to-[#e6e6e6]">
        <div className="flex-1 text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#5c5c5c] mb-4 drop-shadow-lg">
            Empower Your <span className="text-[#bfa181]">Team</span> with EMS
          </h1>
          <p className="text-[#7d7d7d] text-base sm:text-lg mb-6 max-w-xl mx-auto md:mx-0">
            The all-in-one Employee Management System for modern businesses. Effortlessly manage employees, teams, and reports with security and speed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/register" className="bg-[#bfa181] text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-[#a68a6d] transition-colors text-center">Get Started</Link>
            <a href="#team" className="px-8 py-3 rounded-full border-2 border-[#bfa181] text-[#bfa181] font-semibold hover:bg-[#f8f6f2] transition-colors text-center">Meet the Team</a>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <img src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=600&q=80" 
               alt="Professional Team" 
               className="rounded-3xl shadow-2xl w-full max-w-[340px] md:max-w-[420px] object-cover border-4 border-[#e6e6e6]" />
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-12 sm:py-16 bg-gradient-to-br from-[#f3ede7] to-[#e6e6e6] px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#5c5c5c] mb-8 sm:mb-10 text-center tracking-wide">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 max-w-6xl mx-auto">
          {[{
            name: 'Denisha',
            role: 'Team Lead',
            img: 'https://randomuser.me/api/portraits/women/68.jpg',
            }, {
            name: 'Amit Patel',
            role: 'Backend Developer',
            img: 'https://randomuser.me/api/portraits/men/32.jpg',
          }, {
            name: 'Priya Sharma',
            role: 'Frontend Developer',
            img: 'https://randomuser.me/api/portraits/women/65.jpg',
          }, {
            name: 'Rahul Mehta',
            role: 'UI/UX Designer',
            img: 'https://randomuser.me/api/portraits/men/44.jpg',
          }].map((member, idx) => (
            <div
              key={member.name}
              className="relative bg-white/90 rounded-2xl shadow-xl p-6 flex flex-col items-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl mx-auto w-full max-w-[280px]"
              style={{
                boxShadow: '0 8px 32px 0 rgba(191,161,129,0.15), 0 1.5px 6px 0 rgba(192,192,192,0.10)',
                border: '1.5px solid #e6e6e6',
              }}
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-24 sm:w-28 h-24 sm:h-28 rounded-full object-cover border-4 border-[#bfa181] shadow-lg mb-4"
                style={{ boxShadow: '0 4px 16px 0 rgba(191,161,129,0.18)' }}
              />
              <h3 className="text-lg sm:text-xl font-bold text-[#5c5c5c] mb-1">{member.name}</h3>
              <p className="text-[#bfa181] font-semibold mb-2">{member.role}</p>
              <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[#bfa181] to-[#e6e6e6] mb-2"></div>
              <p className="text-[#7d7d7d] text-center text-sm">Passionate about building great teams and products.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 bg-white relative overflow-x-hidden px-4">
        <div className="absolute left-0 top-0 w-96 h-96 bg-[#bfa181]/10 rounded-full blur-3xl -z-10 animate-pulse-slow" />
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#232946] mb-8 sm:mb-10 text-center">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[{
              icon: <svg className="w-8 sm:w-10 h-8 sm:h-10 text-[#bfa181] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
              title: 'Employee Management',
              desc: 'Add, edit, and manage all your employees in one place.'
            }, {
              icon: <svg className="w-8 sm:w-10 h-8 sm:h-10 text-[#bfa181] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 018 0v2" /></svg>,
              title: 'Team Collaboration',
              desc: 'Collaborate and communicate with your team efficiently.'
            }, {
              icon: <svg className="w-8 sm:w-10 h-8 sm:h-10 text-[#bfa181] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3z" /></svg>,
              title: 'Analytics & Reports',
              desc: 'Generate insightful reports and analytics for your business.'
            }, {
              icon: <svg className="w-8 sm:w-10 h-8 sm:h-10 text-[#bfa181] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 018 0v2" /></svg>,
              title: 'Secure Data',
              desc: 'Your employee data is protected with enterprise-grade security.'
            }].map((feature, idx) => (
              <div
                key={feature.title}
                className="bg-white/90 p-6 sm:p-8 rounded-2xl shadow-xl border border-[#e6e6e6] flex flex-col items-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl text-center"
              >
                {feature.icon}
                <h3 className="text-base sm:text-lg font-semibold text-[#232946] mb-2">{feature.title}</h3>
                <p className="text-[#7d7d7d] text-sm sm:text-base">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Preview */}
      <section className="py-12 sm:py-16 bg-[#f7fafd] px-4 sm:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
            <div className="w-full lg:w-1/2 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80"
                alt="About Team"
                className="rounded-2xl shadow-xl w-full max-w-[320px] md:max-w-[400px] object-cover border-4 border-[#bfa181]"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <div className="bg-white/90 rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#e6e6e6]">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#bfa181] mb-4">About Us</h2>
                <p className="text-[#7d7d7d] mb-4 text-sm sm:text-base">
                  EMS is dedicated to helping businesses manage their workforce with ease and efficiency. 
                  Our mission is to empower teams with the best tools for employee management, collaboration, and growth.
                </p>
                <Link to="/about" className="text-[#bfa181] font-semibold hover:underline inline-flex items-center">
                  Learn more about us
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Preview */}
      <section className="py-12 sm:py-16 bg-white px-4 sm:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-10">
            <div className="w-full lg:w-1/2">
              <div className="bg-white/90 rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#e6e6e6]">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#bfa181] mb-4">Contact Us</h2>
                <p className="text-[#7d7d7d] mb-4 text-sm sm:text-base">
                  Have questions or need support? Reach out to our team and we'll get back to you as soon as possible.
                </p>
                <Link to="/contact" className="text-[#bfa181] font-semibold hover:underline inline-flex items-center">
                  Go to Contact Page
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80"
                alt="Contact Team"
                className="rounded-2xl shadow-xl w-full max-w-[320px] md:max-w-[400px] object-cover border-4 border-[#bfa181]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] text-white py-8 sm:py-12 mt-10 border-t border-[#232323]/40 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl sm:text-2xl font-extrabold tracking-wider text-white">EMS</span>
              </div>
              <p className="text-[#e0e0e0]/80 text-sm sm:text-base mb-4">
                Manage your employees, teams, and reports with ease and security.
              </p>
              <div className="flex gap-4 mt-2">
                <a href="#" className="text-sm sm:text-base hover:text-[#bfa181] transition-colors">Facebook</a>
                <a href="#" className="text-sm sm:text-base hover:text-[#bfa181] transition-colors">Twitter</a>
                <a href="#" className="text-sm sm:text-base hover:text-[#bfa181] transition-colors">Instagram</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="flex flex-col space-y-2">
                <Link to="/" className="text-[#e0e0e0]/80 hover:text-[#bfa181] transition-colors text-sm sm:text-base">Home</Link>
                <Link to="/about" className="text-[#e0e0e0]/80 hover:text-[#bfa181] transition-colors text-sm sm:text-base">About Us</Link>
                <Link to="/contact" className="text-[#e0e0e0]/80 hover:text-[#bfa181] transition-colors text-sm sm:text-base">Contact</Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <div className="flex flex-col space-y-2">
                <a href="#" className="text-[#e0e0e0]/80 hover:text-[#bfa181] transition-colors text-sm sm:text-base">Employee Management</a>
                <a href="#" className="text-[#e0e0e0]/80 hover:text-[#bfa181] transition-colors text-sm sm:text-base">Team Collaboration</a>
                <a href="#" className="text-[#e0e0e0]/80 hover:text-[#bfa181] transition-colors text-sm sm:text-base">Reports & Analytics</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="flex flex-col space-y-2 text-sm sm:text-base">
                <p className="text-[#e0e0e0]/80">Email: info@ems.com</p>
                <p className="text-[#e0e0e0]/80">Phone: (123) 456-7890</p>
                <p className="text-[#e0e0e0]/80">Address: 123 Business St, City</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[#232323] text-center text-sm sm:text-base">
            <p className="text-[#e0e0e0]/60">
              © {new Date().getFullYear()} Employee Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes navbar-shine {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        .animate-navbar-shine {
          background-size: 400px 100%;
          animation: navbar-shine 3.5s linear infinite;
        }
        @keyframes logo-shine {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        .animate-logo-shine {
          animation: logo-shine 2.5s ease-in-out infinite;
        }
        .logo-glass {
          background: rgba(255,255,255,0.35);
          backdrop-filter: blur(8px) saturate(180%);
          -webkit-backdrop-filter: blur(8px) saturate(180%);
        }
        .font-montserrat {
          font-family: 'Montserrat', Arial, sans-serif;
        }
      `}</style>
    </div>
  );
};

export default Home; 