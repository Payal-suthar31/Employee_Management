import React from 'react';

const team = [
  {
    name: 'Payal Suthar',
    role: 'Team Lead',
    img: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    name: 'Amit Patel',
    role: 'Backend Developer',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Priya Sharma',
    role: 'Frontend Developer',
    img: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    name: 'Rahul Mehta',
    role: 'UI/UX Designer',
    img: 'https://randomuser.me/api/portraits/men/44.jpg',
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7fafd] via-[#f8f6f2] to-[#e6e6e6] py-8 px-2">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left: Company Info */}
        <div className="md:w-1/2 w-full flex flex-col justify-center p-8 gap-6 bg-white">
          <h1 className="text-3xl font-extrabold mb-2 text-[#bfa181] drop-shadow">About Us</h1>
          <p className="text-[#232946]/80 mb-2 text-base">Welcome to EMS! We are dedicated to empowering businesses with a modern Employee Management System that makes managing teams, departments, and reports simple and secure.</p>
          <div className="mb-2">
            <h2 className="text-xl font-bold text-[#bfa181] mb-1">Our Mission</h2>
            <p className="text-[#232946]/70">To help organizations grow by providing the best tools for employee management, collaboration, and analytics—so you can focus on what matters most: your people.</p>
          </div>
          <div className="mb-2">
            <h2 className="text-xl font-bold text-[#bfa181] mb-1">Our Vision</h2>
            <p className="text-[#232946]/70">To be the most trusted platform for employee and team management worldwide.</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#bfa181] mb-1">Our Values</h2>
            <ul className="list-disc pl-6 text-[#232946]/80 text-sm">
          <li>Innovation in HR technology</li>
          <li>Transparency and trust</li>
          <li>Customer-centric approach</li>
          <li>Data security and privacy</li>
        </ul>
          </div>
        </div>
        {/* Right: Team Grid */}
        <div className="md:w-1/2 w-full flex flex-col justify-center p-8 bg-[#f7fafd]">
          <h2 className="text-2xl font-bold text-[#232946] mb-4 text-center md:text-left">Meet Our Team</h2>
          <div className="grid grid-cols-2 gap-4">
            {team.map((member) => (
              <div key={member.name} className="flex flex-col items-center bg-white/90 rounded-xl shadow p-4">
                <img src={member.img} alt={member.name} className="w-20 h-20 rounded-full object-cover border-4 border-[#bfa181] shadow mb-2" />
                <div className="text-[#232946] font-semibold text-base">{member.name}</div>
                <div className="text-[#bfa181] text-sm font-medium">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 