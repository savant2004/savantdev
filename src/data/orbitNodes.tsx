export interface OrbitNode {
  id: number;
  label: string;
  desc: string;
  x: number;
  y: number;
  side: 'left' | 'right';
  metrics: string[];
  iconKey: string;
}

export const orbitNodes: OrbitNode[] = [
  { id: 1, label: 'Strategy', desc: 'Building the foundation before execution.', x: 400, y: 300, side: 'right', metrics: ['Market Research', 'Positioning', 'Business Goals'], iconKey: 'target' },
  { id: 2, label: 'Architecture', desc: 'Designing scalable system foundations.', x: 150, y: 600, side: 'left', metrics: ['System Design', 'Tech Stack', 'Scalability'], iconKey: 'nodes' },
  { id: 3, label: 'Development', desc: 'Building with precision & iteration.', x: 650, y: 900, side: 'right', metrics: ['Agile Sprints', 'Code Quality', 'Testing'], iconKey: 'code' },
  { id: 4, label: 'Deployment', desc: 'Shipping reliably to production.', x: 150, y: 1200, side: 'left', metrics: ['CI/CD', 'Monitoring', 'Rollback'], iconKey: 'rocket' },
  { id: 5, label: 'Analytics', desc: 'Measuring, learning & optimising.', x: 650, y: 1500, side: 'right', metrics: ['Real-time Data', 'A/B Testing', 'Insights'], iconKey: 'chart' },
  { id: 6, label: 'Experience', desc: 'Delighting users at every touchpoint.', x: 400, y: 1800, side: 'left', metrics: ['UX Research', 'Interaction', 'Accessibility'], iconKey: 'star' },
];
