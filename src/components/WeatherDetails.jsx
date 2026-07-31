import React from 'react';
import { 
  Wind, 
  Droplets, 
  Gauge, 
  Eye, 
  Cloud, 
  Sunrise, 
  Sunset,
  Compass
} from 'lucide-react';

export default function WeatherDetails({ weather }) {
  if (!weather) return null;

  const {
    wind_speed,
    wind_deg,
    humidity,
    pressure,
    visibility,
    clouds,
    sunrise,
    sunset,
    unit
  } = weather;

  const windUnit = unit === 'imperial' ? 'mph' : 'm/s';
  const visibilityKm = visibility ? (visibility / 1000).toFixed(1) : '10';

  // Helper for wind compass direction
  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  const windDir = getWindDirection(wind_deg || 0);

  return (
    <div className="weather-details-grid">
      {/* Wind Speed Card */}
      <div className="detail-card glass-panel">
        <div className="detail-header">
          <div className="detail-icon-wrapper wind-bg">
            <Wind size={20} className="detail-icon" />
          </div>
          <span className="detail-label">Wind Speed</span>
        </div>
        <div className="detail-body">
          <span className="detail-value">{wind_speed} <span className="detail-unit">{windUnit}</span></span>
          <div className="detail-subtext flex-center">
            <Compass size={14} style={{ transform: `rotate(${wind_deg}deg)` }} className="compass-icon" />
            <span>Direction: {windDir} ({wind_deg}°)</span>
          </div>
        </div>
      </div>

      {/* Humidity Card */}
      <div className="detail-card glass-panel">
        <div className="detail-header">
          <div className="detail-icon-wrapper humidity-bg">
            <Droplets size={20} className="detail-icon" />
          </div>
          <span className="detail-label">Humidity</span>
        </div>
        <div className="detail-body">
          <span className="detail-value">{humidity}<span className="detail-unit">%</span></span>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${humidity}%` }}></div>
          </div>
          <span className="detail-subtext">
            {humidity > 70 ? 'High Humidity' : humidity < 30 ? 'Low Humidity' : 'Comfortable'}
          </span>
        </div>
      </div>

      {/* Pressure Card */}
      <div className="detail-card glass-panel">
        <div className="detail-header">
          <div className="detail-icon-wrapper pressure-bg">
            <Gauge size={20} className="detail-icon" />
          </div>
          <span className="detail-label">Pressure</span>
        </div>
        <div className="detail-body">
          <span className="detail-value">{pressure} <span className="detail-unit">hPa</span></span>
          <span className="detail-subtext">
            {pressure > 1013 ? 'High Pressure' : 'Normal / Low'}
          </span>
        </div>
      </div>

      {/* Visibility Card */}
      <div className="detail-card glass-panel">
        <div className="detail-header">
          <div className="detail-icon-wrapper visibility-bg">
            <Eye size={20} className="detail-icon" />
          </div>
          <span className="detail-label">Visibility</span>
        </div>
        <div className="detail-body">
          <span className="detail-value">{visibilityKm} <span className="detail-unit">km</span></span>
          <span className="detail-subtext">
            {Number(visibilityKm) >= 10 ? 'Clear Vision' : 'Reduced Visibility'}
          </span>
        </div>
      </div>

      {/* Cloud Cover Card */}
      <div className="detail-card glass-panel">
        <div className="detail-header">
          <div className="detail-icon-wrapper cloud-bg">
            <Cloud size={20} className="detail-icon" />
          </div>
          <span className="detail-label">Cloudiness</span>
        </div>
        <div className="detail-body">
          <span className="detail-value">{clouds}<span className="detail-unit">%</span></span>
          <div className="progress-bar-container">
            <div className="progress-bar-fill cloud-fill" style={{ width: `${clouds}%` }}></div>
          </div>
          <span className="detail-subtext">
            {clouds > 80 ? 'Overcast Sky' : clouds > 30 ? 'Partly Cloudy' : 'Clear Sky'}
          </span>
        </div>
      </div>

      {/* Sunrise & Sunset Card */}
      <div className="detail-card glass-panel span-full-sm">
        <div className="detail-header">
          <span className="detail-label">Sun & Solar Cycle</span>
        </div>
        <div className="sun-cycle-container">
          <div className="sun-item">
            <Sunrise size={22} className="sun-icon rise" />
            <div>
              <span className="sun-label">Sunrise</span>
              <span className="sun-time">{sunrise}</span>
            </div>
          </div>
          <div className="sun-divider"></div>
          <div className="sun-item">
            <Sunset size={22} className="sun-icon set" />
            <div>
              <span className="sun-label">Sunset</span>
              <span className="sun-time">{sunset}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
