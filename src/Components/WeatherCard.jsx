// src/components/WeatherCard.jsx
export default function WeatherCard({ weather }) {
  if (!weather) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md mx-auto mt-4">
      <h2 className="text-xl font-bold mb-2">
        🌍 {weather.name}, {weather.sys.country}
      </h2>
      <p className="text-gray-600 font-bold">🌡️ Temp: {weather.main.temp} °C</p>
      <p className="text-gray-600 font-bold">
        🌤️ Condition: {weather.weather[0].description}
      </p>
      <p className="text-gray-600 font-bold">💧 Humidity: {weather.main.humidity}%</p>
      <p className="text-gray-600 font-bold">💨 Wind: {weather.wind.speed} m/s</p>
    </div>
  );
}
