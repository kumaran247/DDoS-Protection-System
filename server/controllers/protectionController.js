import BlockedIP from '../models/BlockedIP.js';
import FirewallRule from '../models/FirewallRule.js';
import { createNotification } from '../services/detectionEngine.js';

export const getBlockedIps = async (req, res) => {
  try {
    const ips = await BlockedIP.find().sort({ blockedAt: -1 });
    res.json(ips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const blockIp = async (req, res) => {
  try {
    const { ip, reason = 'DDoS Attack' } = req.body;
    if (!ip) return res.status(400).json({ message: 'IP address required' });

    const existing = await BlockedIP.findOne({ ip });
    if (existing) return res.status(400).json({ message: 'IP already blocked' });

    const blocked = await BlockedIP.create({
      ip,
      reason,
      blockedBy: req.user?.name || 'Admin',
    });

    const io = req.app.get('io');
    await createNotification('IP Blocked', `IP ${ip} has been blocked: ${reason}`, 'High', io);

    res.status(201).json(blocked);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unblockIp = async (req, res) => {
  try {
    const { ip } = req.params;
    await BlockedIP.findOneAndDelete({ ip });
    res.json({ message: `IP ${ip} unblocked` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFirewallRules = async (req, res) => {
  try {
    const rules = await FirewallRule.find().sort({ createdAt: -1 });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addFirewallRule = async (req, res) => {
  try {
    const { type, value, description } = req.body;
    if (!type || !value) return res.status(400).json({ message: 'Type and value required' });

    const rule = await FirewallRule.create({
      type,
      value,
      description,
      createdBy: req.user?.name || 'Admin',
    });

    const io = req.app.get('io');
    await createNotification(
      'Firewall Updated',
      `New rule added: ${type} - ${value}`,
      'Medium',
      io
    );

    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFirewallRule = async (req, res) => {
  try {
    await FirewallRule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rule deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyCaptcha = (req, res) => {
  const { answer, expected } = req.body;
  const passed = String(answer).trim() === String(expected).trim();
  res.json({ passed, message: passed ? 'Verification successful' : 'Verification failed' });
};
