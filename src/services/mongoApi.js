// MongoDB Client API Service with LocalStorage Fallback

const BACKEND_URL = 'http://localhost:5000/api';

/**
 * Check backend MongoDB status
 */
export async function getMongoStatus() {
  try {
    const res = await fetch(`${BACKEND_URL}/health`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      return { connected: data.dbConnected, status: data.dbState };
    }
  } catch (err) {
    console.debug('Server status check offline:', err);
  }
  return { connected: false, status: 'offline' };
}

/**
 * Fetch favorite cities from MongoDB
 */
export async function getFavorites() {
  try {
    const res = await fetch(`${BACKEND_URL}/favorites`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('MongoDB API offline, using local storage fallback for favorites.', err);
  }

  // LocalStorage fallback
  const local = localStorage.getItem('sky_pulse_favs');
  return local ? JSON.parse(local) : [];
}

/**
 * Save favorite city to MongoDB
 */
export async function saveFavorite(favData) {
  try {
    const res = await fetch(`${BACKEND_URL}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(favData),
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('MongoDB API offline, saving favorite locally.', err);
  }

  // LocalStorage fallback
  const list = await getFavorites();
  const exists = list.some(item => item.cityName.toLowerCase() === favData.cityName.toLowerCase());
  let updatedList;
  if (exists) {
    updatedList = list.map(item => item.cityName.toLowerCase() === favData.cityName.toLowerCase() ? { ...item, ...favData } : item);
  } else {
    updatedList = [{ ...favData, addedAt: new Date() }, ...list];
  }
  localStorage.setItem('sky_pulse_favs', JSON.stringify(updatedList));
  return favData;
}

/**
 * Remove favorite city from MongoDB
 */
export async function deleteFavorite(cityName) {
  try {
    const res = await fetch(`${BACKEND_URL}/favorites/${encodeURIComponent(cityName)}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) {
      return true;
    }
  } catch (err) {
    console.warn('MongoDB API offline, deleting favorite locally.', err);
  }

  // LocalStorage fallback
  const list = await getFavorites();
  const updatedList = list.filter(item => item.cityName.toLowerCase() !== cityName.toLowerCase());
  localStorage.setItem('sky_pulse_favs', JSON.stringify(updatedList));
  return true;
}

/**
 * Fetch search history logs from MongoDB
 */
export async function getMongoSearchHistory() {
  try {
    const res = await fetch(`${BACKEND_URL}/history`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('MongoDB API offline, using local storage fallback for search history.', err);
  }

  // LocalStorage fallback
  const local = localStorage.getItem('sky_pulse_history');
  return local ? JSON.parse(local) : [];
}

/**
 * Log search query to MongoDB
 */
export async function logSearchToMongo(searchData) {
  try {
    const res = await fetch(`${BACKEND_URL}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(searchData),
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.debug('Log search fallback:', err);
    // LocalStorage fallback
    const list = await getMongoSearchHistory();
    const updated = [{ ...searchData, searchedAt: new Date() }, ...list].slice(0, 15);
    localStorage.setItem('sky_pulse_history', JSON.stringify(updated));
  }
}
