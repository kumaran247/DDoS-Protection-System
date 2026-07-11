import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserShield, FaUsers, FaTrash, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { authAPI, trafficAPI, protectionAPI, detectionAPI } from '../services/api';
import StatCard from '../components/StatCard';

const Admin = () => {
  const { user, login, logout, isAdmin } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', role: 'viewer' });
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ users: 0, blockedIps: 0, threats: 0 });

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    try {
      const [usersRes, ipsRes, detectionRes] = await Promise.all([
        authAPI.getUsers(),
        protectionAPI.getBlockedIps(),
        detectionAPI.getStatus(),
      ]);
      setUsers(usersRes.data);
      setStats({
        users: usersRes.data.length,
        blockedIps: ipsRes.data.length,
        threats: detectionRes.data.attackDetected ? 1 : 0,
      });
    } catch {
      // ignore
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(loginForm.email, loginForm.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await authAPI.register(registerForm);
      alert('Registration successful! Please login with your credentials.');
      setIsLogin(true);
      setRegisterForm({ name: '', email: '', password: '', role: 'viewer' });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    await authAPI.deleteUser(id);
    fetchAdminData();
  };

  const handleClearLogs = async () => {
    if (!confirm('Clear all traffic logs?')) return;
    await trafficAPI.clearLogs();
  };

  if (!user) {
    return (
      <div className="page-container flex items-center justify-center min-h-[70vh]">
        <motion.div
          className="neon-card rounded-xl p-8 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center mb-8">
            <FaUserShield className="text-5xl text-cyber-purple mx-auto mb-4" />
            <h1 className="text-2xl font-bold gradient-text">{isLogin ? 'Admin Login' : 'Register New Member'}</h1>
            <p className="text-gray-400 text-sm mt-2">JWT Authentication with Role-Based Access</p>
          </div>

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Email</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="admin@gmail.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="admin123"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <FaSignInAlt /> Login
              </button>
              <p className="text-center text-sm text-gray-400 mt-4">
                Don't have an account?{' '}
                <button type="button" onClick={() => { setIsLogin(false); setError(''); }} className="text-cyber-cyan hover:underline">
                  Register
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="John Doe"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Email</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="user@example.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="password123"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Role</label>
                <select
                  className="input-field"
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                >
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <FaUserPlus /> Register
              </button>
              <p className="text-center text-sm text-gray-400 mt-4">
                Already have an account?{' '}
                <button type="button" onClick={() => { setIsLogin(true); setError(''); }} className="text-cyber-cyan hover:underline">
                  Login
                </button>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Admin Panel</h1>
            <p className="text-gray-400">
              Welcome, {user.name} — Role: <span className="text-cyber-cyan capitalize">{user.role}</span>
            </p>
          </div>
          <button onClick={logout} className="btn-outline text-sm">Logout</button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <StatCard title="User Count" value={stats.users} icon={FaUsers} color="purple" />
          <StatCard title="Blocked IPs" value={stats.blockedIps} icon={FaUserShield} color="red" />
          <StatCard title="Current Threats" value={stats.threats} icon={FaUserShield} color="orange" />
        </div>

        {isAdmin ? (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="neon-card rounded-xl p-6">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <FaUsers /> Manage Users
              </h2>
              <div className="space-y-2">
                {users.map((u) => (
                  <div key={u._id} className="flex justify-between items-center glass rounded-lg p-3">
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email} — {u.role}</p>
                    </div>
                    {u.email !== user.email && (
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="text-red-400 hover:text-red-300 p-2"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="neon-card rounded-xl p-6">
              <h2 className="font-bold mb-4">Admin Actions</h2>
              <div className="space-y-3">
                <button onClick={handleClearLogs} className="w-full btn-outline text-left px-4">
                  Clear Traffic Logs
                </button>
                <a href="/protection" className="block w-full btn-outline text-left px-4 py-3">
                  Manage Blocked IPs & Firewall
                </a>
                <a href="/reports" className="block w-full btn-outline text-left px-4 py-3">
                  Generate Reports
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="neon-card rounded-xl p-8 text-center">
            <p className="text-gray-400">
              You are logged in as a Viewer. Admin features require admin role.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Admin;
