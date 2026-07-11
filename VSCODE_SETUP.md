# Running DDoS Protection System in VS Code

## Prerequisites
- VS Code installed
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account
- Git installed (optional, for cloning)

## Step 1: Open Project in VS Code

### Option A: If you have the project folder
1. Open VS Code
2. File → Open Folder
3. Select the `DDoS` folder

### Option B: If cloning from Git
1. Open VS Code
2. View → Command Palette (Ctrl+Shift+P)
3. Type "Git: Clone"
4. Paste repository URL
5. Select destination folder
6. File → Open Folder (select the cloned folder)

## Step 2: Install Recommended Extensions

Open VS Code and install these extensions for the best experience:

1. **ESLint** - Code linting
   - Extension ID: `dbaeumer.vscode-eslint`

2. **Prettier** - Code formatting
   - Extension ID: `esbenp.prettier-vscode`

3. **MongoDB for VS Code** - Database management
   - Extension ID: `mongodb.mongodb-vscode`

4. **Live Server** - For testing static files (optional)
   - Extension ID: `ritwickdey.liveserver`

5. **Thunder Client** - For API testing (optional)
   - Extension ID: `ranga.vscode-thunder-client`

## Step 3: Configure Environment Variables

### Server Configuration
1. Open `server/.env.example`
2. Copy all content
3. Create new file `server/.env`
4. Paste the content and edit:

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

### Client Configuration
1. Open `client/.env.example`
2. Copy all content
3. Create new file `client/.env`
4. Paste the content:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## Step 4: Install Dependencies

### Using VS Code Integrated Terminal

1. Open terminal in VS Code: View → Terminal (Ctrl+`)
2. Install root dependencies:
   ```bash
   npm install
   ```

3. Install server dependencies:
   ```bash
   cd server
   npm install
   cd ..
   ```

4. Install client dependencies:
   ```bash
   cd client
   npm install
   cd ..
   ```

**Or use the convenience script:**
```bash
npm run install:all
```

## Step 5: Start MongoDB

### Option A: Local MongoDB
1. Open a new terminal in VS Code
2. Start MongoDB:
   ```bash
   mongod
   ```
   Or if MongoDB is a Windows service:
   ```bash
   net start MongoDB
   ```

### Option B: MongoDB Atlas
1. No local installation needed
2. Just ensure your connection string in `server/.env` is correct

### Option C: Using MongoDB for VS Code Extension
1. Click the MongoDB icon in left sidebar
2. Click "Connect to MongoDB"
3. Enter your connection string
4. This will also allow you to view/manage your database

## Step 6: Seed Database (Optional but Recommended)

1. In VS Code terminal, navigate to server:
   ```bash
   cd server
   ```

2. Run seed script:
   ```bash
   npm run seed
   ```

This creates demo users and sample data:
- Admin: admin@gmail.com / admin123
- Viewer: viewer@gmail.com / viewer123

## Step 7: Run the Application

### Method A: Using npm scripts (Recommended)

1. Open terminal in VS Code (ensure you're in root DDoS folder)
2. Run both servers:
   ```bash
   npm run dev
   ```

This starts:
- Backend server on http://localhost:5000
- Frontend dev server on http://localhost:5173

### Method B: Using Multiple Terminals

1. Open terminal for backend:
   ```bash
   cd server
   npm run dev
   ```

2. Open new terminal (Ctrl+Shift+`) for frontend:
   ```bash
   cd client
   npm run dev
   ```

### Method C: Using VS Code Tasks

1. Create `.vscode/tasks.json` in project root:
   ```json
   {
     "version": "2.0.0",
     "tasks": [
       {
         "label": "Start Backend",
         "type": "shell",
         "command": "cd server && npm run dev",
         "group": "build",
         "isBackground": true,
         "problemMatcher": []
       },
       {
         "label": "Start Frontend",
         "type": "shell",
         "command": "cd client && npm run dev",
         "group": "build",
         "isBackground": true,
         "problemMatcher": []
       },
       {
         "label": "Start All",
         "dependsOn": ["Start Backend", "Start Frontend"],
         "group": {
           "kind": "build",
           "isDefault": true
         }
       }
     ]
   }
   ```

2. Run tasks: Terminal → Run Task → "Start All"

## Step 8: Access the Application

1. Open browser and go to: http://localhost:5173
2. Login with admin credentials:
   - Email: admin@gmail.com
   - Password: admin123

## VS Code Tips for This Project

### Debugging Backend
1. Set breakpoints in server code
2. Press F5 or click Run and Debug
3. Create `.vscode/launch.json`:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "node",
         "request": "launch",
         "name": "Debug Server",
         "program": "${workspaceFolder}/server/index.js",
         "env": {
           "NODE_ENV": "development"
         }
       }
     ]
   }
   ```

### Debugging Frontend
1. Open Chrome DevTools in browser
2. Use VS Code debugger for React:
   - Install "Debugger for Chrome" extension
   - Create launch config for Chrome

### View Database in VS Code
1. Install "MongoDB for VS Code" extension
2. Click MongoDB icon in sidebar
3. Connect to your database
4. View collections: users, trafficlogs, blockedips, firewallrules, notifications

### Code Formatting
1. Install Prettier extension
2. Create `.prettierrc` in root:
   ```json
   {
     "semi": true,
     "singleQuote": true,
     "tabWidth": 2,
     "trailingComma": "es5"
   }
   ```

3. Format on save: Settings → Format On Save → Check

### Split Terminal Layout
1. View → Terminal
2. Click the split terminal icon (top right of terminal panel)
3. Run backend in one, frontend in another

## Common VS Code Issues

### Terminal not showing
- View → Terminal (Ctrl+`)
- Check if terminal is collapsed

### Port already in use
- Change PORT in `server/.env`
- Update `client/.env` and `client/vite.config.js`

### Auto-complete not working
- Install ESLint and Prettier extensions
- Reload VS Code (Ctrl+Shift+P → "Developer: Reload Window")

### Hot reload not working
- Ensure you're using `npm run dev` (not `npm start`)
- Check file watchers are enabled in VS Code settings

## Quick Reference Commands

```bash
# Install all dependencies
npm run install:all

# Start both servers
npm run dev

# Start server only
npm run server

# Start client only
npm run client

# Seed database
cd server && npm run seed

# Clear node_modules (if needed)
rm -rf node_modules package-lock.json
```

## Next Steps

Once running:
1. Explore all 9 pages
2. Test traffic simulation
3. Monitor real-time dashboard
4. Generate reports
5. Customize as needed

## Support

If you encounter issues:
1. Check terminal output for errors
2. Verify MongoDB is running
3. Check environment variables
4. Review SETUP_GUIDE.md for troubleshooting
