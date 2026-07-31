# 🌤️ SkyPulse - Interactive Real-Time Weather Application

SkyPulse is a full-stack Weather Application built with **ReactJS**, **Node.js**, **Express.js**, and **MongoDB**. It provides real-time weather information, wind speed & 360° direction compass, 5-day weather forecast, city error state notifications, and MongoDB database persistence for user search history and bookmarked favorite cities.

---

## 🛠️ Technology Stack & Badges

![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![NodeJS](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![ExpressJS](https://img.shields.io/badge/Server-Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Build_Tool-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## 🌟 Key Features

- 🔍 **Real-Time Weather Search**: Detailed temperature, feels-like, country flag, local time, min/max range.
- 💨 **Wind Speed & Direction**: Speed (m/s or mph) and interactive 360° rotating compass needle.
- ⚠️ **City Not Found Error Handling**: Displays a clear glassmorphic error card when a city is not found (*"Searched city is not found"*).
- 🍃 **MongoDB Integration**:
  - **`favorites` Collection**: Save bookmarked cities to MongoDB by clicking the ⭐ Star icon.
  - **`search_history` Collection**: Automatically logs every search query with timestamps into MongoDB.
- 📅 **5-Day Weather Forecast**: Rain probability (`pop`), condition icons, and daily min/max temperature range.
- 🌡️ **Unit Switcher**: Seamlessly toggle between **°C** (Celsius) and **°F** (Fahrenheit).
- 📍 **Geolocation**: One-click position detection (*"My Location"*).
- 🎨 **Dynamic Theme Engine**: Background gradients morph based on current weather conditions (Clear, Rain, Clouds, Snow, Thunderstorm, Fog).

---

## 📁 Repository Structure

```text
weather-app/
├── src/                          # Frontend (React 19 + Vite)
│   ├── components/               # UI Cards, Drawers & Navbar
│   ├── services/                 # OpenWeatherMap API & MongoDB REST Client
│   ├── App.jsx                   # React App Container
│   └── App.css                   # Glassmorphic Styles & Animations
│
├── server/                       # Backend (Node.js + Express + MongoDB)
│   ├── server.js                 # Express REST API Server
│   └── models/                   # Mongoose Schemas
│       ├── Favorite.js           # MongoDB Favorite Cities Model
│       └── SearchLog.js          # MongoDB Search History Model
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Tanyakanaujiya01/sky-pulse-weather-app.git
cd sky-pulse-weather-app
```

### 2. Install Frontend Dependencies & Start App
```bash
npm install
npm run dev
```

### 3. Install Backend Dependencies & Start MongoDB Server
```bash
cd server
npm install
npm start
```
