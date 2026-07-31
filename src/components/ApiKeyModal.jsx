import React, { useState } from 'react';
import { Key, X, Check, ExternalLink, ShieldCheck } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, currentApiKey, onSaveApiKey }) {
  const [keyInput, setKeyInput] = useState(currentApiKey || '');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveApiKey(keyInput.trim());
    onClose();
  };

  const handleUseDemo = () => {
    setKeyInput('');
    onSaveApiKey('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex-center gap-2">
            <Key size={20} className="text-accent" />
            <h3 className="modal-title">OpenWeatherMap API Key Settings</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="modal-body">
          <p className="modal-desc">
            SkyPulse includes an <strong>instant Demo Mode</strong> with mock weather data for major cities. If you have your own free API key from OpenWeatherMap, paste it below to enable live global search!
          </p>

          <div className="form-group">
            <label htmlFor="api-key-input">Your OpenWeatherMap API Key:</label>
            <input
              id="api-key-input"
              type="text"
              className="key-input"
              placeholder="e.g. 8f92a1b3c4d5e6f7..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
            />
          </div>

          <div className="modal-info-box">
            <ShieldCheck size={16} />
            <span>Keys are stored locally in your browser session and never sent anywhere else.</span>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={handleUseDemo}>
              Use Demo Mode
            </button>
            <button type="submit" className="btn-primary">
              <Check size={16} /> Save Key
            </button>
          </div>

          <div className="modal-help-link">
            <a 
              href="https://home.openweathermap.org/users/sign_up" 
              target="_blank" 
              rel="noreferrer"
            >
              Get a free API key at OpenWeatherMap.org <ExternalLink size={12} />
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
