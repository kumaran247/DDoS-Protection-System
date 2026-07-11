import { motion } from 'framer-motion';
import { FaCloud } from 'react-icons/fa';

const CloudAnimation = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute text-cyber-purple/30"
          style={{
            top: `${20 + i * 30}%`,
            left: `${10 + i * 25}%`,
            fontSize: `${3 + i}rem`,
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -15, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <FaCloud />
        </motion.div>
      ))}
    </div>
  );
};

export default CloudAnimation;
