# DDoS Protection System - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas connection string
- Git (for cloning)

### Step 1: Clone and Navigate
```bash
git clone <repository-url>
cd DDoS
```

### Step 2: Install Dependencies
```bash
# Install all dependencies at once
npm run install:all

# Or install separately
npm install
cd server && npm install
cd ../client && npm install
```

### Step 3: Configure Environment Variables

#### Server Configuration
Copy `server/.env.example` to `server/.env`:
```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your settings:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ddos_protection
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ddos_protection
```

#### Client Configuration
Copy `client/.env.example` to `client/.env`:
```bash
cd ../client
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Step 4: Start MongoDB

#### Local MongoDB
```bash
# Windows (if installed as service)
net start MongoDB

# Or run directly
mongod
```

#### MongoDB Atlas
No local installation needed - just use your connection string in `.env`

### Step 5: Seed Database (Optional)
```bash
cd ../server
npm run seed
```

This creates:
- Admin user: admin@gmail.com / admin123
- Viewer user: viewer@gmail.com / viewer123
- Sample traffic logs
- Sample blocked IPs
- Sample firewall rules

### Step 6: Run the Application

#### Development Mode (Both Servers)
```bash
cd ..
npm run dev
```

This starts:
- Backend server on http://localhost:5000
- Frontend dev server on http://localhost:5173

#### Individual Servers
```bash
# Backend only
npm run server

# Frontend only
npm run client
```

### Step 7: Access the Application
- Open http://localhost:5173 in your browser
- Login with admin credentials
- Explore all features

## Verification

### Check Backend Health
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "DDoS Protection System API"
}
```

### Check Frontend
- Navigate to http://localhost:5173
- Should see the home page with animated cloud graphics
- All navigation links should work

## Common Issues and Solutions

### Issue: MongoDB Connection Failed
**Solution:**
- Ensure MongoDB is running: `mongod` or `net start MongoDB`
- Check connection string in `server/.env`
- Verify MongoDB port (default 27017) is not blocked

### Issue: Port Already in Use
**Solution:**
- Change PORT in `server/.env` (e.g., PORT=5001)
- Update `client/.env` with new port
- Update `client/vite.config.js` proxy target

### Issue: Socket.io Connection Failed
**Solution:**
- Verify VITE_SOCKET_URL in `client/.env`
- Check CORS settings in `server/index.js`
- Ensure both servers are running

### Issue: Module Not Found
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build Failed
**Solution:**
- Check Node.js version: `node --version` (should be 18+)
- Clear cache: `npm cache clean --force`
- Reinstall dependencies

## Production Deployment

### Backend Deployment

#### Environment Variables
Set these in your hosting environment:
```env
PORT=5000
MONGODB_URI=<your-production-mongodb-uri>
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=<your-frontend-url>
NODE_ENV=production
```

#### Build and Start
```bash
cd server
npm install
npm start
```

### Frontend Deployment

#### Build
```bash
cd client
npm install
npm run build
```

#### Deploy
Upload the `dist` folder to your hosting provider (Vercel, Netlify, etc.)

#### Environment Variables
```env
VITE_API_URL=<your-backend-url>
VITE_SOCKET_URL=<your-backend-url>
```

## Development Tips

### Hot Reload
- Both servers support hot reload in development
- Changes to React components auto-refresh
- Backend changes with `--watch` flag auto-restart

### Debugging
- Backend logs show in terminal
- Use browser DevTools for frontend debugging
- Check Network tab for API calls
- Console shows Socket.io connection status

### Testing Features
1. **Traffic Simulator**: Generate normal traffic first, then DDoS attacks
2. **Detection Engine**: Watch threat score change with attacks
3. **Protection**: Block IPs, add firewall rules
4. **Dashboard**: Monitor real-time updates via Socket.io
5. **Analytics**: View charts after generating traffic
6. **Reports**: Export PDF/CSV with collected data
7. **Admin**: Manage users and system settings

## Security Best Practices

### For Production
1. Change JWT_SECRET to a strong random string
2. Use HTTPS for all connections
3. Enable MongoDB authentication
4. Use environment-specific configurations
5. Implement rate limiting on production
6. Regular security audits
7. Keep dependencies updated

### Database Security
- Use strong MongoDB passwords
- Enable IP whitelisting if possible
- Regular backups
- Monitor for unusual activity

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the main README.md
3. Check API documentation in code comments
4. Verify environment variables are set correctly

## Next Steps

After successful setup:
1. Explore all 9 pages of the application
2. Test traffic simulation with different attack types
3. Configure firewall rules and IP blocking
4. Generate and export reports
5. Review the codebase for customization
6. Consider adding additional features per requirements
