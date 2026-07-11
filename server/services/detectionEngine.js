import TrafficLog from '../models/TrafficLog.js';
import BlockedIP from '../models/BlockedIP.js';
import Notification from '../models/Notification.js';

const THRESHOLDS = {
  requestRate: 100,
  sameIpRequests: 50,
  spikeMultiplier: 3,
};

export const calculateThreatScore = (metrics) => {
  const { totalRequests, blockedCount, uniqueIps, avgRequestsPerIp, attackCount } = metrics;
  let score = 0;

  score += Math.min((totalRequests / 1000) * 20, 30);
  score += Math.min((blockedCount / Math.max(totalRequests, 1)) * 100 * 0.3, 25);
  score += Math.min(avgRequestsPerIp * 0.5, 20);
  score += Math.min((attackCount / Math.max(totalRequests, 1)) * 100 * 0.25, 25);

  if (uniqueIps > 100) score += 10;

  return Math.min(Math.round(score), 100);
};

export const getThreatLevel = (score) => {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 30) return 'Medium';
  return 'Low';
};

export const analyzeTraffic = async (recentMinutes = 5) => {
  const since = new Date(Date.now() - recentMinutes * 60 * 1000);
  const logs = await TrafficLog.find({ timestamp: { $gte: since } }).lean();

  const totalRequests = logs.reduce((sum, l) => sum + l.requests, 0);
  const attackLogs = logs.filter((l) => l.type !== 'Normal');
  const blockedLogs = logs.filter((l) => l.status === 'Blocked');

  const ipCounts = {};
  logs.forEach((l) => {
    ipCounts[l.ip] = (ipCounts[l.ip] || 0) + l.requests;
  });

  const uniqueIps = Object.keys(ipCounts).length;
  const avgRequestsPerIp = uniqueIps ? totalRequests / uniqueIps : 0;
  const maxIpRequests = Math.max(...Object.values(ipCounts), 0);
  const topIp = Object.entries(ipCounts).sort((a, b) => b[1] - a[1])[0];

  const detections = [];

  if (totalRequests > THRESHOLDS.requestRate * recentMinutes) {
    detections.push({ rule: 'High Request Rate', severity: 'High' });
  }
  if (maxIpRequests > THRESHOLDS.sameIpRequests) {
    detections.push({ rule: 'Same IP Repeated Requests', severity: 'High', ip: topIp?.[0] });
  }
  if (attackLogs.length > logs.length * 0.3) {
    detections.push({ rule: 'Traffic Spikes', severity: 'Critical' });
  }
  if (uniqueIps > 50 && attackLogs.length > 10) {
    detections.push({ rule: 'Multiple Source IP Floods', severity: 'Critical' });
  }
  if (attackLogs.some((l) => l.type === 'Botnet Attack')) {
    detections.push({ rule: 'Suspicious Patterns', severity: 'Critical' });
  }

  const attackDetected = detections.length > 0 || attackLogs.length > 0;
  const metrics = {
    totalRequests,
    blockedCount: blockedLogs.length,
    attackCount: attackLogs.length,
    uniqueIps,
    avgRequestsPerIp,
  };

  const threatScore = calculateThreatScore(metrics);
  const threatLevel = getThreatLevel(threatScore);

  return {
    status: attackDetected ? 'DDoS ATTACK DETECTED' : 'SAFE',
    attackDetected,
    threatLevel,
    threatScore,
    detections,
    metrics,
    ipAnalysis: Object.entries(ipCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ip, count]) => ({ ip, count })),
  };
};

export const createNotification = async (type, message, severity = 'Medium', io) => {
  const notification = await Notification.create({ type, message, severity });
  if (io) {
    io.emit('notification', notification);
  }
  return notification;
};

export const isIpBlocked = async (ip) => {
  const blocked = await BlockedIP.findOne({ ip });
  return !!blocked;
};

