import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import ParticleBackground from './ParticleBackground';

const Layout = () => {
  return (
    <div className="relative min-h-screen bg-cyber-bg">
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
