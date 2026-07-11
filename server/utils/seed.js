import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import TrafficLog from '../models/TrafficLog.js';
import BlockedIP from '../models/BlockedIP.js';
import FirewallRule from '../models/FirewallRule.js';
import Notification from '../models/Notification.js';
import { randomIp, randomCountry, randomEndpoint } from './helpers.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Promise.all([
      User.deleteMany({}),
      TrafficLog.deleteMany({}),
      BlockedIP.deleteMany({}),
      FirewallRule.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    const adminPassword = await bcrypt.hash('admin123', 12);
    const viewerPassword = await bcrypt.hash('viewer123', 12);

    await User.create([
      { name: 'Admin', email: 'admin@gmail.com', password: adminPassword, role: 'admin' },
      { name: 'Viewer', email: 'viewer@gmail.com', password: viewerPassword, role: 'viewer' },
    ]);

    const trafficLogs = [];
    for (let i = 0; i < 100; i++) {
      const isAttack = Math.random() > 0.7;
      trafficLogs.push({
        ip: randomIp(),
        requests: Math.floor(Math.random() * 100) + 1,
        type: isAttack ? ['HTTP Flood', 'SYN Flood', 'UDP Flood', 'Botnet Attack'][Math.floor(Math.random() * 4)] : 'Normal',
        attackType: isAttack ? 'HTTP Flood' : 'Normal Traffic',
        endpoint: randomEndpoint(),
        country: randomCountry(),
        status: isAttack ? (Math.random() > 0.5 ? 'Blocked' : 'Suspicious') : 'Allowed',
        threatLevel: isAttack ? 'High' : 'Low',
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      });
    }
    await TrafficLog.insertMany(trafficLogs);

    await BlockedIP.create([
      { ip: '192.168.1.100', reason: 'DDoS Attack', blockedBy: 'System' },
      { ip: '10.0.0.55', reason: 'HTTP Flood', blockedBy: 'Admin' },
    ]);

    await FirewallRule.create([
      { type: 'IP Block', value: '192.168.1.100', description: 'Known attacker' },
      { type: 'Country Block', value: 'Unknown', description: 'Block unknown regions' },
      { type: 'User Agent Block', value: 'AttackBot', description: 'Block bot user agents' },
    ]);

    await Notification.create([
      { type: 'Attack Detected', message: 'HTTP Flood detected from 203.0.113.45', severity: 'Critical' },
      { type: 'IP Blocked', message: 'IP 192.168.1.100 blocked due to DDoS', severity: 'High' },
      { type: 'Firewall Updated', message: 'New country block rule added', severity: 'Medium' },
    ]);

    console.log('Seed completed successfully!');
    console.log('Admin: admin@gmail.com / admin123');
    console.log('Viewer: viewer@gmail.com / viewer123');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
