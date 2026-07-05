export interface TimelineNode {
  year: string;
  title: string;
  description: string;
  metrics: string[];
  impact: string;
}

export const timeline: TimelineNode[] = [
  {
    year: '2023',
    title: 'Leading Tech Projects',
    description:
      'Started leading software projects and delivering production-ready solutions.',
    metrics: ['Full-Stack Systems', 'Production Deployments', 'Team Leadership'],
    impact: 'Led end-to-end delivery of multiple production systems.',
  },
  {
    year: '2024',
    title: 'Alsa3a HyperMarket',
    description:
      'Built a complete commerce and operations platform.',
    metrics: ['Commerce Platform', 'Operations Suite', 'Real-Time Sync'],
    impact: 'Thousands of orders processed.',
  },
  {
    year: '2025',
    title: 'MetroKent Ecosystem',
    description:
      'Launched a logistics ecosystem with 6 interconnected applications.',
    metrics: ['6 Apps Built', 'Real-Time Logistics', '10k+ Concurrent Users'],
    impact: 'Six apps on one realtime core.',
  },
  {
    year: '2026+',
    title: 'Building SAVANT',
    description:
      'Architecting the next generation of intelligent business systems.',
    metrics: ['AI-Powered Products', 'Interactive Systems', 'Ecosystem Architecture'],
    impact: 'AI-augmented product engineering.',
  },
];
