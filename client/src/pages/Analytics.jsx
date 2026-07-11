import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import StatCard from '../components/StatCard';
import { FaCrosshairs, FaUserSecret, FaChartLine, FaMountain, FaBullseye } from 'react-icons/fa';
import { analyticsAPI } from '../services/api';

const COLORS = ['#06B6D4', '#F59E0B', '#EF4444'];

const Analytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    analyticsAPI.getData().then((res) => setData(res.data)).catch(() => {});
  }, []);

  const pieData = data
    ? [
        { name: 'Normal Traffic', value: data.trafficDistribution.normal },
        { name: 'Suspicious Traffic', value: data.trafficDistribution.suspicious },
        { name: 'Blocked Traffic', value: data.trafficDistribution.blocked },
      ]
    : [];

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text mb-2">Attack Analytics</h1>
        <p className="text-gray-400 mb-8">Comprehensive traffic and attack pattern analysis</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            title="Most Targeted Endpoint"
            value={data?.mostTargetedEndpoint?.endpoint || '—'}
            subtitle={data?.mostTargetedEndpoint ? `${data.mostTargetedEndpoint.count} hits` : ''}
            icon={FaCrosshairs}
            color="cyan"
          />
          <StatCard
            title="Top Attacker IP"
            value={data?.mostFrequentAttacker?.ip || '—'}
            subtitle={data?.mostFrequentAttacker ? `${data.mostFrequentAttacker.count} req` : ''}
            icon={FaUserSecret}
            color="red"
          />
          <StatCard title="Average Traffic" value={data?.averageTraffic} icon={FaChartLine} color="purple" />
          <StatCard title="Peak Traffic" value={data?.peakTraffic} icon={FaMountain} color="orange" />
          <StatCard title="Detection Accuracy" value={`${data?.detectionAccuracy ?? 0}%`} icon={FaBullseye} color="green" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="neon-card rounded-xl p-6">
            <h3 className="font-bold mb-4">Traffic Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #7C3AED' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="neon-card rounded-xl p-6">
            <h3 className="font-bold mb-4">Daily Attacks</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data?.dailyAttacks || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <YAxis tick={{ fill: '#6b7280' }} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #7C3AED' }} />
                <Bar dataKey="count" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="neon-card rounded-xl p-6">
            <h3 className="font-bold mb-4">Traffic Growth</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data?.trafficGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <YAxis tick={{ fill: '#6b7280' }} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #7C3AED' }} />
                <Line type="monotone" dataKey="requests" stroke="#06B6D4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {data?.geolocation?.length > 0 && (
          <div className="neon-card rounded-xl p-6">
            <h3 className="font-bold mb-4">Geolocation Attack Map</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {data.geolocation.map((loc) => (
                <div
                  key={loc.country}
                  className="glass rounded-lg p-4 text-center hover:border-cyber-cyan/50 border border-transparent transition-all"
                >
                  <div
                    className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-xs font-bold"
                    style={{
                      background: `rgba(239, 68, 68, ${Math.min(loc.count / 20, 1) * 0.8})`,
                    }}
                  >
                    {loc.count}
                  </div>
                  <p className="text-sm font-medium">{loc.country}</p>
                  <p className="text-xs text-gray-500">{loc.lat.toFixed(1)}, {loc.lng.toFixed(1)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Analytics;
