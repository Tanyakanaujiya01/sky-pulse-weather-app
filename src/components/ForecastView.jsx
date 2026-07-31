import React from 'react';
import { 
  Sun, 
  CloudSun, 
  CloudRain, 
  CloudLightning, 
  Snowflake, 
  Cloud, 
  Droplet
} from 'lucide-react';

export default function ForecastView({ forecast, unit }) {
  if (!forecast || !forecast.length) return null;

  const unitSymbol = unit === 'imperial' ? '°F' : '°C';

  const getForecastIcon = (cond) => {
    switch (cond?.toLowerCase()) {
      case 'clear':
        return <Sun size={28} className="fc-icon sun" />;
      case 'clouds':
        return <CloudSun size={28} className="fc-icon cloud" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain size={28} className="fc-icon rain" />;
      case 'thunderstorm':
        return <CloudLightning size={28} className="fc-icon storm" />;
      case 'snow':
        return <Snowflake size={28} className="fc-icon snow" />;
      default:
        return <Cloud size={28} className="fc-icon cloud" />;
    }
  };

  return (
    <div className="forecast-container glass-panel">
      <h3 className="forecast-title">5-Day Weather Forecast</h3>
      <div className="forecast-grid">
        {forecast.map((item, idx) => (
          <div key={idx} className="forecast-card">
            <span className="fc-day">{item.day}</span>
            <div className="fc-icon-wrapper">
              {getForecastIcon(item.condition)}
            </div>
            <span className="fc-condition">{item.condition}</span>

            {item.pop > 0 && (
              <span className="fc-pop">
                <Droplet size={11} /> {item.pop}%
              </span>
            )}

            <div className="fc-temp-range">
              <span className="fc-max">{item.max}{unitSymbol}</span>
              <span className="fc-min">{item.min}{unitSymbol}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
