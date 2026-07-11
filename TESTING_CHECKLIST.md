# DDoS Shield - Testing Checklist

## Pre-Run Checklist
- [ ] MongoDB is running (mongod or net start MongoDB)
- [ ] Server .env file is configured
- [ ] Client .env file is configured
- [ ] All dependencies installed (npm run install:all)
- [ ] Database seeded with demo data (npm run seed)

## Application Startup
- [ ] Backend server starts on http://localhost:5000
- [ ] Frontend dev server starts on http://localhost:5173
- [ ] No console errors in backend terminal
- [ ] No console errors in browser console
- [ ] Socket.io connection established (check browser network tab)

## Page Navigation Tests

### 1. Home Page
- [ ] Page loads without errors
- [ ] "DDoS Shield" branding displays correctly with gradient
- [ ] Hero section with shield icon animates
- [ ] "Open Dashboard" button navigates to /dashboard
- [ ] "Simulate Traffic" button navigates to /simulator
- [ ] Core Features section displays 5 cards with new content
- [ ] Subtitles display correctly under each feature title
- [ ] About DDoS section displays 3 cards with new content
- [ ] Architecture Preview displays correctly
- [ ] All animations play smoothly

### 2. Traffic Simulator Page
- [ ] Page loads without errors
- [ ] Simulation controls display (request count, rate, source IP, attack type)
- [ ] "Start Normal Traffic" button works
- [ ] "Start DDoS Attack" button works
- [ ] "Stop Simulation" button works
- [ ] Live request count updates in real-time
- [ ] Status indicator shows current state
- [ ] Traffic logs table updates with new entries
- [ ] Socket.io events received (check console)
- [ ] Attack type selector works (HTTP Flood, SYN Flood, UDP Flood, Botnet)

### 3. Detection Page
- [ ] Page loads without errors
- [ ] Detection status displays correctly
- [ ] Threat score gauge displays (0-100)
- [ ] Threat level indicator shows correct color (Low/Medium/High/Critical)
- [ ] Rules triggered list displays
- [ ] IP analysis section shows data
- [ ] Alert sound toggle works
- [ ] "Run Detection" button works
- [ ] Real-time attack detection updates via Socket.io

### 4. Protection Page
- [ ] Page loads without errors
- [ ] Rate limiting stats display
- [ ] CAPTCHA verification section displays
- [ ] Blocked IPs list shows entries
- [ ] "Block IP" form works (admin only)
- [ ] "Unblock" button works (admin only)
- [ ] Firewall rules list displays
- [ ] "Add Rule" form works (admin only)
- [ ] "Delete Rule" button works (admin only)

### 5. Dashboard Page
- [ ] Page loads without errors
- [ ] Stat cards display (Total Requests, Attacks, Blocked, Threat Level)
- [ ] Traffic chart displays with data
- [ ] Attack chart displays with data
- [ ] Blocked traffic chart displays with data
- [ ] Recent activity table updates
- [ ] Real-time updates via Socket.io
- [ ] Charts animate and update

### 6. Analytics Page
- [ ] Page loads without errors
- [ ] Stat cards display (Total Traffic, Attacks, Blocked, Avg Threat)
- [ ] Traffic distribution pie chart displays
- [ ] Daily attack trends bar chart displays
- [ ] Traffic growth line chart displays
- [ ] Geolocation attack map displays
- [ ] All charts have correct data

### 7. Architecture Page
- [ ] Page loads without errors
- [ ] Architecture flow diagram displays
- [ ] All 8 components show (User Layer, Internet, CDN, Load Balancer, WAF, DDoS Protection, Cloud Server, Database)
- [ ] Clicking components shows popup details
- [ ] Popup displays purpose, security role, and advantages
- [ ] Defense in Depth card displays
- [ ] Traffic Scrubbing card displays
- [ ] Auto-Scaling card displays

### 8. Admin Page
- [ ] Page loads without errors
- [ ] Login form displays (if not logged in)
- [ ] Login with admin credentials works
- [ ] Login with viewer credentials works
- [ ] User list displays (admin only)
- [ ] "Delete User" button works (admin only)
- [ ] "Clear Traffic Logs" button works (admin only)
- [ ] Stats cards display
- [ ] Logout button works

