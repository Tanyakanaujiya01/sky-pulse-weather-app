import React from 'react';
import { Star, Trash2, MapPin, Database } from 'lucide-react';

export default function FavoritesDrawer({ favorites, onSelectCity, onDeleteFavorite, isDbConnected }) {
  if (!favorites || favorites.length === 0) return null;

  return (
    <div className="favorites-container glass-panel animate-fade-in">
      <div className="favorites-header">
        <div className="flex-center gap-2">
          <Star className="text-amber" size={18} />
          <h3 className="favorites-title">MongoDB Saved Favorites</h3>
        </div>
        <span className="db-badge">
          <Database size={12} /> {isDbConnected ? 'MongoDB Live' : 'Local Synced'}
        </span>
      </div>

      <div className="favorites-grid">
        {favorites.map((item) => (
          <div key={item.cityName} className="favorite-card">
            <div className="fav-info" onClick={() => onSelectCity(item.cityName)}>
              <div className="fav-title">
                <MapPin size={14} className="text-accent" />
                <span className="fav-name">{item.cityName}</span>
                {item.country && <span className="fav-country">{item.country}</span>}
              </div>
              <span className="fav-condition">{item.condition}</span>
            </div>

            <div className="fav-right">
              {item.lastTemp !== undefined && (
                <span className="fav-temp">{Math.round(item.lastTemp)}°</span>
              )}
              <button 
                className="fav-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFavorite(item.cityName);
                }}
                title="Remove from MongoDB Favorites"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
