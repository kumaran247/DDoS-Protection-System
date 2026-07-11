import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaUsers,
  FaGlobe,
  FaBalanceScale,
  FaFire,
  FaSearch,
  FaShieldAlt,
  FaBan,
  FaCloud,
  FaServer,
  FaNetworkWired,
} from 'react-icons/fa';
import CloudAnimation from '../components/CloudAnimation';
import ArchitectureFlow from '../components/ArchitectureFlow';

const features = [
  {
    icon: FaNetworkWired,
    title: 'Real-Time Monitoring',
    subtitle: 'Live Security Operations Center (SOC) Monitoring',
    description: 'Continuously monitor incoming and outgoing network traffic through a real-time dashboard powered by Socket.IO. The system provides instant updates on traffic volume, active connections, attack statistics, and suspicious activities. Interactive charts and alerts enable administrators to quickly identify abnormal behavior, monitor server health, and respond to threats with minimal delay.',
  },
  {
    icon: FaSearch,
    title: 'Traffic Analysis',
    subtitle: 'Advanced Packet Inspection and Behavioral Analysis',
    description: 'Analyze network traffic using deep packet inspection and pattern recognition techniques. The system evaluates packet rates, request types, bandwidth consumption, and connection patterns to detect anomalies and suspicious behavior. Traffic visualization and statistical analysis help distinguish legitimate users from malicious sources, enabling proactive defense against DDoS attacks.',
  },
  {
    icon: FaFire,
    title: 'Attack Detection',
    subtitle: 'Multi-Layer DDoS Detection Engine',
    description: 'Detect malicious traffic using multiple detection techniques, including threshold-based analysis, rate limiting, anomaly detection, and signature matching. The engine identifies common attack types such as SYN Flood, UDP Flood, ICMP Flood, HTTP Flood, and botnet-generated traffic. Real-time alerts notify administrators whenever attack patterns or abnormal spikes are detected.',
  },
  {
    icon: FaBan,
    title: 'IP Blocking',
    subtitle: 'Automated Threat Mitigation and Blacklisting',
    description: 'Protect infrastructure by automatically blocking malicious IP addresses based on predefined rules and attack behavior. Administrators can manually blacklist or whitelist IP addresses while maintaining persistent storage using MongoDB. The system supports temporary bans, permanent blacklists, and dynamic filtering to prevent repeated attacks and unauthorized access.',
  },
  {
    icon: FaCloud,
    title: 'Cloud Protection',
    subtitle: 'Enterprise-Grade Cloud Security Architecture',
    description: 'Secure cloud infrastructure with multiple layers of protection, including Web Application Firewall (WAF), Content Delivery Network (CDN), load balancing, and traffic filtering mechanisms. The system distributes incoming requests efficiently to maintain availability during high-traffic events and DDoS attacks. Scalable cloud-based defense ensures high performance, fault tolerance, and uninterrupted service availability.',
  },
];

const homeArchitecture = [
  {
    name: 'Users',
    icon: FaUsers,
    purpose: 'End users and clients accessing cloud services through various devices and networks.',
    securityRole: 'Origin point of legitimate and malicious traffic requests.',
    advantages: ['Global accessibility', 'Multiple access points', 'Diverse traffic patterns'],
  },
  {
    name: 'Internet',
    icon: FaGlobe,
    purpose: 'The public network through which all traffic flows to reach cloud infrastructure.',
    securityRole: 'Primary attack vector for DDoS campaigns and malicious traffic.',
    advantages: ['Global connectivity', 'High bandwidth', 'Distributed access'],
  },
  {
    name: 'Load Balancer',
    icon: FaBalanceScale,
    purpose: 'Distributes incoming traffic across multiple servers to ensure availability.',
    securityRole: 'First line of defense against traffic floods by distributing load.',
    advantages: ['High availability', 'Traffic distribution', 'Failover support'],
  },
  {
    name: 'Firewall',
    icon: FaShieldAlt,
    purpose: 'Filters traffic based on predefined security rules and policies.',
    securityRole: 'Blocks unauthorized access and filters malicious packets.',
    advantages: ['Rule-based filtering', 'IP blocking', 'Protocol inspection'],
  },
  {
    name: 'Traffic Analyzer',
    icon: FaSearch,
    purpose: 'Analyzes traffic patterns to detect anomalies and potential DDoS attacks.',
    securityRole: 'Core detection engine identifying attack signatures and patterns.',
    advantages: ['Real-time analysis', 'Pattern detection', 'Threat scoring'],
  },
  {
    name: 'Cloud Server',
    icon: FaServer,
    purpose: 'Protected backend infrastructure hosting applications and services.',
    securityRole: 'Final destination protected by multiple security layers.',
    advantages: ['Scalable compute', 'Secure hosting', 'Auto-scaling'],
  },
];

const Home = () => {
  return (
    <div>
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <CloudAnimation className="absolute inset-0" />
        <div className="page-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <FaShieldAlt className="text-6xl md:text-8xl text-cyber-purple mx-auto" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              <span className="gradient-text">Cloud DDoS Protection System</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8">
              Protecting Cloud Infrastructure from Distributed Attacks
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/dashboard" className="btn-primary">
                Open Dashboard
              </Link>
              <Link to="/simulator" className="btn-outline">
                Simulate Traffic
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="page-container py-16">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Core Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="neon-card rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <f.icon className="text-3xl text-cyber-cyan mb-4" />
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-cyber-cyan text-xs font-semibold mb-2">{f.subtitle}</p>
              <p className="text-gray-400 text-sm">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="page-container py-16">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text">About DDoS</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'What is DDoS?',
              text: 'A Distributed Denial of Service (DDoS) attack is a cyberattack in which multiple compromised devices, often organized as a botnet, simultaneously send massive amounts of traffic to a target server, application, or network. The overwhelming volume of requests exhausts system resources such as bandwidth, CPU, and memory, causing legitimate users to experience slow performance or complete service outages. DDoS attacks can target network, transport, and application layers, making them one of the most common threats to cloud-based infrastructures and online services.',
            },
            {
              title: 'How Cloud Attacks Occur',
              text: 'Attackers use large networks of infected devices and amplification techniques to generate enormous traffic volumes aimed at cloud services. Common attack methods include SYN Floods, UDP Floods, ICMP Floods, HTTP Floods, and application-layer attacks that exploit vulnerabilities in protocols and APIs. These attacks overwhelm servers, load balancers, and network resources, disrupting service availability. Botnets and automated attack tools enable cybercriminals to launch sophisticated attacks capable of affecting organizations of any size.',
            },
            {
              title: 'Why Protection is Necessary',
              text: 'Without effective DDoS protection, cloud applications and services are vulnerable to downtime, performance degradation, financial losses, and damage to organizational reputation. Prolonged attacks can interrupt business operations, affect customer trust, and expose systems to additional security risks. A multi-layered defense strategy involving traffic monitoring, anomaly detection, rate limiting, IP blocking, Web Application Firewalls (WAF), and cloud-based mitigation mechanisms helps maintain availability, ensure business continuity, and safeguard critical infrastructure against evolving cyber threats.',
            },
          ].map((item) => (
            <div key={item.title} className="glass rounded-xl p-6">
              <h3 className="text-lg font-bold text-cyber-cyan mb-3">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-container py-16">
        <ArchitectureFlow components={homeArchitecture} title="Architecture Preview" />
      </section>
    </div>
  );
};

export default Home;
