const COUNTRIES = [
  'United States', 'China', 'Russia', 'India', 'Brazil',
  'Germany', 'United Kingdom', 'France', 'Japan', 'Australia',
  'Canada', 'South Korea', 'Netherlands', 'Singapore', 'Unknown',
];

const ENDPOINTS = [
  '/api/health', '/api/users', '/api/login', '/api/data',
  '/api/products', '/api/search', '/api/upload', '/',
];

export const randomIp = () =>
  `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

export const randomCountry = () => COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];

export const randomEndpoint = () => ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];

export const randomUserAgent = () => {
  const agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X) Safari/17.0',
    'curl/8.0.1',
    'python-requests/2.31.0',
    'Bot/1.0 (compatible; AttackBot)',
    'Mozilla/5.0 (Linux; Android 13) Chrome/119.0',
  ];
  return agents[Math.floor(Math.random() * agents.length)];
};

export const mapAttackType = (attackType) => {
  const map = {
    'Normal Traffic': 'Normal',
    'HTTP Flood': 'HTTP Flood',
    'SYN Flood': 'SYN Flood',
    'UDP Flood': 'UDP Flood',
    'Botnet Attack': 'Botnet Attack',
  };
  return map[attackType] || 'DDoS';
};
