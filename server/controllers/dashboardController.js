import { getDashboardStats } from '../services/detectionEngine.js';

export const getDashboard = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
