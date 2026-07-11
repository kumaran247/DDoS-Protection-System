import mongoose from 'mongoose';

const blockedIpSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true, unique: true },
    reason: { type: String, default: 'DDoS Attack' },
    blockedBy: { type: String, default: 'System' },
    blockedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('BlockedIP', blockedIpSchema);