export const getDashboardStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalLogs, blockedLogs, attackLogs, blockedIps, users] = await Promise.all([
    TrafficLog.countDocuments(),
    TrafficLog.countDocuments({ status: 'Blocked' }),
    TrafficLog.countDocuments({ type: { $ne: 'Normal' } }),
    BlockedIP.countDocuments(),
    import('../models/User.js').then((m) => m.default.countDocuments()),
  ]);

  const recentLogs = await TrafficLog.find().sort({ timestamp: -1 }).limit(10).lean();
  const analysis = await analyzeTraffic(5);

  const hourlyData = await TrafficLog.aggregate([
    {
      $match: {
        timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    },
    {
      $group: {
        _id: { $hour: '$timestamp' },
        requests: { $sum: '$requests' },
        attacks: {
          $sum: { $cond: [{ $ne: ['$type', 'Normal'] }, 1, 0] },
        },
        blocked: {
          $sum: { $cond: [{ $eq: ['$status', 'Blocked'] }, 1, 0] },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    totalRequests: totalLogs,
    blockedRequests: blockedLogs,
    attackAttempts: attackLogs,
    activeUsers: users,
    blockedIps,
    threatLevel: analysis.threatLevel,
    threatScore: analysis.threatScore,
    status: analysis.status,
    recentActivity: recentLogs,
    hourlyData: hourlyData.map((h) => ({
      hour: `${h._id}:00`,
      requests: h.requests,
      attacks: h.attacks,
      blocked: h.blocked,
    })),
    analysis,
  };
};

export const getAnalytics = async () => {
  const logs = await TrafficLog.find().lean();
  const total = logs.length || 1;

  const endpointCounts = {};
  const ipCounts = {};
  let totalRequests = 0;
  let normalCount = 0;
  let suspiciousCount = 0;
  let blockedCount = 0;

  logs.forEach((l) => {
    totalRequests += l.requests;
    endpointCounts[l.endpoint] = (endpointCounts[l.endpoint] || 0) + l.requests;
    ipCounts[l.ip] = (ipCounts[l.ip] || 0) + l.requests;

    if (l.status === 'Blocked') blockedCount++;
    else if (l.type !== 'Normal') suspiciousCount++;
    else normalCount++;
  });

  const topEndpoint = Object.entries(endpointCounts).sort((a, b) => b[1] - a[1])[0];
  const topAttacker = Object.entries(ipCounts).sort((a, b) => b[1] - a[1])[0];

  const dailyAttacks = await TrafficLog.aggregate([
    { $match: { type: { $ne: 'Normal' } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 7 },
  ]);

  const trafficGrowth = await TrafficLog.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        requests: { $sum: '$requests' },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 14 },
  ]);

  const peakTraffic = Math.max(...logs.map((l) => l.requests), 0);
  const avgTraffic = totalRequests / total;

  return {
    mostTargetedEndpoint: topEndpoint ? { endpoint: topEndpoint[0], count: topEndpoint[1] } : null,
    mostFrequentAttacker: topAttacker ? { ip: topAttacker[0], count: topAttacker[1] } : null,
    averageTraffic: Math.round(avgTraffic),
    peakTraffic,
    detectionAccuracy: (() => {
      const attacks = logs.filter((l) => l.type !== 'Normal');
      return attacks.length
        ? Math.round((attacks.filter((l) => l.status !== 'Allowed').length / attacks.length) * 100)
        : 95;
    })(),
    trafficDistribution: {
      normal: normalCount,
      suspicious: suspiciousCount,
      blocked: blockedCount,
    },
    dailyAttacks: dailyAttacks.map((d) => ({ date: d._id, count: d.count })),
    trafficGrowth: trafficGrowth.map((t) => ({ date: t._id, requests: t.requests })),
    geolocation: await getGeolocationData(),
  };
};

const getGeolocationData = async () => {
  const logs = await TrafficLog.find({ type: { $ne: 'Normal' } }).lean();
  const countryMap = {};

  logs.forEach((l) => {
    countryMap[l.country] = (countryMap[l.country] || 0) + 1;
  });

  const coords = {
    'United States': { lat: 37.09, lng: -95.71 },
    China: { lat: 35.86, lng: 104.19 },
    Russia: { lat: 61.52, lng: 105.31 },
    India: { lat: 20.59, lng: 78.96 },
    Brazil: { lat: -14.23, lng: -51.92 },
    Germany: { lat: 51.16, lng: 10.45 },
    'United Kingdom': { lat: 55.37, lng: -3.43 },
    France: { lat: 46.22, lng: 2.21 },
    Japan: { lat: 36.20, lng: 138.25 },
    Australia: { lat: -25.27, lng: 133.77 },
    Canada: { lat: 56.13, lng: -106.34 },
    'South Korea': { lat: 35.90, lng: 127.76 },
    Netherlands: { lat: 52.13, lng: 5.29 },
    Singapore: { lat: 1.35, lng: 103.81 },
    Unknown: { lat: 0, lng: 0 },
  };

  return Object.entries(countryMap).map(([country, count]) => ({
    country,
    count,
    ...coords[country] || { lat: 0, lng: 0 },
  }));
};

export { THRESHOLDS };
