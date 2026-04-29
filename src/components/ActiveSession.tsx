import { useState } from 'react';
import { useLaundryStore, type ClothingType } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Send, Trash2, CheckCircle2 } from 'lucide-react';

export const itemIcons: Record<ClothingType, string> = {
  'Remera': '/icons/remera.png',
  'Pantalón': '/icons/pantalon.png',
  'Buzo': '/icons/buzo.png',
  'Campera': '/icons/campera.png',
  'Sábanas': '/icons/sabanas.png',
  'Toallas': '/icons/toallas.png',
  'Toallones': '/icons/toallones.png',
};

interface ActiveSessionProps {
  sessionId: string;
}

export default function ActiveSession({ sessionId }: ActiveSessionProps) {
  const { sessions, updateItemCount, sendToLaundry, deleteSession } = useLaundryStore();
  const [isSending, setIsSending] = useState(false);
  
  const session = sessions.find(s => s.id === sessionId);

  if (!session || session.status !== 'draft') {
    return null;
  }

  const totalItems = session.items.reduce((acc, item) => acc + item.sent_count, 0);

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      sendToLaundry(sessionId);
    }, 2500);
  };

  return (
    <div className="pb-8 slide-up relative">
      <AnimatePresence>
        {isSending && (
          <motion.div 
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 100 }}
              className="bg-emerald-100 dark:bg-emerald-900/40 p-6 rounded-full mb-6 relative overflow-hidden"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute inset-2 border-4 border-dashed border-emerald-400 dark:border-emerald-500 rounded-full opacity-50"
              />
              <CheckCircle2 size={64} className="text-emerald-500 relative z-10" />
            </motion.div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center px-4"
            >
              ¡Pedido Registrado!
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-500 dark:text-slate-400 mt-2 text-center"
            >
              Tus {totalItems} prendas van camino al lavadero.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ opacity: isSending ? 0 : 1, scale: isSending ? 0.9 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Contando Prendas</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Agrega todo lo que envías</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => deleteSession(sessionId)} className="p-2 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 transition-colors">
              <Trash2 size={20} />
            </button>
            <div className="bg-emerald-100 dark:bg-emerald-900/30 text-[var(--color-primary-dark)] dark:text-emerald-400 px-4 py-2 rounded-xl font-bold">
              Total: {totalItems}
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8 relative">
          {session.items.map((item, index) => (
            <motion.div
              key={item.type}
              className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between transition-colors z-10"
              whileTap={{ scale: 0.98 }}
              animate={isSending ? {
                y: -index * 20 + 100, // Se agrupan hacia el centro
                scale: 0.5,
                opacity: 0,
                rotate: Math.random() * 20 - 10
              } : {}}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-4">
                <div className="bg-white dark:bg-slate-100 rounded-xl shadow-sm border border-slate-100 dark:border-slate-300 p-1">
                  <img src={itemIcons[item.type]} alt={item.type} className="w-10 h-10 object-contain drop-shadow-sm" />
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200 text-lg">{item.type}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => updateItemCount(sessionId, item.type, -1)}
                  disabled={item.sent_count === 0}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-50 active:bg-slate-200 dark:active:bg-slate-600 transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-8 text-center font-bold text-xl dark:text-white">{item.sent_count}</span>
                <button
                  onClick={() => updateItemCount(sessionId, item.type, 1)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/40 text-[var(--color-primary-dark)] dark:text-emerald-400 active:bg-emerald-200 dark:active:bg-emerald-800 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={handleSend}
          disabled={totalItems === 0 || isSending}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold shadow-lg disabled:opacity-50 hover:bg-slate-800 dark:hover:bg-[var(--color-primary-dark)] active:scale-95 transition-all"
        >
          <Send size={20} />
          Enviar al Lavadero
        </button>
      </motion.div>
    </div>
  );
}
