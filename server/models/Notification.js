import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Attack Detected', 'IP Blocked', 'Firewall Updated', 'Traffic Spike', 'System Alert'],
      required: true,
    },
    message: { type: String, required: true },
    severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
