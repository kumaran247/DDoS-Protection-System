import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell } from 'react-icons/fa';
import { useNotifications } from '../context/NotificationContext';

const severityClass = {
  Low: 'severity-low',
  Medium: 'severity-medium',
  High: 'severity-high',
  Critical: 'severity-critical',
};

const NotificationCenter = () => {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markRead } = useNotifications();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <FaBell className="text-lg" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto glass rounded-xl border border-cyber-purple/30 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="p-4 border-b border-gray-700">
              <h4 className="font-semibold">Notifications</h4>
            </div>
            {notifications.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm">No notifications</p>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <div
                  key={n._id}
                  className={`p-3 border-b border-gray-800 cursor-pointer hover:bg-white/5 ${!n.read ? 'bg-cyber-purple/10' : ''}`}
                  onClick={() => markRead(n._id)}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-sm font-medium">{n.type}</span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${severityClass[n.severity]}`}>
                      {n.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{n.message}</p>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
