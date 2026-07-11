import { motion } from 'framer-motion';
import {
  FaUsers,
  FaGlobe,
  FaCloud,
  FaBalanceScale,
  FaShieldAlt,
  FaFire,
  FaServer,
  FaDatabase,
} from 'react-icons/fa';
import ArchitectureFlow from '../components/ArchitectureFlow';

const cloudArchitecture = [
  {
    name: 'User Layer',
    icon: FaUsers,
    purpose: 'End users accessing applications through browsers, mobile apps, and APIs.',
    securityRole: 'Source of both legitimate traffic and potential attack vectors.',
    advantages: ['Global reach', 'Multiple device types', 'Diverse access patterns'],
  },
  {
    name: 'Internet Layer',
    icon: FaGlobe,
    purpose: 'Public network infrastructure connecting users to cloud services.',
    securityRole: 'Primary pathway for DDoS attacks and malicious traffic injection.',
    advantages: ['Universal connectivity', 'High bandwidth', 'Distributed nodes'],
  },
  {
    name: 'CDN',
    icon: FaCloud,
    purpose: 'Content Delivery Network caches content at edge locations worldwide.',
    securityRole: 'Absorbs volumetric attacks and reduces load on origin servers.',
    advantages: ['Edge caching', 'DDoS absorption', 'Reduced latency'],
  },
  {
    name: 'Load Balancer',
    icon: FaBalanceScale,
    purpose: 'Distributes traffic across multiple server instances for high availability.',
    securityRole: 'Prevents single-point failure and distributes attack load.',
    advantages: ['Traffic distribution', 'Health checks', 'Auto-scaling trigger'],
  },
  {
    name: 'Web Application Firewall (WAF)',
    icon: FaShieldAlt,
    purpose: 'Inspects HTTP/HTTPS traffic and blocks application-layer attacks.',
    securityRole: 'Filters malicious requests, SQL injection, and HTTP floods.',
    advantages: ['Layer 7 protection', 'Custom rules', 'Bot detection'],
  },
  {
    name: 'DDoS Protection Layer',
    icon: FaFire,
    purpose: 'Dedicated DDoS mitigation service analyzing and filtering attack traffic.',
    securityRole: 'Core defense against volumetric, protocol, and application attacks.',
    advantages: ['Real-time mitigation', 'Traffic scrubbing', 'Threat intelligence'],
  },
  {
    name: 'Cloud Server',
    icon: FaServer,
    purpose: 'Protected compute instances running applications and microservices.',
    securityRole: 'Final application layer protected by upstream security services.',
    advantages: ['Scalable compute', 'Container support', 'Auto-healing'],
  },
  {
    name: 'Database',
    icon: FaDatabase,
    purpose: 'Secure data storage layer with encryption and access controls.',
    securityRole: 'Protected from direct exposure; accessible only through application layer.',
    advantages: ['Encrypted storage', 'Backup & recovery', 'Access auditing'],
  },
];

const Architecture = () => {
  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text mb-2">Cloud Security Architecture</h1>
        <p className="text-gray-400 mb-8">
          Interactive multi-layer cloud DDoS protection architecture diagram
        </p>

        <ArchitectureFlow
          components={cloudArchitecture}
          title="Cloud DDoS Protection Architecture"
        />

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Defense in Depth',
              text: 'Multiple security layers ensure that if one layer is breached, subsequent layers continue protecting infrastructure.',
            },
            {
              title: 'Traffic Scrubbing',
              text: 'Malicious traffic is identified and filtered at the edge before reaching application servers.',
            },
            {
              title: 'Auto-Scaling',
              text: 'Cloud infrastructure automatically scales to handle legitimate traffic spikes while blocking attacks.',
            },
          ].map((item) => (
            <div key={item.title} className="neon-card rounded-xl p-6">
              <h3 className="text-cyber-cyan font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Architecture;
