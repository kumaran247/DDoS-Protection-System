import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const ArchitectureFlow = ({ components, title = 'Architecture Flow' }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="neon-card rounded-xl p-6 md:p-8">
      <h3 className="text-2xl font-bold mb-10 text-center" style={{
        background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
      }}>{title}</h3>
      <div className="flex flex-col items-center gap-3">
        {components.map((comp, index) => (
          <div key={comp.name} className="flex flex-col items-center w-full max-w-lg">
            <motion.button
              onClick={() => setSelected(comp)}
              className="w-full rounded-xl p-5 text-left cursor-pointer transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid transparent',
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.04)), linear-gradient(135deg, rgba(0, 255, 255, 0.3), rgba(124, 58, 237, 0.3))',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                boxShadow: '0 0 12px rgba(0, 255, 255, 0.08)',
              }}
              whileHover={{
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.15)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(0, 255, 255, 0.1)' }}>
                  <comp.icon className="text-3xl text-cyber-cyan" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-white text-lg block">{comp.name}</span>
                  <span className="text-gray-400 text-sm">{comp.purpose?.substring(0, 60)}...</span>
                </div>
              </div>
            </motion.button>
            {index < components.length - 1 && (
              <div className="flex flex-col items-center py-2">
                <motion.div 
                  className="w-0.5 h-8"
                  style={{
                    background: 'linear-gradient(to bottom, #06b6d4, #7c3aed)',
                    opacity: 0.6
                  }}
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
                <motion.span 
                  className="text-cyber-cyan text-xl"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    transform: ['translateY(0)', 'translateY(3px)', 'translateY(0)']
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  ↓
                </motion.span>
              </div>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="rounded-2xl p-8 max-w-lg w-full relative overflow-hidden"
              style={{
                background: 'rgba(10, 15, 30, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid transparent',
                backgroundImage: 'linear-gradient(rgba(10, 15, 30, 0.95), rgba(10, 15, 30, 0.95)), linear-gradient(135deg, rgba(0, 255, 255, 0.4), rgba(124, 58, 237, 0.4))',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1" style={{
                background: 'linear-gradient(to bottom, #06b6d4, #7c3aed)'
              }} />
              <div className="flex justify-between items-start mb-6 pl-4">
                <h4 className="text-2xl font-bold" style={{
                  background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>{selected.name}</h4>
                <button 
                  onClick={() => setSelected(null)} 
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <p className="text-gray-300 mb-4 pl-4 leading-relaxed">{selected.purpose}</p>
              {selected.securityRole && (
                <div className="mb-4 pl-4">
                  <span className="text-cyber-cyan text-sm font-semibold block mb-2">Security Role:</span>
                  <p className="text-gray-400 text-sm leading-relaxed">{selected.securityRole}</p>
                </div>
              )}
              {selected.advantages && (
                <div className="pl-4">
                  <span className="text-cyber-cyan text-sm font-semibold block mb-2">Advantages:</span>
                  <ul className="text-gray-400 text-sm leading-relaxed list-disc list-inside space-y-1">
                    {selected.advantages.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArchitectureFlow;
