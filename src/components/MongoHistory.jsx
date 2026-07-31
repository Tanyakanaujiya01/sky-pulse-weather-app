import React from 'react';
import { History, Clock, MapPin, Database } from 'lucide-react';

export default function MongoHistory({ history, onSelectCity, isDbConnected }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="history-container glass-panel animate-fade-in">
      <div className="history-header">
        <div className="flex-center gap-2">
          <History size={18} className="text-accent" />
          <h3 className="history-title">Recent MongoDB Searches</h3>
        </div>
        <span className="db-badge">
          <Database size={12} /> {isDbConnected ? 'MongoDB Connected' : 'Cached Log'}
        </span>
      </div>

      <div className="history-chips">
        {history.map((log, idx) => {
          const dateStr = log.searchedAt 
            ? new Date(log.searchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '';

          return (
            <button
              key={log._id || idx}
              className="history-chip"
              onClick={() => onSelectCity(log.cityName)}
              title={`Searched: ${log.cityName} (${log.temp}°)`}
            >
              <MapPin size={12} className="chip-icon" />
              <span className="chip-city">{log.cityName}</span>
              <span className="chip-temp">{Math.round(log.temp)}°</span>
              {dateStr && (
                <span className="chip-time">
                  <Clock size={10} /> {dateStr}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
