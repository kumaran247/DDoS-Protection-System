import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  FaGlobe,
  FaBan,
  FaFire,
  FaUsers,
  FaExclamationTriangle,
} from 'react-icons/fa';
import StatCard from '../components/StatCard';
import getSocket from '../services/socket';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const socket = getSocket();
    socket.emit('subscribe-dashboard');

    socket.on('dashboard-update', (data) => {
      setStats(data);
    });

    return () => socket.off('dashboard-update');
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#9ca3af' } },
    },
    scales: {
      x: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  };

  const hours = stats?.hourlyData?.map((h) => h.hour) || [];
  const makeChart = (label, dataKey, color) => ({
    labels: hours,
    datasets: [{
      label,
      data: stats?.hourlyData?.map((h) => h[dataKey]) || [],
      borderColor: color,
      backgroundColor: `${color}33`,
      fill: true,
      tension: 0.4,
    }],
  });

  const threatColor = {
    Low: 'green',
    Medium: 'orange',
    High: 'red',
    Critical: 'red',
  };

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap justify-between items-start mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Real-Time Monitoring</h1>
            <p className="text-gray-400">SOC-style dashboard with live Socket.io updates</p>
          </div>
          {stats && (
            <div className={`px-4 py-2 rounded-lg border ${
              stats.status === 'SAFE' ? 'severity-low' : 'severity-critical'
            }`}>
              <span className="font-bold">{stats.status}</span>
              <span className="ml-2 text-sm">Score: {stats.threatScore}/100</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard title="Total Requests" value={stats?.totalRequests?.toLocaleString()} icon={FaGlobe} color="cyan" />
          <StatCard title="Blocked Requests" value={stats?.blockedRequests?.toLocaleString()} icon={FaBan} color="red" />
          <StatCard title="Attack Attempts" value={stats?.attackAttempts?.toLocaleString()} icon={FaFire} color="orange" />
          <StatCard title="Active Users" value={stats?.activeUsers} icon={FaUsers} color="purple" />
          <StatCard title="Threat Level" value={stats?.threatLevel} icon={FaExclamationTriangle} color={threatColor[stats?.threatLevel] || 'purple'} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {[
            { title: 'Traffic Graph', label: 'Requests', key: 'requests', color: '#06B6D4' },
            { title: 'Attack Graph', label: 'Attacks', key: 'attacks', color: '#EF4444' },
            { title: 'Blocked Traffic', label: 'Blocked', key: 'blocked', color: '#7C3AED' },
          ].map((chart) => (
            <div key={chart.key} className="neon-card rounded-xl p-4">
              <h3 className="font-bold mb-4 text-sm">{chart.title}</h3>
              <div className="h-48">
                <Line data={makeChart(chart.label, chart.key, chart.color)} options={chartOptions} />
              </div>
            </div>
          ))}
        </div>

        <div className="neon-card rounded-xl p-6">
          <h3 className="font-bold mb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left py-3">Timestamp</th>
                  <th className="text-left py-3">IP Address</th>
                  <th className="text-left py-3">Request Count</th>
                  <th className="text-left py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentActivity?.map((log) => (
                  <tr key={log._id} className="border-b border-gray-800 hover:bg-white/5">
                    <td className="py-3 mono text-xs">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 mono">{log.ip}</td>
                    <td className="py-3">{log.requests}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded border ${
                        log.status === 'Blocked' ? 'severity-critical' :
                        log.status === 'Suspicious' ? 'severity-high' : 'severity-low'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!stats?.recentActivity?.length && (
              <p className="text-gray-500 text-center py-8">Waiting for live data...</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
