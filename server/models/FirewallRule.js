import mongoose from 'mongoose';

const firewallRuleSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['IP Block', 'Country Block', 'User Agent Block'],
      required: true,
    },
    value: { type: String, required: true },
    description: { type: String, default: '' },
    active: { type: Boolean, default: true },
    createdBy: { type: String, default: 'Admin' },
  },
  { timestamps: true }
);

export default mongoose.model('FirewallRule', firewallRuleSchema);
