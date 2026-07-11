import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaShieldAlt,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUserShield,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from './NotificationCenter';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/simulator', label: 'Simulator' },
  { to: '/detection', label: 'Detection' },
  { to: '/protection', label: 'Protection' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/architecture', label: 'Architecture' },
  { to: '/reports', label: 'Reports' },
  { to: '/admin', label: 'Admin' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-cyber-purple/20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <FaShieldAlt className="text-2xl text-cyber-purple" />
            <span 
              className="hidden sm:block font-bold"
              style={{
                fontSize: '32px',
                fontWeight: '700',
                letterSpacing: '0.5px',
                background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              DDoS Shield
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-cyber-purple/20 text-cyber-cyan'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <NotificationCenter />
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 hidden md:block">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                  title="Logout"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-purple/20 text-cyber-cyan text-sm hover:bg-cyber-purple/30 transition-colors"
              >
                <FaUserShield /> Login
              </Link>
            )}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          className="lg:hidden glass border-t border-cyber-purple/20 px-4 py-4"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg mb-1 ${
                  isActive ? 'bg-cyber-purple/20 text-cyber-cyan' : 'text-gray-300'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
