import { analyzeTraffic } from '../services/detectionEngine.js';

export const getDetectionStatus = async (req, res) => {
  try {
    const analysis = await analyzeTraffic(5);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const runDetection = async (req, res) => {
  try {
    const { minutes = 5 } = req.body;
    const analysis = await analyzeTraffic(minutes);
    const io = req.app.get('io');

    if (analysis.attackDetected && io) {
      io.emit('attack-detected', analysis);
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
