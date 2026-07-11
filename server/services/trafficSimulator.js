import TrafficLog from '../models/TrafficLog.js';
import BlockedIP from '../models/BlockedIP.js';
import FirewallRule from '../models/FirewallRule.js';
import {
  randomIp,
  randomCountry,
  randomEndpoint,
  randomUserAgent,
  mapAttackType,
} from '../utils/helpers.js';
import { isIpBlocked, createNotification } from './detectionEngine.js';

let simulationInterval = null;
let simulationState = {
  running: false,
  requestCount: 0,
  status: 'Idle',
  logs: [],
};

export const getSimulationState = () => simulationState;

export const stopSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
  simulationState.running = false;
  simulationState.status = 'Stopped';
  return simulationState;
};

const checkFirewall = async (ip, userAgent, country) => {
  const rules = await FirewallRule.find({ active: true }).lean();

  for (const rule of rules) {
    if (rule.type === 'IP Block' && rule.value === ip) return true;
    if (rule.type === 'Country Block' && rule.value === country) return true;
    if (rule.type === 'User Agent Block' && userAgent.includes(rule.value)) return true;
  }

  return await isIpBlocked(ip);
};

export const generateTrafficBatch = async (options, io) => {
  const {
    numRequests,
    requestRate,
    sourceIp,
    attackType = 'Normal Traffic',
    isAttack = false,
  } = options;

  const logs = [];
  const ip = sourceIp || randomIp();
  const type = isAttack ? mapAttackType(attackType) : 'Normal';
  const country = randomCountry();
  const userAgent = isAttack ? 'Bot/1.0 (compatible; AttackBot)' : randomUserAgent();

  for (let i = 0; i < numRequests; i++) {
    const currentIp = isAttack && attackType === 'Botnet Attack' ? randomIp() : ip;
    const blocked = await checkFirewall(currentIp, userAgent, country);

    const log = {
      ip: currentIp,
      requests: isAttack ? Math.floor(Math.random() * 50) + 10 : Math.floor(Math.random() * 5) + 1,
      type,
      attackType,
      endpoint: randomEndpoint(),
      userAgent,
      country,
      status: blocked ? 'Blocked' : isAttack ? 'Suspicious' : 'Allowed',
      threatLevel: isAttack ? (attackType === 'Botnet Attack' ? 'Critical' : 'High') : 'Low',
      timestamp: new Date(),
    };

    logs.push(log);
  }

  const saved = await TrafficLog.insertMany(logs);
  simulationState.requestCount += logs.reduce((s, l) => s + l.requests, 0);
  simulationState.logs = [...saved.slice(-20).reverse(), ...simulationState.logs].slice(0, 50);

  if (io) {
    io.emit('traffic-update', {
      logs: saved,
      totalRequests: simulationState.requestCount,
      status: simulationState.status,
    });

    if (isAttack) {
      await createNotification(
        'Attack Detected',
        `${attackType} detected from ${ip} - ${numRequests} requests`,
        'Critical',
        io
      );
      io.emit('attack-detected', { attackType, ip, count: numRequests });
    }
  }

  return saved;
};

export const startSimulation = async (options, io) => {
  stopSimulation();

  const { requestRate = 50, attackType = 'Normal Traffic', isAttack = false, sourceIp } = options;

  simulationState = {
    running: true,
    requestCount: 0,
    status: isAttack ? `Simulating ${attackType}` : 'Normal Traffic',
    logs: [],
  };

  const batchSize = Math.min(Math.max(Math.floor(requestRate / 10), 1), 20);
  const intervalMs = Math.max(1000 / (requestRate / batchSize), 50);

  simulationInterval = setInterval(async () => {
    if (!simulationState.running) return;
    await generateTrafficBatch(
      {
        numRequests: batchSize,
        requestRate,
        sourceIp,
        attackType,
        isAttack,
      },
      io
    );
  }, intervalMs);

  return simulationState;
};

export const getRateLimitStats = async () => {
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const recentLogs = await TrafficLog.find({ timestamp: { $gte: oneMinuteAgo } }).lean();

  const allowed = recentLogs.filter((l) => l.status === 'Allowed').length;
  const blocked = recentLogs.filter((l) => l.status === 'Blocked').length;
  const limit = 100;

  return {
    limit,
    allowed: Math.min(allowed, limit),
    blocked,
    remaining: Math.max(limit - allowed, 0),
  };
};

export default {
  startSimulation,
  stopSimulation,
  generateTrafficBatch,
  getSimulationState,
  getRateLimitStats,
};
