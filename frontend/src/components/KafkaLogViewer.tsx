import { useState } from 'react';
import { useKafkaLogs, KafkaLog } from '../hooks/useKafka';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

export function KafkaLogViewer() {
  const { logs, clearLogs } = useKafkaLogs();
  const [isExpanded, setIsExpanded] = useState(true);

  const getLevelColor = (level: KafkaLog['level']) => {
    switch (level) {
      case 'info':
        return 'bg-blue-500';
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 w-[500px] max-h-[500px] bg-gray-900 text-white rounded-lg shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-mono">Kafka: log.central</span>
          <span className="text-xs text-gray-400">({logs.length} events)</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-white"
            onClick={clearLogs}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-white"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Logs Container */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[200px] max-h-[400px]">
          {logs.length === 0 ? (
            <div className="text-gray-500 text-center py-8 text-sm">
              No events received yet...
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="bg-gray-800 rounded p-2 border border-gray-700 hover:border-gray-600 transition-colors text-xs font-mono"
              >
                <div className="flex items-start gap-2 mb-1">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 ${getLevelColor(log.level)}`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-500">{formatTime(log.timestamp)}</span>
                      <span className={`uppercase px-1.5 py-0.5 rounded text-[10px] ${
                        log.level === 'info' ? 'bg-blue-500/20 text-blue-300' :
                        log.level === 'success' ? 'bg-green-500/20 text-green-300' :
                        log.level === 'warning' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {log.level}
                      </span>
                    </div>
                    <div className="text-white mb-1">{log.message}</div>
                    {Object.keys(log.metadata).length > 0 && (
                      <div className="text-gray-400 text-[11px] overflow-hidden">
                        <pre className="whitespace-pre-wrap break-all">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
