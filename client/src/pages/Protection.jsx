import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBan, FaShieldAlt, FaRobot, FaFire } from 'react-icons/fa';
import { protectionAPI, trafficAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Protection = () => {
  const { isAdmin } = useAuth();
  const [blockedIps, setBlockedIps] = useState([]);
  const [firewallRules, setFirewallRules] = useState([]);
  const [rateLimit, setRateLimit] = useState({ limit: 100, allowed: 0, blocked: 0, remaining: 100 });
  const [blockForm, setBlockForm] = useState({ ip: '', reason: 'DDoS Attack' });
  const [ruleForm, setRuleForm] = useState({ type: 'IP Block', value: '', description: '' });
  const [captcha, setCaptcha] = useState({ a: 0, b: 0, answer: '', result: null });

  useEffect(() => {
    fetchData();
    generateCaptcha();
    const interval = setInterval(fetchRateLimit, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [ips, rules] = await Promise.all([
        protectionAPI.getBlockedIps(),
        protectionAPI.getFirewallRules(),
      ]);
      setBlockedIps(ips.data);
      setFirewallRules(rules.data);
      fetchRateLimit();
    } catch {
      // ignore
    }
  };

  const fetchRateLimit = async () => {
    try {
      const res = await trafficAPI.getRateLimit();
      setRateLimit(res.data);
    } catch {
      // ignore
    }
  };

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ a, b, answer: '', result: null });
  };

  const handleBlockIp = async (e) => {
    e.preventDefault();
    if (!isAdmin) return alert('Admin access required');
    try {
      await protectionAPI.blockIp(blockForm);
      setBlockForm({ ip: '', reason: 'DDoS Attack' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to block IP');
    }
  };

  const handleUnblock = async (ip) => {
    if (!isAdmin) return alert('Admin access required');
    await protectionAPI.unblockIp(ip);
    fetchData();
  };

  const handleAddRule = async (e) => {
    e.preventDefault();
    if (!isAdmin) return alert('Admin access required');
    try {
      await protectionAPI.addFirewallRule(ruleForm);
      setRuleForm({ type: 'IP Block', value: '', description: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add rule');
    }
  };

  const handleDeleteRule = async (id) => {
    if (!isAdmin) return alert('Admin access required');
    await protectionAPI.deleteFirewallRule(id);
    fetchData();
  };

  const handleCaptcha = async () => {
    const res = await protectionAPI.verifyCaptcha({
      answer: captcha.answer,
      expected: captcha.a + captcha.b,
    });
    setCaptcha((c) => ({ ...c, result: res.data.passed }));
  };

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text mb-2">Protection Mechanisms</h1>
        <p className="text-gray-400 mb-8">Rate limiting, IP blocking, CAPTCHA, and firewall rules</p>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="neon-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <FaFire className="text-cyber-cyan text-xl" />
              <h2 className="text-lg font-bold">Rate Limiting</h2>
            </div>
            <p className="text-gray-400 text-sm mb-4">Limit: {rateLimit.limit} Requests Per Minute</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="glass rounded-lg p-4 text-center">
                <p className="text-green-400 text-2xl font-bold">{rateLimit.allowed}</p>
                <p className="text-xs text-gray-400">Allowed</p>
              </div>
              <div className="glass rounded-lg p-4 text-center">
                <p className="text-red-400 text-2xl font-bold">{rateLimit.blocked}</p>
                <p className="text-xs text-gray-400">Blocked</p>
              </div>
              <div className="glass rounded-lg p-4 text-center">
                <p className="text-cyber-cyan text-2xl font-bold">{rateLimit.remaining}</p>
                <p className="text-xs text-gray-400">Remaining</p>
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyber-purple to-cyber-cyan transition-all"
                style={{ width: `${Math.min((rateLimit.allowed / rateLimit.limit) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="neon-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <FaRobot className="text-cyber-cyan text-xl" />
              <h2 className="text-lg font-bold">CAPTCHA Verification</h2>
            </div>
            <p className="text-gray-400 text-sm mb-4">Simulate human verification challenge</p>
            <div className="glass rounded-lg p-4 mb-4 text-center">
              <p className="text-2xl font-bold mono">{captcha.a} + {captcha.b} = ?</p>
            </div>
            <div className="flex gap-3">
              <input
                type="number"
                className="input-field"
                placeholder="Answer"
                value={captcha.answer}
                onChange={(e) => setCaptcha({ ...captcha, answer: e.target.value, result: null })}
              />
              <button onClick={handleCaptcha} className="btn-primary whitespace-nowrap">Verify</button>
            </div>
            {captcha.result !== null && (
              <p className={`mt-3 text-sm ${captcha.result ? 'text-green-400' : 'text-red-400'}`}>
                {captcha.result ? 'Verification successful!' : 'Verification failed. Try again.'}
              </p>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="neon-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <FaBan className="text-red-400 text-xl" />
              <h2 className="text-lg font-bold">IP Blocking System</h2>
            </div>
            <form onSubmit={handleBlockIp} className="flex gap-3 mb-6">
              <input
                className="input-field"
                placeholder="IP Address"
                value={blockForm.ip}
                onChange={(e) => setBlockForm({ ...blockForm, ip: e.target.value })}
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap" disabled={!isAdmin}>
                Block IP
              </button>
            </form>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {blockedIps.map((b) => (
                <div key={b._id} className="flex justify-between items-center glass rounded-lg p-3">
                  <div>
                    <span className="mono text-sm">{b.ip}</span>
                    <p className="text-xs text-gray-500">{b.reason}</p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleUnblock(b.ip)}
                      className="text-xs px-3 py-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    >
                      Unblock
                    </button>
                  )}
                </div>
              ))}
              {blockedIps.length === 0 && <p className="text-gray-500 text-sm">No blocked IPs</p>}
            </div>
          </div>

          <div className="neon-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <FaShieldAlt className="text-cyber-cyan text-xl" />
              <h2 className="text-lg font-bold">Firewall Rules</h2>
            </div>
            <form onSubmit={handleAddRule} className="space-y-3 mb-6">
              <select
                className="input-field"
                value={ruleForm.type}
                onChange={(e) => setRuleForm({ ...ruleForm, type: e.target.value })}
              >
                <option>IP Block</option>
                <option>Country Block</option>
                <option>User Agent Block</option>
              </select>
              <input
                className="input-field"
                placeholder="Value (IP, Country, or User Agent)"
                value={ruleForm.value}
                onChange={(e) => setRuleForm({ ...ruleForm, value: e.target.value })}
                required
              />
              <button type="submit" className="btn-primary w-full" disabled={!isAdmin}>
                Add Rule
              </button>
            </form>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {firewallRules.map((r) => (
                <div key={r._id} className="flex justify-between items-center glass rounded-lg p-3">
                  <div>
                    <span className="text-cyber-cyan text-sm">{r.type}</span>
                    <p className="mono text-sm">{r.value}</p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteRule(r._id)}
                      className="text-xs px-3 py-1 rounded bg-red-500/20 text-red-400"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Protection;
