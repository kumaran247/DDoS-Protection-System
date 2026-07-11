import { motion } from 'framer-motion';

const ThreatScore = ({ score = 0, size = 120 }) => {
  const getColor = (s) => {
    if (s >= 80) return '#EF4444';
    if (s >= 60) return '#F97316';
    if (s >= 30) return '#EAB308';
    return '#22C55E';
  };

  const color = getColor(score);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>{score}</span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-2">AI Threat Score</p>
    </div>
  );
};

export default ThreatScore;
