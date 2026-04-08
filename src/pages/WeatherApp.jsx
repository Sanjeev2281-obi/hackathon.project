import { useRef, useState } from "react";
import LocationPicker from "../Components/LoctionPicker"; // fix typo too
import WeatherCard from "../Components/WeatherCard";
import { getWeather } from "../api/Weather";

export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(""); // search input
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // default India
  const weatherRef = useRef(null); // 🔹 ref for weather section
  

  async function handleLocationSelect(latlng) {
    setLoading(true);
    try {
      const data = await getWeather(latlng.lat, latlng.lng);
      setWeather(data);
      setMapCenter([latlng.lat, latlng.lng]); // update map center

      // 🔹 Scroll to weather section
      setTimeout(() => {
        weatherRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (err) {
      console.error(err);
      alert("Error fetching weather");
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Handle search submit
//   async function handleLocationSelect(latlng) {
//   setLoading(true);
//   try {
//     const data = await getWeather(latlng.lat, latlng.lng);

//     // ✅ Extract only needed values
//     const weatherData = {
//       temp: data.main.temp,
//       humidity: data.main.humidity,
//       rain: data.rain?.["1h"] || 0
//     };

//     setWeather(weatherData); // ✅ store clean data
//     setMapCenter([latlng.lat, latlng.lng]);

//     // ✅ CALL CROP LOGIC HERE
//     const crops = suggestCrops(weatherData, 45); // soil = 45 (temporary)
//     setSuggestions(crops);

//     // scroll
//     setTimeout(() => {
//       weatherRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, 300);

//   } catch (err) {
//     console.error(err);
//     alert("Error fetching weather");
//   } finally {
//     setLoading(false);
//   }
// }
  async function handleSearch(e) {
    e.preventDefault();
    if (!search) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          search
        )}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        handleLocationSelect({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        alert("Location not found!");
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  }

  return (
    <div className="bg-white bg-center min-h-screen">
      <div className="p-6 max-w-3xl mx-auto bg-white/80 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">
          🌾 Select your Location
        </h1>
        <p className="text-gray-600 mb-4 text-center">
          Select your farmland location on the map or search by place name.
        </p>

        {/* 🔹 Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4 justify-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter city or village..."
            className="border border-gray-400 p-3 rounded w-2/3"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 rounded hover:bg-green-600"
          >
            Search
          </button>
        </form>

        {/* 🔹 Map Component */}
        <LocationPicker
          onLocationSelect={handleLocationSelect}
          center={mapCenter}
        />

        {/* 🔹 Weather Section */}
        <div ref={weatherRef} className="mt-6">
          {loading && <p className="text-center">Loading weather...</p>}
          {!loading && weather && <WeatherCard weather={weather} />}
        </div>
      </div>
    </div>
  );
}
    