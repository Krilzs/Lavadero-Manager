import { useLaundryStore } from '../store';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';
import { itemIcons } from './ActiveSession';

export default function History() {
  const { sessions, deleteSession } = useLaundryStore();
  const history = sessions.filter(s => s.status === 'devuelto');

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-6 text-slate-400 dark:text-slate-500">
          <Calendar size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Historial Vacío</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Aún no has completado ningún lavado.</p>
      </div>
    );
  }

  return (
    <div className="pb-8 slide-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Historial</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Tus lavados anteriores</p>
      </div>

      <div className="space-y-4">
        {history.map((session, index) => {
          const itemsSent = session.items.filter(item => item.sent_count > 0);
          const totalSent = itemsSent.reduce((acc, item) => acc + item.sent_count, 0);
          const totalReturned = itemsSent.reduce((acc, item) => acc + item.returned_count, 0);
          const isPerfect = totalSent === totalReturned;
          
          const date = new Date(session.date).toLocaleDateString('es-ES', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          });

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={session.id}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm capitalize">
                  <Calendar size={16} />
                  {date}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => deleteSession(session.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                    <Trash2 size={16} />
                  </button>
                  {isPerfect ? (
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg">
                      <CheckCircle2 size={14} /> Perfecto
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-bold bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-lg">
                      <AlertTriangle size={14} /> Faltaron prendas
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 grid grid-cols-2 gap-3">
                {itemsSent.map(item => (
                  <div key={item.type} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <div className="bg-white rounded-md p-1 shadow-sm border border-slate-100">
                        <img src={itemIcons[item.type]} alt={item.type} className="w-5 h-5 object-contain" />
                      </div>
                      <span className="truncate max-w-[80px] font-medium">{item.type}</span>
                    </div>
                    <div className="font-medium text-slate-700 dark:text-slate-200">
                      {item.returned_count}/{item.sent_count}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-700 pt-3">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Total prendas:</span>
                <span className="font-bold text-slate-700 dark:text-slate-100">{totalReturned} de {totalSent}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
