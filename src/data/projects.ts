export interface Project {
  slug: string;
  title: string;
  category: string;
  description: string;
  stack: string[];
  accent: string; // hex used for the card's glow tint
  year: string;
  metric: string;
  href?: string;
  image?: string;
  private?: boolean;
  hidden?: boolean;
  similarTo?: string; // slug of a similar public project to suggest
}

export const projects: Project[] = [
  {
    slug: 'savant-learning',
    title: 'Savant Learning',
    category: 'EdTech Platform',
    description:
      'An interactive quiz platform with adaptive difficulty, real-time leaderboards, and a question-authoring studio. Powered by LLM-based question generation.',
    stack: ['Prisma', 'Framer Motion', 'GSAP', 'LLM API'],
    accent: '#E5383B',
    year: '2025',
    metric: 'AI-powered quizzes',
    href: 'https://learning.savant.website/',
    image: '/savant-learning.png',
  },
  {
    slug: 'metrokent-eco',
    title: 'MetroKent Eco',
    category: 'Logistics Ecosystem',
    description:
      'A cross-platform transit ecosystem spanning a customer app, driver app, operations console, and admin dashboard — built with a shared React Native core.',
    stack: ['Next.js 16', 'React Native', 'Expo', 'TypeScript'],
    accent: '#DC143C',
    year: '2025',
    metric: 'Cross-platform',
    image: '/mk-eco.png',
    private: true,
    similarTo: 'alsa3a-eco',
  },
  {
    slug: 'alsa3a-eco',
    title: 'Alsa3a Eco',
    category: 'Logistics Ecosystem',
    description:
      'A cross-platform transit ecosystem spanning a customer app, driver app, operations console, and admin dashboard — built with a shared React Native core.',
    stack: ['Next.js 16', 'React Native', 'Expo', 'TypeScript'],
    accent: '#DC143C',
    year: '2025',
    metric: 'Cross-platform',
    href: 'https://linktr.ee/alsa3aapp',
    hidden: true,
  },
  {
    slug: 'dentalyzer',
    title: 'Dentalyzer',
    category: 'Health AI',
    description:
      'A computer-vision assistant that analyses dental imagery and surfaces diagnostic hints. Combines TensorFlow inference with a clinician review surface.',
    stack: ['TypeScript', 'Tailwind CSS v4', 'Redis', 'Docker', 'TensorFlow.js', 'AWS S3'],
    accent: '#FF6B35',
    year: '2026',
    metric: 'AI-assisted',
    image: '/dentalazer.png',
    private: true,
  },
];
