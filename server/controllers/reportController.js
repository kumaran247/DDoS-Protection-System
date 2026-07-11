import TrafficLog from '../models/TrafficLog.js';
import BlockedIP from '../models/BlockedIP.js';
import Notification from '../models/Notification.js';
import { analyzeTraffic } from '../services/detectionEngine.js';

export const getReportData = async (req, res) => {
  try {
    const analysis = await analyzeTraffic(60 * 24);
    const totalRequests = await TrafficLog.countDocuments();
    const attackCount = await TrafficLog.countDocuments({ type: { $ne: 'Normal' } });
    const blockedRequests = await TrafficLog.countDocuments({ status: 'Blocked' });
    const peakLog = await TrafficLog.findOne().sort({ requests: -1 }).lean();

    const report = {
      generatedAt: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      totalRequests,
      attackCount,
      blockedRequests,
      peakTraffic: peakLog?.requests || 0,
      threatSummary: {
        level: analysis.threatLevel,
        score: analysis.threatScore,
        status: analysis.status,
        detections: analysis.detections,
      },
      blockedIps: await BlockedIP.countDocuments(),
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCsvReport = async (req, res) => {
  try {
    const logs = await TrafficLog.find().sort({ timestamp: -1 }).limit(1000).lean();

    const headers = 'Timestamp,IP,Requests,Type,Status,Threat Level,Country,Endpoint\n';
    const rows = logs
      .map(
        (l) =>
          `${new Date(l.timestamp).toISOString()},${l.ip},${l.requests},${l.type},${l.status},${l.threatLevel},${l.country},${l.endpoint}`
      )
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=ddos-report.csv');
    res.send(headers + rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({});
    res.json({ message: 'Notifications cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
