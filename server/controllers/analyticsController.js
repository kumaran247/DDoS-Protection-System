import { getAnalytics } from '../services/detectionEngine.js';

export const getAnalyticsData = async (req, res) => {
  try {
    const analytics = await getAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
