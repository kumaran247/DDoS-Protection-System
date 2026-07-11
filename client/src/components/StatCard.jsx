import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color = 'purple', subtitle }) => {
  const colors = {
    purple: 'from-cyber-purple/20 to-cyber-purple/5 border-cyber-purple/30',
    cyan: 'from-cyber-cyan/20 to-cyber-cyan/5 border-cyber-cyan/30',
    green: 'from-green-500/20 to-green-500/5 border-green-500/30',
    red: 'from-red-500/20 to-red-500/5 border-red-500/30',
    orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/30',
  };

  return (
    <motion.div
      className={`neon-card rounded-xl p-5 bg-gradient-to-br ${colors[color]} border`}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-2xl md:text-3xl font-bold">{value ?? '—'}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="p-3 rounded-lg bg-white/5">
            <Icon className="text-xl text-cyber-cyan" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
