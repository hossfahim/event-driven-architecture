import { create } from 'zustand';

export type KafkaLogLevel = 'info' | 'success' | 'warning' | 'error';

export type KafkaLog = {
  id: string;
  timestamp: Date;
  topic: string;
  level: KafkaLogLevel;
  message: string;
  metadata: Record<string, any>;
};

type KafkaStore = {
  logs: KafkaLog[];
  addLog: (log: KafkaLog) => void;
  clearLogs: () => void;
};

const useKafkaStore = create<KafkaStore>((set) => ({
  logs: [],
  addLog: (log) => set((state) => ({ 
    logs: [...state.logs, log].slice(-100) // Keep last 100 logs
  })),
  clearLogs: () => set({ logs: [] }),
}));

export const useKafka = () => {
  const addLog = useKafkaStore((state) => state.addLog);

  const sendLog = (
    level: KafkaLogLevel,
    message: string,
    metadata: Record<string, any> = {}
  ) => {
    const log: KafkaLog = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      topic: 'log.central',
      level,
      message,
      metadata,
    };

    addLog(log);

    // Simulate Kafka producer logging
    console.log(`[Kafka Producer] Topic: ${log.topic}`, {
      level: log.level,
      message: log.message,
      metadata: log.metadata,
    });
  };

  return { sendLog };
};

export const useKafkaLogs = () => {
  const logs = useKafkaStore((state) => state.logs);
  const clearLogs = useKafkaStore((state) => state.clearLogs);

  return { logs, clearLogs };
};
