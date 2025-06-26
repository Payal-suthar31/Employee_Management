import React from 'react';
import { Link } from 'react-router-dom';

const stats = [
  { 
    label: 'Employee Records', 
    value: 'Secure',
    description: 'End-to-end encrypted data storage'
  },
  { 
    label: 'Department Management', 
    value: 'Flexible',
    description: 'Easy organization structure'
  },
  { 
    label: 'Report System', 
    value: 'Real-time',
    description: 'Instant report generation'
  },
  { 
    label: 'User Experience', 
    value: 'Modern',
    description: 'Intuitive interface design'
  }
];

const features = [
  {
    title: 'Employee Management',
    description: 'Complete employee profile management with secure storage of personal and professional information. Easy to update and maintain records.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Department System',
    description: 'Efficiently organize departments and teams. Track department-wise employee distribution and manage organizational structure.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: 'Report Generation',
    description: 'Create and manage detailed reports with our intuitive report submission system. Track and review reports efficiently.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'User Authentication',
    description: 'Secure login and registration system with role-based access control for administrators and employees.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

const team = [
  {
    name: 'Denisha',
    role: 'Team Lead & Manager',
    img: 'https://randomuser.me/api/portraits/women/68.jpg',
    description: 'Leading with innovation'
  },
  {
    name: 'Amit Patel',
    role: 'Backend Developer',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    description: 'Building robust systems'
  },
  {
    name: 'Priya Sharma',
    role: 'Frontend Developer',
    img: 'https://randomuser.me/api/portraits/women/65.jpg',
    description: 'Crafting user experiences'
  },
  {
    name: 'Rahul Mehta',
    role: 'UI/UX Designer',
    img: 'https://randomuser.me/api/portraits/men/44.jpg',
    description: 'Designing with purpose'
  },
  {
    name: 'Sarah Chen',
    role: 'Quality Assurance',
    img: 'https://randomuser.me/api/portraits/women/45.jpg',
    description: 'Ensuring excellence'
  },
  {
    name: 'Michael Ross',
    role: 'DevOps Engineer',
    img: 'https://randomuser.me/api/portraits/men/55.jpg',
    description: 'Optimizing deployment'
  }
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fafd] via-[#f8f6f2] to-[#e6e6e6]">
      {/* Back to Home Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-[#232946] hover:text-[#bfa181]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Back to Home</span>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#bfa181]">
              Welcome to
              <br className="sm:hidden" />
              <span className="mt-4 md:mt-6 block">
                Employee Management System
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg text-black/80 leading-relaxed">
              Our platform provides a centralized solution for managing employee information, 
              departments, and reports. We help organizations maintain employee records securely while enabling efficient 
              communication between administrators and team members.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#bfa181]/10 to-transparent pointer-events-none"></div>
      </div>

      {/* Stats Section */}
      <div className="bg-white/80 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 bg-white/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-2xl md:text-3xl font-bold text-[#bfa181] mb-2">{stat.value}</div>
                <div className="text-base font-semibold text-black mb-2">{stat.label}</div>
                <div className="text-sm text-black/70">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-[#bfa181] mb-4">Our Mission</h2>
              <p className="text-black/80 text-lg">
                To simplify employee management through a user-friendly digital platform that handles everything from 
                employee records and department organization to report generation and team collaboration.
              </p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-[#bfa181] mb-4">Our Vision</h2>
              <p className="text-black/80 text-lg">
                To create the most efficient and secure employee management solution that helps organizations 
                focus on growth while we handle the complexities of employee administration.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/80 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#bfa181] mb-12">
            What Sets Us Apart
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-[#bfa181] mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-black mb-2">{feature.title}</h3>
                <p className="text-black/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#bfa181] mb-12">
            Meet Our Team
          </h2>
          <div className="flex justify-center items-center gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="relative bg-white/90 rounded-2xl shadow-xl p-6 flex flex-col items-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl w-[200px] h-[280px]"
                style={{
                  boxShadow: '0 8px 32px 0 rgba(191,161,129,0.15), 0 1.5px 6px 0 rgba(192,192,192,0.10)',
                  border: '1.5px solid #e6e6e6',
                }}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#bfa181] shadow-lg"
                  style={{ boxShadow: '0 4px 16px 0 rgba(191,161,129,0.18)' }}
                />
                <div className="flex flex-col items-center flex-1 justify-between mt-4">
                  <div className="flex flex-col items-center">
                    <h3 className="text-xl font-bold text-[#5c5c5c] mb-2 text-center h-7 line-clamp-1">{member.name}</h3>
                    <p className="text-[#bfa181] font-semibold text-base mb-4 text-center h-6 line-clamp-1">{member.role}</p>
                    <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[#bfa181] to-[#e6e6e6]"></div>
                  </div>
                  <p className="text-[#7d7d7d] text-center text-sm h-5 line-clamp-1">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white/80 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#bfa181] mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-[#bfa181]">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-black">Innovation in HR Technology</h3>
                  <p className="mt-1 text-black/70">Continuously evolving our solutions to meet modern HR challenges</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-[#bfa181]">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-black">Transparency and Trust</h3>
                  <p className="mt-1 text-black/70">Building lasting relationships through open communication</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-[#bfa181]">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-black">Customer-Centric Approach</h3>
                  <p className="mt-1 text-black/70">Putting our clients' needs at the heart of everything we do</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-[#bfa181]">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-black">Data Security and Privacy</h3>
                  <p className="mt-1 text-black/70">Ensuring the highest standards of data protection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 