import React from 'react';
import { CloudSun, Key, Database } from 'lucide-react';

export default function Navbar({ unit, onToggleUnit, onOpenApiKeyModal, isUsingLiveKey, isDbConnected }) {
  return (
    <header className="navbar-container">
      <div className="navbar-brand">
        <div className="brand-icon-wrapper">
          <CloudSun className="brand-icon" size={28} />
        </div>
        <div className="brand-text">
          <span className="brand-name">SkyPulse</span>
          <span className="brand-badge">React + MongoDB Weather</span>
        </div>
      </div>

      <div className="navbar-actions">
        <div className={`db-status-badge ${isDbConnected ? 'connected' : 'fallback'}`} title={isDbConnected ? 'MongoDB Server Connected' : 'MongoDB Server Offline (Local Fallback Active)'}>
          <Database size={13} />
          <span>{isDbConnected ? 'MongoDB' : 'DB Fallback'}</span>
        </div>

        <button 
          className={`api-key-badge ${isUsingLiveKey ? 'live' : 'demo'}`}
          onClick={onOpenApiKeyModal}
          title="Configure OpenWeatherMap API Key"
        >
          <Key size={14} />
          <span>{isUsingLiveKey ? 'API Key Active' : 'Demo Mode'}</span>
        </button>

        <div className="unit-toggle">
          <button 
            className={`unit-btn ${unit === 'metric' ? 'active' : ''}`}
            onClick={() => unit !== 'metric' && onToggleUnit()}
            title="Switch to Celsius"
          >
            °C
          </button>
          <button 
            className={`unit-btn ${unit === 'imperial' ? 'active' : ''}`}
            onClick={() => unit !== 'imperial' && onToggleUnit()}
            title="Switch to Fahrenheit"
          >
            °F
          </button>
        </div>
      </div>
    </header>
  );
}
