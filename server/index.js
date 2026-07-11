import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import trafficRoutes from './routes/trafficRoutes.js';
import detectionRoutes from './routes/detectionRoutes.js';
import protectionRoutes from './routes/protectionRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { getDashboardStats } from './services/detectionEngine.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DDoS Protection System API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/traffic', trafficRoutes);
app.use('/api/detection', detectionRoutes);
app.use('/api/protection', protectionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportRoutes);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('subscribe-dashboard', async () => {
    try {
      const stats = await getDashboardStats();
      socket.emit('dashboard-update', stats);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

setInterval(async () => {
  try {
    const stats = await getDashboardStats();
    io.emit('dashboard-update', stats);
  } catch {
    // ignore polling errors when DB unavailable
  }
}, 5000);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (without MongoDB)`);
    });
  });

export default app;
