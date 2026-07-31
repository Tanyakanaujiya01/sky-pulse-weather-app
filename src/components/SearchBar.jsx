import React, { useState } from 'react';
import { Search, MapPin, X, Navigation } from 'lucide-react';

const QUICK_CITIES = ['London', 'New York', 'Tokyo', 'Paris', 'Mumbai', 'Sydney'];

export default function SearchBar({ onSearch, onUseLocation, isLoading, currentCity }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleQuickSelect = (city) => {
    setQuery(city);
    onSearch(city);
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="search-section">
      <form onSubmit={handleSubmit} className="search-bar-form">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search for a city (e.g., London, Tokyo, New York)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
          />
          {query && (
            <button type="button" className="clear-btn" onClick={handleClear}>
              <X size={16} />
            </button>
          )}
        </div>

        <button 
          type="button" 
          className="location-btn" 
          onClick={onUseLocation}
          title="Use current location"
          disabled={isLoading}
        >
          <Navigation size={18} />
          <span className="location-btn-text">My Location</span>
        </button>

        <button 
          type="submit" 
          className="search-btn"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? (
            <span className="spinner"></span>
          ) : (
            'Search'
          )}
        </button>
      </form>

      <div className="quick-cities">
        <span className="quick-cities-label">Popular:</span>
        <div className="quick-cities-pills">
          {QUICK_CITIES.map((city) => (
            <button
              key={city}
              className={`city-pill ${currentCity?.toLowerCase() === city.toLowerCase() ? 'active' : ''}`}
              onClick={() => handleQuickSelect(city)}
            >
              <MapPin size={12} />
              <span>{city}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