### 9. Reports Page
- [ ] Page loads without errors
- [ ] Report summary displays
- [ ] Active detections list displays
- [ ] "Download PDF" button works
- [ ] PDF generates with correct data
- [ ] "Download CSV" button works
- [ ] CSV generates with correct data
- [ ] Severity color coding works

## Authentication & Authorization Tests
- [ ] JWT token stored in localStorage after login
- [ ] Protected routes redirect to login if not authenticated
- [ ] Admin-only routes accessible only to admin users
- [ ] Viewer users cannot access admin-only features
- [ ] Logout clears token and redirects
- [ ] Token refresh works (if implemented)

## Real-Time Features Tests
- [ ] Socket.io connection established
- [ ] Dashboard updates in real-time during simulation
- [ ] Detection page updates when attacks detected
- [ ] Notifications appear in NotificationCenter
- [ ] Notification badge shows unread count
- [ ] Mark notification as read works
- [ ] Clear notifications works (admin)

## Database Tests
- [ ] MongoDB connection successful
- [ ] Users collection exists
- [ ] TrafficLogs collection exists
- [ ] BlockedIPs collection exists
- [ ] FirewallRules collection exists
- [ ] Notifications collection exists
- [ ] Seed data inserted correctly
- [ ] New traffic logs saved to database
- [ ] Blocked IPs persist in database
- [ ] Firewall rules persist in database

## API Endpoint Tests
- [ ] POST /api/auth/login works
- [ ] POST /api/auth/register works
- [ ] GET /api/auth/profile works
- [ ] POST /api/traffic/normal works
- [ ] POST /api/traffic/attack works
- [ ] POST /api/traffic/stop works
- [ ] GET /api/traffic/state works
- [ ] GET /api/traffic/logs works
- [ ] GET /api/detection/status works
- [ ] POST /api/detection/analyze works
- [ ] GET /api/protection/blocked-ips works
- [ ] POST /api/protection/block-ip works
- [ ] DELETE /api/protection/block-ip/:ip works
- [ ] GET /api/protection/firewall works
- [ ] POST /api/protection/firewall works
- [ ] DELETE /api/protection/firewall/:id works
- [ ] GET /api/dashboard works
- [ ] GET /api/analytics works
- [ ] GET /api/reports/data works
- [ ] GET /api/reports/csv works
- [ ] GET /api/reports/notifications works

## Responsive Design Tests
- [ ] Home page displays correctly on mobile
- [ ] Navbar hamburger menu works on mobile
- [ ] All pages display correctly on tablet
- [ ] All pages display correctly on desktop
- [ ] Charts resize correctly on different screens
- [ ] Tables scroll horizontally on mobile if needed

## Performance Tests
- [ ] Page load time < 3 seconds
- [ ] Navigation between pages is smooth
- [ ] Charts render quickly
- [ ] Real-time updates don't cause lag
- [ ] No memory leaks in browser console

## Error Handling Tests
- [ ] Invalid login shows error message
- [ ] Network errors display user-friendly messages
- [ ] Form validation works on all forms
- [ ] Empty required fields show validation errors
- [ ] API errors are caught and displayed

## Security Tests
- [ ] Passwords are hashed before storage
- [ ] JWT tokens are verified on protected routes
- [ ] CORS is properly configured
- [ ] Rate limiting is enforced
- [ ] SQL injection attempts are blocked
- [ ] XSS protection is in place

## Browser Compatibility Tests
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Edge
- [ ] Works in Safari (if available)

## Final Verification
- [ ] All 9 pages accessible and functional
- [ ] All features work as expected
- [ ] No console errors
- [ ] No broken links
- [ ] Branding consistent across all pages
- [ ] Dark theme applied correctly
- [ ] Animations play smoothly
- [ ] Socket.io real-time features working
- [ ] Database operations successful
- [ ] Authentication and authorization working

## Known Issues (if any)
- [ ] Document any issues found during testing
- [ ] Note any browser-specific problems
- [ ] Record any performance bottlenecks
