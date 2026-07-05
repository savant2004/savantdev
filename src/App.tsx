import { useState } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { ContactProvider, useContactModal } from './lib/contactContext';
import { ContactModal } from './components/ui/ContactModal';
import { Navbar } from './components/layout/Navbar';
import { KonamiOverlay } from './components/layout/KonamiOverlay';
import { LoadingScreen } from './components/layout/LoadingScreen';
import { Hero } from './components/sections/Hero';
import { FeaturedEcosystem } from './components/sections/FeaturedEcosystem';
import { SystemOrbit } from './components/sections/SystemOrbit';
import { Projects } from './components/sections/Projects';
import { Timeline } from './components/sections/Timeline';
import { CtaSection } from './components/sections/CtaSection';
import { TerminalSection } from './components/sections/TerminalSection';
import { Footer } from './components/sections/Footer';

const SESSION_KEY = 'savant_loaded';

function shouldShowLoader() {
  if (typeof window === 'undefined') return false;
  if (sessionStorage.getItem(SESSION_KEY)) return false;
  return true;
}

function AppInner() {
  const { open, setOpen } = useContactModal();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <FeaturedEcosystem />
        <SystemOrbit />
        <Projects />
        <Timeline />
        <CtaSection />
        <TerminalSection />
        <Footer />
      </main>
      <KonamiOverlay />
      <ContactModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

export default function App() {
  useSmoothScroll();
  const [loading, setLoading] = useState(shouldShowLoader);

  const handleComplete = () => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setLoading(false);
  };

  return (
    <ContactProvider>
      {loading && <LoadingScreen onComplete={handleComplete} />}
      <AppInner />
      <SpeedInsights />
    </ContactProvider>
  );
}
