# DDoS Shield - Cloud DDoS Protection System

A full-stack cybersecurity web application demonstrating cloud DDoS detection, analysis, mitigation, and real-time monitoring.

## Tech Stack

**Frontend:** React, Tailwind CSS, Framer Motion, React Router, Chart.js, Recharts, Socket.io Client, jsPDF

**Backend:** Node.js, Express, MongoDB, JWT, Socket.io, Helmet, bcrypt

## Features

- Traffic simulation (Normal & DDoS attacks)
- DDoS detection engine with threat scoring
- Rate limiting, IP blocking, CAPTCHA, firewall rules
- Real-time SOC dashboard (Socket.io)
- Attack analytics with charts
- Interactive cloud architecture diagrams
- Admin panel with JWT + RBAC
- PDF & CSV report export
- Notification center with real-time alerts
- Geolocation attack map


## Demo Credentials

| Role   | Email              | Password   |
|--------|--------------------|------------|
| Admin  | admin@gmail.com    | admin123   |
| Viewer | viewer@gmail.com   | viewer123  |

## Project Structure

```
/DDoS
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API & Socket services
│   │   ├── context/       # React contexts
│   │   └── assets/        # Images, fonts
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── server/                # Express backend
    ├── controllers/       # Route handlers
    ├── models/           # MongoDB schemas
    ├── routes/           # API routes
    ├── middleware/       # Auth & security
    ├── services/         # Detection & simulation
    ├── utils/            # Helpers & seed
    ├── index.js
    ├── package.json
    └── .env
```

## API Endpoints

### Authentication
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| POST   | /api/auth/login             | User login               |
| POST   | /api/auth/register          | User registration        |
| GET    | /api/auth/profile           | Get user profile         |
| GET    | /api/auth/users             | List all users (admin)   |
| DELETE | /api/auth/users/:id         | Delete user (admin)      |

### Traffic Simulation
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| POST   | /api/traffic/normal         | Generate normal traffic  |
| POST   | /api/traffic/attack         | Generate DDoS traffic    |
| POST   | /api/traffic/stop           | Stop simulation          |
| GET    | /api/traffic/state          | Get simulation state     |
| GET    | /api/traffic/logs           | Get traffic logs         |
| GET    | /api/traffic/rate-limit     | Get rate limit stats     |
| DELETE | /api/traffic/logs           | Clear logs (admin)       |

### Detection
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | /api/detection/status       | Detection analysis       |
| POST   | /api/detection/analyze      | Run manual analysis      |

### Protection
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | /api/protection/blocked-ips | List blocked IPs         |
| POST   | /api/protection/block-ip    | Block IP (admin)         |
| DELETE | /api/protection/block-ip/:ip| Unblock IP (admin)      |
| GET    | /api/protection/firewall     | List firewall rules      |
| POST   | /api/protection/firewall     | Add rule (admin)         |
| DELETE | /api/protection/firewall/:id| Delete rule (admin)      |
| POST   | /api/protection/captcha     | Verify CAPTCHA           |

### Dashboard & Analytics
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | /api/dashboard              | Dashboard statistics     |
| GET    | /api/analytics              | Analytics data           |

### Reports
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | /api/reports/data           | Report data              |
| GET    | /api/reports/csv            | CSV export               |
| GET    | /api/reports/notifications  | Get notifications        |
| PATCH  | /api/reports/notifications/:id/read | Mark read |
| DELETE | /api/reports/notifications  | Clear notifications (admin) |

## Features Overview

### 1. Traffic Simulator
- Simulate normal and DDoS traffic
- Multiple attack types: HTTP Flood, SYN Flood, UDP Flood, Botnet Attack
- Configurable request rate and volume
- Real-time traffic logs

### 2. DDoS Detection Engine
- Multi-rule detection system
- Threat level calculation (Low, Medium, High, Critical)
- AI-based threat scoring (0-100)
- Real-time attack alerts with sound option

### 3. Protection Mechanisms
- Rate limiting (100 requests/minute)
- IP blocking system
- Firewall rules (IP, Country, User Agent blocks)
- CAPTCHA verification simulation

### 4. Real-Time Dashboard
- Live statistics via Socket.io
- Traffic, attack, and blocked graphs
- Recent activity table
- Threat level indicators

### 5. Attack Analytics
- Traffic distribution charts
- Daily attack trends
- Traffic growth analysis
- Geolocation attack map

### 6. Cloud Architecture
- Interactive architecture diagram
- Component explanations
- Security roles and advantages
- Visual flow representation

### 7. Admin Panel
- JWT authentication
- Role-based access control (Admin/Viewer)
- User management
- System actions

### 8. Reports
- PDF export with jsPDF
- CSV export for data analysis
- Comprehensive threat summaries
- Detection history

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `server/.env`
- Verify MongoDB is accessible on the specified port

### Port Already in Use
- Change PORT in `server/.env`
- Change port in `client/vite.config.js`

### Socket.io Connection Issues
- Check VITE_SOCKET_URL in `client/.env`
- Verify CORS settings in `server/index.js`
- Ensure both servers are running

### Build Errors
- Clear node_modules: `rm -rf node_modules package-lock.json`
- Reinstall dependencies: `npm install`
- Check Node.js version (requires 18+)

## License

MIT — For educational and demonstration purposes.
## Author

kumaran

