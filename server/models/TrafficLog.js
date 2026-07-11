import mongoose from 'mongoose';

const trafficLogSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true },
    requests: { type: Number, default: 1 },
    type: {
      type: String,
      enum: ['Normal', 'DDoS', 'HTTP Flood', 'SYN Flood', 'UDP Flood', 'Botnet Attack', 'Suspicious'],
      default: 'Normal',
    },
    attackType: { type: String, default: 'Normal Traffic' },
    endpoint: { type: String, default: '/api/health' },
    userAgent: { type: String, default: 'Mozilla/5.0' },
    country: { type: String, default: 'Unknown' },
    status: { type: String, enum: ['Allowed', 'Blocked', 'Suspicious'], default: 'Allowed' },
    threatLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Low' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('TrafficLog', trafficLogSchema);
