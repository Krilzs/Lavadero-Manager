
import { useLaundryStore } from '../store';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Plus } from 'lucide-react';

interface SessionListProps {
  onSelectSession: (id: string) => void;
}

export default function SessionList({ onSelectSession }: SessionListProps) {
  const { sessions, createSession } = useLaundryStore();
  
  const activeSessions = sessions.filter(s => s.status !== 'devuelto');

  const handleCreate = () => {
    const id = createSession();
    onSelectSession(id);
  };

  return (
    <div className="pb-8 slide-up">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tus Lavados</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Lavados activos y pendientes</p>
        </div>
      </div>

      {activeSessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-6 rounded-full mb-6">
            <WashingMachineIcon />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Todo limpio</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8">No tienes lavados activos en este momento.</p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {activeSessions.map((session) => {
            const date = new Date(session.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
            const totalItems = session.items.reduce((acc, item) => acc + item.sent_count, 0);

            return (
              <motion.div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all hover:border-[var(--color-primary)]"
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${session.status === 'draft' ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'}`}>
                    {session.status === 'draft' ? <Clock size={20} /> : <WashingMachineIcon small />}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 text-lg block">
                      {session.status === 'draft' ? 'Borrador' : 'En Lavadero'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{date} • {totalItems} prendas</span>
                  </div>
                </div>
                <ArrowRight size={20} className="text-slate-400" />
              </motion.div>
            );
          })}
        </div>
      )}

      <button
        onClick={handleCreate}
        className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-[var(--color-primary-dark)] active:scale-95 transition-all"
      >
        <Plus size={20} />
        Registrar Nuevo Pedido
      </button>
    </div>
  );
}

function WashingMachineIcon({ small = false }: { small?: boolean }) {
  return (
    <svg width={small ? "20" : "48"} height={small ? "20" : "48"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="2" width="18" height="20" rx="2" ry="2"></rect>
      <path d="M7 6h.01"></path>
      <path d="M11 6h.01"></path>
      <path d="M15 6h.01"></path>
      <path d="M12 18a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
    </svg>
  );
}
