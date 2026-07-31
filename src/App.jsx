import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import WeatherDetails from './components/WeatherDetails';
import ForecastView from './components/ForecastView';
import ErrorMessage from './components/ErrorMessage';
import ApiKeyModal from './components/ApiKeyModal';
import FavoritesDrawer from './components/FavoritesDrawer';
import MongoHistory from './components/MongoHistory';

import { getWeatherData, getGeoWeatherData } from './services/weatherApi';
import { 
  getMongoStatus, 
  getFavorites, 
  saveFavorite, 
  deleteFavorite, 
  getMongoSearchHistory, 
  logSearchToMongo 
} from './services/mongoApi';

import './App.css';

export default function App() {
  const [city, setCity] = useState('London');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric'); // 'metric' (°C) or 'imperial' (°F)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('sky_pulse_api_key') || '');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // MongoDB States
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [mongoHistory, setMongoHistory] = useState([]);

  // Check MongoDB connection & load initial DB data
  const refreshMongoData = useCallback(async () => {
    const status = await getMongoStatus();
    setIsDbConnected(status.connected);

    const favs = await getFavorites();
    setFavorites(favs);

    const hist = await getMongoSearchHistory();
    setMongoHistory(hist);
  }, []);

  useEffect(() => {
    refreshMongoData();
  }, [refreshMongoData]);

  const fetchWeatherForCity = useCallback(async (searchCity, currentUnit = unit) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherData(searchCity, apiKey, currentUnit);
      setWeather(data);
      setCity(data.name);

      // Log successful search to MongoDB
      await logSearchToMongo({
        query: searchCity,
        cityName: data.name,
        country: data.country,
        temp: data.temp,
        condition: data.condition
      });

      // Refresh search history timeline
      const updatedHist = await getMongoSearchHistory();
      setMongoHistory(updatedHist);
    } catch (err) {
      console.error('Fetch error:', err);
      setWeather(null);
      setError(err.message || 'An error occurred while fetching weather data.');
    } finally {
      setLoading(false);
    }
  }, [apiKey, unit]);

  // Initial fetch on mount
  useEffect(() => {
    fetchWeatherForCity('London', 'metric');
  }, [fetchWeatherForCity]);

  const handleSearch = (newCity) => {
    fetchWeatherForCity(newCity, unit);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await getGeoWeatherData(latitude, longitude, apiKey, unit);
          setWeather(data);
          setCity(data.name);

          await logSearchToMongo({
            query: 'My Location',
            cityName: data.name,
            country: data.country,
            temp: data.temp,
            condition: data.condition
          });

          const updatedHist = await getMongoSearchHistory();
          setMongoHistory(updatedHist);
        } catch (err) {
          setError(err.message || 'Failed to fetch weather for your current location.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setError('Location access denied. Please type a city name in the search bar.');
      }
    );
  };

  const handleToggleUnit = () => {
    const nextUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(nextUnit);
    if (city && weather) {
      fetchWeatherForCity(city, nextUnit);
    }
  };

  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    localStorage.setItem('sky_pulse_api_key', newKey);
    if (city) {
      fetchWeatherForCity(city, unit);
    }
  };

  const isCurrentFavorite = Boolean(
    weather && favorites.some(f => f.cityName.toLowerCase() === weather.name.toLowerCase())
  );

  const handleToggleFavorite = async (targetWeather) => {
    if (!targetWeather) return;
    const exists = favorites.some(f => f.cityName.toLowerCase() === targetWeather.name.toLowerCase());
    
    if (exists) {
      await deleteFavorite(targetWeather.name);
    } else {
      await saveFavorite({
        cityName: targetWeather.name,
        country: targetWeather.country,
        lastTemp: targetWeather.temp,
        condition: targetWeather.condition,
        icon: targetWeather.icon
      });
    }

    const updatedFavs = await getFavorites();
    setFavorites(updatedFavs);
  };

  const handleDeleteFavorite = async (cityName) => {
    await deleteFavorite(cityName);
    const updatedFavs = await getFavorites();
    setFavorites(updatedFavs);
  };

  // Determine dynamic background theme
  const getThemeClass = () => {
    if (error || !weather) return 'theme-clear';
    switch (weather.condition?.toLowerCase()) {
      case 'clouds':
        return 'theme-clouds';
      case 'rain':
      case 'drizzle':
        return 'theme-rain';
      case 'thunderstorm':
        return 'theme-thunderstorm';
      case 'snow':
        return 'theme-snow';
      case 'mist':
      case 'fog':
      case 'haze':
        return 'theme-fog';
      default:
        return 'theme-clear';
    }
  };

  return (
    <div className={`app-wrapper ${getThemeClass()}`}>
      <div className="ambient-glow"></div>

      <div className="main-container">
        <Navbar 
          unit={unit}
          onToggleUnit={handleToggleUnit}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          isUsingLiveKey={Boolean(apiKey)}
          isDbConnected={isDbConnected}
        />

        <SearchBar 
          onSearch={handleSearch}
          onUseLocation={handleUseLocation}
          isLoading={loading}
          currentCity={city}
        />

        <FavoritesDrawer 
          favorites={favorites}
          onSelectCity={handleSearch}
          onDeleteFavorite={handleDeleteFavorite}
          isDbConnected={isDbConnected}
        />

        {error ? (
          <ErrorMessage 
            message={error} 
            onRetryPopular={(cityName) => fetchWeatherForCity(cityName, unit)} 
          />
        ) : (
          weather && (
            <div className="weather-layout">
              <WeatherCard 
                weather={weather} 
                isFavorite={isCurrentFavorite}
                onToggleFavorite={handleToggleFavorite}
              />
              <WeatherDetails weather={weather} />
              <ForecastView forecast={weather.forecast} unit={unit} />
            </div>
          )
        )}

        <MongoHistory 
          history={mongoHistory}
          onSelectCity={handleSearch}
          isDbConnected={isDbConnected}
        />
      </div>

      <ApiKeyModal 
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentApiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />
    </div>
  );
}
