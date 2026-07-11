import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaStop, FaExclamationTriangle } from 'react-icons/fa';
import { trafficAPI } from '../services/api';
import getSocket from '../services/socket';

const attackTypes = [
  'Normal Traffic',
  'HTTP Flood',
  'SYN Flood',
  'UDP Flood',
  'Botnet Attack',
];

const TrafficSimulator = () => {
  const [form, setForm] = useState({
    numRequests: '50',
    requestRate: '50',
    sourceIp: '',
    attackType: 'HTTP Flood',
  });
  const [state, setState] = useState({ running: false, requestCount: 0, status: 'Idle', logs: [] });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchState();
    fetchLogs();
    const socket = getSocket();

    socket.on('traffic-update', (data) => {
      setState((s) => ({ ...s, requestCount: data.totalRequests, status: data.status || s.status }));
      if (data.logs) {
        setLogs((prev) => [...data.logs, ...prev].slice(0, 50));
      }
    });

    return () => socket.off('traffic-update');
  }, []);

  const fetchState = async () => {
    try {
      const res = await trafficAPI.getState();
      setState(res.data);
    } catch {
      // ignore
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await trafficAPI.getLogs({ limit: 30 });
      setLogs(res.data.logs);
      setState(res.data.state);
    } catch {
      // ignore
    }
  };

  const handleNormal = async () => {
    setLoading(true);
    try {
      const res = await trafficAPI.simulateNormal({
        requestRate: Number(form.requestRate),
        numRequests: Number(form.numRequests),
        sourceIp: form.sourceIp || undefined,
      });
      setState(res.data.state);
      fetchLogs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate traffic');
    }
    setLoading(false);
  };

  const handleAttack = async () => {
    setLoading(true);
    try {
      const res = await trafficAPI.simulateAttack({
        requestRate: Number(form.requestRate),
        numRequests: Number(form.numRequests),
        sourceIp: form.sourceIp || undefined,
        attackType: form.attackType,
      });
      setState(res.data.state);
      fetchLogs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate attack');
    }
    setLoading(false);
  };

  const handleStop = async () => {
    try {
      const res = await trafficAPI.stop();
      setState(res.data.state);
    } catch {
      // ignore
    }
  };

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text mb-2">Traffic Simulator</h1>
        <p className="text-gray-400 mb-8">Simulate incoming network traffic and DDoS attacks</p>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="neon-card rounded-xl p-6">
            <h2 className="text-lg font-bold mb-6">Simulation Parameters</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Number of Requests</label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="input-field"
                  value={form.numRequests}
                  onChange={(e) => setForm({ ...form, numRequests: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Request Rate (req/sec)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="input-field"
                  value={form.requestRate}
                  onChange={(e) => setForm({ ...form, requestRate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Source IP Address</label>
                <input
                  type="text"
                  className="input-field mono"
                  placeholder="192.168.1.1 (optional)"
                  value={form.sourceIp}
                  onChange={(e) => setForm({ ...form, sourceIp: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Attack Type</label>
                <select
                  className="input-field"
                  value={form.attackType}
                  onChange={(e) => setForm({ ...form, attackType: e.target.value })}
                >
                  {attackTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button onClick={handleNormal} disabled={loading} className="btn-primary flex items-center gap-2">
                <FaPlay /> Generate Normal Traffic
              </button>
              <button
                onClick={handleAttack}
                disabled={loading}
                className="px-6 py-3 rounded-lg font-semibold bg-red-600/80 hover:bg-red-600 flex items-center gap-2 transition-all"
              >
                <FaExclamationTriangle /> Generate DDoS Traffic
              </button>
              <button onClick={handleStop} className="btn-outline flex items-center gap-2">
                <FaStop /> Stop Simulation
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="neon-card rounded-xl p-5 text-center">
                <p className="text-gray-400 text-sm">Live Request Count</p>
                <p className="text-3xl font-bold text-cyber-cyan mono">{state.requestCount}</p>
              </div>
              <div className="neon-card rounded-xl p-5 text-center">
                <p className="text-gray-400 text-sm">Live Status</p>
                <p className={`text-lg font-bold ${state.running ? 'text-green-400' : 'text-gray-400'}`}>
                  {state.status}
                </p>
              </div>
            </div>

            <div className="neon-card rounded-xl p-6">
              <h3 className="font-bold mb-4">Traffic Logs</h3>
              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-700">
                      <th className="text-left py-2">Time</th>
                      <th className="text-left py-2">IP</th>
                      <th className="text-left py-2">Req</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log._id} className="border-b border-gray-800 hover:bg-white/5">
                        <td className="py-2 mono text-xs">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-2 mono text-xs">{log.ip}</td>
                        <td className="py-2">{log.requests}</td>
                        <td className="py-2">{log.type}</td>
                        <td className="py-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            log.status === 'Blocked' ? 'bg-red-500/20 text-red-400' :
                            log.status === 'Suspicious' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {logs.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No traffic logs yet. Start a simulation.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TrafficSimulator;
