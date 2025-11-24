import React from "react";
import UniLogo  from '../images/kasbLogo.png';

const ModernHeader: React.FC = () => {
  return (
    <header className="text-gray-300 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        {/* Logo / Brand */}
        <a href="/" className="text-white text-xl font-semibold hover:text-teal-400 transition" style={{width: "60px", height: "60px"}}>
          <img src={UniLogo} alt="UniLogo" />
        </a>

        {/* Navigation */}
        <nav className="flex space-x-6 text-sm font-medium">
          <a href="/dashboard" className="hover:text-gray-400 transition">
            Home
          </a>
          <a href="/profile" className="hover:text-gray-400 transition">
            Profile
          </a>
          <a href="/classes" className="hover:text-gray-400 transition">
            Classes
          </a>
          <a href="/assignments" className="hover:text-gray-400 transition">
            Assignments
          </a>
          <a href="/attendance" className="hover:text-gray-400 transition">
            Attendance
          </a>
          <a href="/grades" className="hover:text-gray-400 transition">
            Grades
          </a>
          {/* <a href="/fees" className="hover:text-gray-400 transition">
            Fees
          </a> */}
          <a href="/notices" className="hover:text-gray-400 transition">
            Notices
          </a>
          <a href="/login" className="hover:text-gray-400 transition">
            Logout
          </a>
        </nav>
      </div>
    </header>
  );
};

export default ModernHeader;