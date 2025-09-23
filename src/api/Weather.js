export async function getWeather(lat, lon) {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;


  const response = await fetch(url);
  if (!response.ok) {
    console.error("HTTP error", response.status, response.statusText);
    throw new Error("Failed to fetch weather data");
  }
  return response.json();
}
