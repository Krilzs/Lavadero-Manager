import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, WashingMachine, Info, Download } from 'lucide-react';
import { useLaundryStore } from '../store';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall?: () => void;
  canInstall?: boolean;
}

export default function Sidebar({ isOpen, onClose, onInstall, canInstall }: SidebarProps) {
  const { theme, toggleTheme } = useLaundryStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-3/4 max-w-sm bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col"
          >
            <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 font-bold text-lg dark:text-white">
                <WashingMachine className="text-[var(--color-primary)]" />
                Opciones
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 flex-1 flex flex-col gap-4">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                <div className="flex items-center gap-3">
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                  <span className="font-medium">Modo {theme === 'light' ? 'Oscuro' : 'Claro'}</span>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-[var(--color-primary)]' : 'bg-slate-300'}`}>
                  <motion.div
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                    animate={{ x: theme === 'dark' ? 24 : 0 }}
                  />
                </div>
              </button>

              {canInstall && onInstall && (
                <button
                  onClick={onInstall}
                  className="flex items-center justify-between p-4 rounded-2xl bg-[var(--color-primary)] text-white shadow-lg active:scale-95 transition-all mt-2"
                >
                  <div className="flex items-center gap-3">
                    <Download size={20} />
                    <span className="font-bold">Instalar App</span>
                  </div>
                </button>
              )}

              <div className="mt-auto flex flex-col gap-2 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <Info size={16} /> Acerca de
                </div>
                <p className="text-sm opacity-80">
                  LaundryTracker V2. Creado con Vite, React y TailwindCSS.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
