import TrafficLog from '../models/TrafficLog.js';
import {
  startSimulation,
  stopSimulation,
  generateTrafficBatch,
  getSimulationState,
  getRateLimitStats,
} from '../services/trafficSimulator.js';

export const simulateNormal = async (req, res) => {
  try {
    const { requestRate, numRequests, sourceIp } = req.body;
    const io = req.app.get('io');

    if (numRequests) {
      const logs = await generateTrafficBatch(
        { numRequests, requestRate, sourceIp, attackType: 'Normal Traffic', isAttack: false },
        io
      );
      return res.json({ message: 'Normal traffic generated', logs, state: getSimulationState() });
    }

    const state = await startSimulation(
      { requestRate, sourceIp, attackType: 'Normal Traffic', isAttack: false },
      io
    );
    res.json({ message: 'Normal traffic simulation started', state });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const simulateAttack = async (req, res) => {
  try {
    const { requestRate, numRequests, sourceIp, attackType = 'HTTP Flood' } = req.body;
    const io = req.app.get('io');

    if (numRequests) {
      const logs = await generateTrafficBatch(
        { numRequests, requestRate, sourceIp, attackType, isAttack: true },
        io
      );
      return res.json({ message: 'Attack traffic generated', logs, state: getSimulationState() });
    }

    const state = await startSimulation(
      { requestRate, sourceIp, attackType, isAttack: true },
      io
    );
    res.json({ message: 'DDoS simulation started', state });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const stopTraffic = (req, res) => {
  const state = stopSimulation();
  res.json({ message: 'Simulation stopped', state });
};

export const getTrafficState = (req, res) => {
  res.json(getSimulationState());
};

export const getTrafficLogs = async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const logs = await TrafficLog.find()
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    const total = await TrafficLog.countDocuments();
    res.json({ logs, total, state: getSimulationState() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRateLimit = async (req, res) => {
  try {
    const stats = await getRateLimitStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTrafficLogs = async (req, res) => {
  try {
    await TrafficLog.deleteMany({});
    res.json({ message: 'Traffic logs cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
