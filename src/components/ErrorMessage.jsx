import React from 'react';
import { AlertTriangle, Search, Compass } from 'lucide-react';

export default function ErrorMessage({ message, onRetryPopular }) {
  return (
    <div className="error-card glass-panel animate-fade-in">
      <div className="error-icon-container">
        <AlertTriangle size={42} className="error-icon" />
      </div>
      <div className="error-content">
        <h3 className="error-title">City Not Found</h3>
        <p className="error-description">{message || "The searched city is not found."}</p>
        
        <div className="error-tips">
          <p className="error-tips-title">Troubleshooting Suggestions:</p>
          <ul>
            <li>Check for spelling errors or typos in the city name.</li>
            <li>Include country code for specific locations (e.g., "Paris, FR" or "Springfield, US").</li>
            <li>Ensure you entered a valid city rather than a landmark or ZIP code.</li>
          </ul>
        </div>

        <div className="error-actions">
          <button className="error-retry-btn" onClick={() => onRetryPopular('London')}>
            <Compass size={16} />
            <span>Try Searching "London"</span>
          </button>
          <button className="error-retry-btn secondary" onClick={() => onRetryPopular('Tokyo')}>
            <Search size={16} />
            <span>Try "Tokyo"</span>
          </button>
        </div>
      </div>
    </div>
  );
}
