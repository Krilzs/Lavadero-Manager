import { useLaundryStore } from '../store';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Plus, Minus } from 'lucide-react';
import { itemIcons } from './ActiveSession';

interface VerificationViewProps {
  sessionId: string;
  onComplete: () => void;
}

export default function VerificationView({ sessionId, onComplete }: VerificationViewProps) {
  const { sessions, verifyReturnedItem, completeVerification } = useLaundryStore();

  const session = sessions.find(s => s.id === sessionId);

  if (!session || session.status !== 'en_lavadero') return null;

  // Filtrar los que realmente se enviaron
  const itemsSent = session.items.filter(item => item.sent_count > 0);
  const totalSent = itemsSent.reduce((acc, item) => acc + item.sent_count, 0);
  const totalReturned = itemsSent.reduce((acc, item) => acc + item.returned_count, 0);

  const isComplete = itemsSent.every(item => item.sent_count === item.returned_count);

  const handleFinish = () => {
    completeVerification(sessionId);
    onComplete();
  };

  return (
    <div className="pb-8 slide-up">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Verificando</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">¿Volvió todo de la lavandería?</p>
        </div>
        <div className={`px-4 py-2 rounded-2xl font-bold transition-colors ${isComplete ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'}`}>
          {totalReturned} / {totalSent}
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {itemsSent.map((item) => {
          const isItemComplete = item.returned_count === item.sent_count;

          return (
            <motion.div
              key={item.type}
              className={`p-4 rounded-2xl shadow-sm border flex flex-col gap-4 transition-colors ${isItemComplete ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30' : 'bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700'}`}
              layout
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-1 rounded-xl shadow-sm border transition-colors ${isItemComplete ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100 dark:border-slate-300 dark:bg-slate-100'}`}>
                    <img src={itemIcons[item.type]} alt={item.type} className="w-10 h-10 object-contain drop-shadow-sm" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 text-lg block">{item.type}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Enviados: {item.sent_count}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => verifyReturnedItem(sessionId, item.type, -1)}
                    disabled={item.returned_count === 0}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-50 active:bg-slate-200 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className={`w-8 text-center font-bold text-xl transition-colors ${isItemComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>
                    {item.returned_count}
                  </span>
                  <button
                    onClick={() => verifyReturnedItem(sessionId, item.type, 1)}
                    disabled={item.returned_count >= item.sent_count}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/40 text-[var(--color-primary-dark)] dark:text-emerald-400 active:bg-emerald-200 transition-colors disabled:opacity-50"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                 <motion.div 
                   className="h-full bg-[var(--color-primary)]"
                   initial={{ width: 0 }}
                   animate={{ width: `${(item.returned_count / item.sent_count) * 100}%` }}
                   transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                 />
              </div>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={handleFinish}
        className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95 ${
          isComplete 
          ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]' 
          : 'bg-amber-500 text-white hover:bg-amber-600'
        }`}
      >
        {isComplete ? (
          <>
            <CheckCircle2 size={20} />
            Todo Correcto - Finalizar
          </>
        ) : (
          <>
            <AlertCircle size={20} />
            Finalizar con faltantes
          </>
        )}
      </button>
    </div>
  );
}
