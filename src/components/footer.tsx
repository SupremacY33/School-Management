import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';

const ModernFooter: React.FC = () => {
  return (
    <footer className="text-gray-300 py-10 mt-auto border-t border-gray-280">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Column 1 */}
          <div>
            <h2 className="text-dark font-bold text-xl mb-4">School Management</h2>
            <p className="text-dark text-sm">
              A modern and efficient way to manage your school — students, teachers, and everything in between.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-dark font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gray-400 transition-colors">Dashboard</a></li>
              <li><a href="#" className="hover:text-gray-400 transition-colors">Students</a></li>
              <li><a href="#" className="hover:text-gray-400 transition-colors">Teachers</a></li>
              <li><a href="#" className="hover:text-gray-400 transition-colors">Admissions</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-dark font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gray-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-gray-400 transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gray-400 transition-colors">Terms of Use</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-dark font-semibold mb-4">Contact Us</h3>
            <p className="text-sm text-dark mb-2">📍 Karachi, Pakistan</p>
            <p className="text-sm text-dark mb-2">📧 info@schoolms.com</p>
            <p className="text-sm text-dark mb-4">📞 +92 300 1234567</p>

            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-400"><FaFacebookF /></a>
              <a href="#" className="hover:text-gray-400"><FaTwitter /></a>
              <a href="#" className="hover:text-gray-400"><FaInstagram /></a>
              <a href="#" className="hover:text-gray-400"><FaLinkedinIn /></a>
              <a href="#" className="hover:text-gray-400"><FaGithub /></a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} <span className="text-dark font-medium">School Management System</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;