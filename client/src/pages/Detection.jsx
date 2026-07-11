import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaExclamationTriangle, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { detectionAPI } from '../services/api';
import getSocket from '../services/socket';
import ThreatScore from '../components/ThreatScore';

const threatColors = {
  Low: 'text-green-400 border-green-400/30 bg-green-400/10',
  Medium: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  High: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
  Critical: 'text-red-400 border-red-400/30 bg-red-400/10',
};

const rules = [
  'High Request Rate',
  'Same IP Repeated Requests',
  'Traffic Spikes',
  'Multiple Source IP Floods',
  'Suspicious Patterns',
];

const Detection = () => {
  const [analysis, setAnalysis] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

  const fetchAnalysis = async () => {
    try {
      const res = await detectionAPI.getStatus();
      setAnalysis(res.data);
    } catch {
      // ignore
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalysis();
    const interval = setInterval(fetchAnalysis, 5000);
    const socket = getSocket();

    socket.on('attack-detected', () => {
      fetchAnalysis();
      if (soundEnabled && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    });

    return () => {
      clearInterval(interval);
      socket.off('attack-detected');
    };
  }, [soundEnabled]);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await detectionAPI.analyze({ minutes: 5 });
      setAnalysis(res.data);
    } catch {
      // ignore
    }
    setLoading(false);
  };

  if (loading && !analysis) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-cyber-purple border-t-cyber-cyan rounded-full animate-spin" />
      </div>
    );
  }

  const isAttack = analysis?.attackDetected;

  return (
    <div className="page-container">
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77+efTRAMUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQUrgc7y2Yk2CBlou+/nn00QDFCn4/C2YxwGOJHX8sx5LAUkd8fw3ZBAC" type="audio/wav" />
      </audio>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">DDoS Detection Engine</h1>
          <p className="text-gray-400">Analyze traffic patterns and identify attacks in real-time</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-3 rounded-lg glass hover:bg-white/10"
            title="Toggle alert sound"
          >
            {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
          </button>
          <button onClick={handleAnalyze} className="btn-primary">
            Run Analysis
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={analysis?.status}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`neon-card rounded-xl p-8 mb-8 text-center border-2 ${
            isAttack ? 'border-red-500/50 animate-pulseGlow' : 'border-green-500/30'
          }`}
        >
          {isAttack ? (
            <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4 animate-pulse" />
          ) : (
            <FaShieldAlt className="text-6xl text-green-400 mx-auto mb-4" />
          )}
          <h2 className={`text-4xl font-extrabold mb-2 ${isAttack ? 'text-red-400' : 'text-green-400'}`}>
            {analysis?.status || 'SAFE'}
          </h2>
          <div className="flex justify-center mt-4">
            <ThreatScore score={analysis?.threatScore ?? 0} />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {['Low', 'Medium', 'High', 'Critical'].map((level) => (
          <div
            key={level}
            className={`rounded-xl p-4 border text-center ${
              analysis?.threatLevel === level ? threatColors[level] : 'border-gray-700 text-gray-500'
            }`}
          >
            <p className="font-bold">{level}</p>
            {analysis?.threatLevel === level && (
              <p className="text-xs mt-1">Current Level</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="neon-card rounded-xl p-6">
          <h3 className="font-bold mb-4">Detection Rules</h3>
          <ul className="space-y-3">
            {rules.map((rule) => {
              const triggered = analysis?.detections?.some((d) => d.rule === rule);
              return (
                <li
                  key={rule}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    triggered ? 'bg-red-500/10 border border-red-500/30' : 'bg-white/5'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${triggered ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                  <span className={triggered ? 'text-red-400' : 'text-gray-300'}>{rule}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="neon-card rounded-xl p-6">
          <h3 className="font-bold mb-4">Traffic Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Requests', value: analysis?.metrics?.totalRequests },
              { label: 'Blocked Count', value: analysis?.metrics?.blockedCount },
              { label: 'Attack Count', value: analysis?.metrics?.attackCount },
              { label: 'Unique IPs', value: analysis?.metrics?.uniqueIps },
            ].map((m) => (
              <div key={m.label} className="glass rounded-lg p-4">
                <p className="text-gray-400 text-sm">{m.label}</p>
                <p className="text-2xl font-bold text-cyber-cyan">{m.value ?? 0}</p>
              </div>
            ))}
          </div>

          {analysis?.ipAnalysis?.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Top IPs</h4>
              {analysis.ipAnalysis.slice(0, 5).map((ip) => (
                <div key={ip.ip} className="flex justify-between text-sm py-1 border-b border-gray-800">
                  <span className="mono">{ip.ip}</span>
                  <span className="text-cyber-cyan">{ip.count} req</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Detection;
