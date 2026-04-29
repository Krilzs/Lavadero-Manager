import { useState, useEffect } from 'react';
import { useLaundryStore } from './store';
import ActiveSession from './components/ActiveSession';
import VerificationView from './components/VerificationView';
import History from './components/History';
import SessionList from './components/SessionList';
import Sidebar from './components/Sidebar';
import { WashingMachine, Clock, Menu, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { sessions, theme } = useLaundryStore();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  // PWA Logic
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('✅ PWA: beforeinstallprompt detectado');
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  // Si la sesión fue borrada o completada (y estamos en tab active), la deseleccionamos.
  useEffect(() => {
    if (selectedSessionId) {
      const session = sessions.find(s => s.id === selectedSessionId);
      if (!session || (activeTab === 'active' && session.status === 'devuelto')) {
        setSelectedSessionId(null);
      }
    }
  }, [sessions, selectedSessionId, activeTab]);

  const renderActiveContent = () => {
    if (!selectedSessionId) {
      return <SessionList onSelectSession={setSelectedSessionId} />;
    }

    const session = sessions.find(s => s.id === selectedSessionId);
    if (!session) return <SessionList onSelectSession={setSelectedSessionId} />;

    if (session.status === 'draft') {
      return <ActiveSession sessionId={session.id} />;
    } else if (session.status === 'en_lavadero') {
      return <VerificationView sessionId={session.id} onComplete={() => setSelectedSessionId(null)} />;
    }
    return <SessionList onSelectSession={setSelectedSessionId} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 md:pb-0 md:pt-20 transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onInstall={handleInstallClick}
        canInstall={!!deferredPrompt && !isStandalone}
      />

      {/* Header */}
      <header className="bg-white dark:bg-slate-900 sticky top-0 z-10 shadow-sm px-4 py-4 border-b border-slate-100 dark:border-slate-800 md:hidden flex items-center justify-between transition-colors">
        <div className="flex items-center gap-2">
          {selectedSessionId ? (
            <button onClick={() => setSelectedSessionId(null)} className="p-1 -ml-1 text-slate-600 dark:text-slate-300">
              <ChevronLeft size={24} />
            </button>
          ) : (
            <button onClick={() => setSidebarOpen(true)} className="p-1 -ml-1 text-slate-600 dark:text-slate-300">
              <Menu size={24} />
            </button>
          )}
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            {!selectedSessionId && <WashingMachine className="text-[var(--color-primary)]" />}
            {selectedSessionId ? 'Detalle' : 'LaundryTracker'}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'active' ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {renderActiveContent()}
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <History />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 md:max-w-md md:mx-auto md:bottom-4 md:rounded-2xl md:shadow-lg md:border-none z-30 transition-colors">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => { setActiveTab('active'); setSelectedSessionId(null); }}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'active' ? 'text-[var(--color-primary)]' : 'text-slate-400 dark:text-slate-500'}`}
          >
            <WashingMachine size={24} />
            <span className="text-xs font-medium mt-1">Lavado</span>
          </button>
          <button
            onClick={() => { setActiveTab('history'); setSelectedSessionId(null); }}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'history' ? 'text-[var(--color-primary)]' : 'text-slate-400 dark:text-slate-500'}`}
          >
            <Clock size={24} />
            <span className="text-xs font-medium mt-1">Historial</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
