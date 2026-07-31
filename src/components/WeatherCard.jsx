import React from 'react';
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Snowflake, 
  CloudFog, 
  ArrowUp, 
  ArrowDown, 
  MapPin,
  Calendar,
  Clock,
  Star
} from 'lucide-react';

export default function WeatherCard({ weather, isFavorite, onToggleFavorite }) {
  if (!weather) return null;

  const {
    name,
    country,
    temp,
    feels_like,
    temp_min,
    temp_max,
    condition,
    description,
    localTimeFormatted,
    localDateFormatted,
    unit
  } = weather;

  const unitSymbol = unit === 'imperial' ? '°F' : '°C';

  // Select dynamic weather icon & animation wrapper class
  const getWeatherIcon = (cond) => {
    switch (cond?.toLowerCase()) {
      case 'clear':
        return <Sun className="weather-svg sunny" size={88} />;
      case 'clouds':
        return <CloudSun className="weather-svg cloudy" size={88} />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="weather-svg rainy" size={88} />;
      case 'thunderstorm':
        return <CloudLightning className="weather-svg stormy" size={88} />;
      case 'snow':
        return <Snowflake className="weather-svg snowy" size={88} />;
      case 'mist':
      case 'fog':
      case 'haze':
        return <CloudFog className="weather-svg foggy" size={88} />;
      default:
        return <Cloud className="weather-svg" size={88} />;
    }
  };

  return (
    <div className="weather-card glass-panel animate-fade-in">
      <div className="card-header">
        <div className="location-info">
          <h2 className="city-title">
            <MapPin className="city-pin-icon" size={24} />
            <span>{name}</span>
            {country && <span className="country-flag">{country}</span>}
            
            <button 
              className={`fav-star-btn ${isFavorite ? 'active' : ''}`}
              onClick={() => onToggleFavorite(weather)}
              title={isFavorite ? 'Remove from MongoDB Favorites' : 'Save to MongoDB Favorites'}
            >
              <Star size={20} fill={isFavorite ? '#fbbf24' : 'none'} />
            </button>
          </h2>
          <div className="date-time-wrapper">
            <span className="info-pill">
              <Calendar size={13} />
              {localDateFormatted}
            </span>
            <span className="info-pill">
              <Clock size={13} />
              {localTimeFormatted}
            </span>
          </div>
        </div>
        <div className="weather-condition-tag">
          {condition}
        </div>
      </div>

      <div className="card-main-body">
        <div className="temp-display">
          <div className="main-temp-val">
            <span className="number">{temp}</span>
            <span className="unit">{unitSymbol}</span>
          </div>
          <p className="condition-desc">{description}</p>
        </div>

        <div className="weather-icon-wrapper">
          {getWeatherIcon(condition)}
        </div>
      </div>

      <div className="card-footer-stats">
        <div className="sub-stat">
          <span className="sub-stat-label">Feels Like</span>
          <span className="sub-stat-value">{feels_like}{unitSymbol}</span>
        </div>
        <div className="stat-divider"></div>
        <div className="sub-stat">
          <span className="sub-stat-label">High / Low</span>
          <span className="sub-stat-value flex-center">
            <ArrowUp size={14} className="temp-up" /> {temp_max}° / <ArrowDown size={14} className="temp-down" /> {temp_min}°
          </span>
        </div>
      </div>
    </div>
  );
}
