import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import TrafficSimulator from './pages/TrafficSimulator';
import Detection from './pages/Detection';
import Protection from './pages/Protection';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Architecture from './pages/Architecture';
import Admin from './pages/Admin';
import Reports from './pages/Reports';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/simulator" element={<TrafficSimulator />} />
              <Route path="/detection" element={<Detection />} />
              <Route path="/protection" element={<Protection />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/architecture" element={<Architecture />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/reports" element={<Reports />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
