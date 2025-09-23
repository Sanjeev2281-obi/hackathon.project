import { useState } from "react";
import LocationPicker from "../Components/LoctionPicker";
import WeatherCard from "../components/WeatherCard";
import { getWeather } from "../api/weather";

export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLocationSelect(latlng) {
    setLoading(true);
    try {
      const data = await getWeather(latlng.lat, latlng.lng);
      setWeather(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching weather");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">
        🌾 Agriculture Weather App
      </h1>
      <p className="text-gray-600 mb-4 text-center">
        Select your farmland location on the map to see real-time weather.
      </p>

      <LocationPicker onLocationSelect={handleLocationSelect} />

      {loading && <p className="text-center mt-4">Loading weather...</p>}
      {!loading && <WeatherCard weather={weather} />}
    </div>
  );
}
