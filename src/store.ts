import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ClothingType = 'Remera' | 'Pantalón' | 'Buzo' | 'Campera' | 'Sábanas' | 'Toallas' | 'Toallones';
export type SessionStatus = 'draft' | 'en_lavadero' | 'devuelto';

export interface LaundryItem {
  type: ClothingType;
  sent_count: number;
  returned_count: number;
}

export interface LaundrySession {
  id: string;
  date: string;
  status: SessionStatus;
  items: LaundryItem[];
}

interface LaundryState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  whatsappNumber: string;
  setWhatsappNumber: (number: string) => void;
  sessions: LaundrySession[];
  createSession: () => string;
  updateItemCount: (sessionId: string, type: ClothingType, delta: number) => void;
  sendToLaundry: (sessionId: string) => void;
  verifyReturnedItem: (sessionId: string, type: ClothingType, delta: number) => void;
  completeVerification: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
}

const defaultItems: LaundryItem[] = [
  { type: 'Remera', sent_count: 0, returned_count: 0 },
  { type: 'Pantalón', sent_count: 0, returned_count: 0 },
  { type: 'Buzo', sent_count: 0, returned_count: 0 },
  { type: 'Campera', sent_count: 0, returned_count: 0 },
  { type: 'Sábanas', sent_count: 0, returned_count: 0 },
  { type: 'Toallas', sent_count: 0, returned_count: 0 },
  { type: 'Toallones', sent_count: 0, returned_count: 0 },
];

export const useLaundryStore = create<LaundryState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        if (newTheme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        return { theme: newTheme };
      }),
      whatsappNumber: '',
      setWhatsappNumber: (number) => set({ whatsappNumber: number }),
      sessions: [],
      createSession: () => {
        const id = Date.now().toString();
        set((state) => ({
          sessions: [
            ...state.sessions,
            {
              id,
              date: new Date().toISOString(),
              status: 'draft',
              items: JSON.parse(JSON.stringify(defaultItems)),
            }
          ]
        }));
        return id;
      },
      updateItemCount: (sessionId, type, delta) => set((state) => {
        return {
          sessions: state.sessions.map(session => {
            if (session.id !== sessionId || session.status !== 'draft') return session;
            const newItems = session.items.map(item => {
              if (item.type === type) {
                return { ...item, sent_count: Math.max(0, item.sent_count + delta) };
              }
              return item;
            });
            return { ...session, items: newItems };
          })
        };
      }),
      sendToLaundry: (sessionId) => set((state) => {
        return {
          sessions: state.sessions.map(session => {
            if (session.id !== sessionId || session.status !== 'draft') return session;
            const hasItems = session.items.some(item => item.sent_count > 0);
            if (!hasItems) return session;
            return { ...session, status: 'en_lavadero' };
          })
        };
      }),
      verifyReturnedItem: (sessionId, type, delta) => set((state) => {
        return {
          sessions: state.sessions.map(session => {
            if (session.id !== sessionId || session.status !== 'en_lavadero') return session;
            const newItems = session.items.map(item => {
              if (item.type === type) {
                return { ...item, returned_count: Math.max(0, item.returned_count + delta) };
              }
              return item;
            });
            return { ...session, items: newItems };
          })
        };
      }),
      completeVerification: (sessionId) => set((state) => {
        return {
          sessions: state.sessions.map(session => {
            if (session.id !== sessionId || session.status !== 'en_lavadero') return session;
            return { ...session, status: 'devuelto' };
          })
        };
      }),
      deleteSession: (sessionId) => set((state) => {
        return {
          sessions: state.sessions.filter(session => session.id !== sessionId)
        };
      })
    }),
    {
      name: 'laundry-storage',
      migrate: (persistedState: any) => {
        // Migration logic from V1 to V2
        if (persistedState && !persistedState.sessions) {
          const oldActive = persistedState.activeSession;
          const oldHistory = persistedState.history || [];
          const newSessions = [...oldHistory];
          if (oldActive) newSessions.push(oldActive);
          return { sessions: newSessions } as any;
        }
        return persistedState;
      }
    }
  )
);
