import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplet, Thermometer, Power, Clock } from "lucide-react";
import { Battery } from "lucide-react";

import WeatherApp from "./WeatherApp";



export default function SmartIrrigation() {
  // 🌱 States
  const [irrigationOn, setIrrigationOn] = useState(false);
  const [threshold, setThreshold] = useState(40);
  const [search, setSearch] = useState("");
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // 📊 Sensor states (simulate real sensors)
  const [soilMoisture, setSoilMoisture] = useState(45);

  const [temperature, setTemperature] = useState(28);
  const [tankLevel, setTankLevel] = useState(100);


  // ⏱️ Irrigation timer (in seconds)
  const [timer, setTimer] = useState(0);

  // 🔄 Simulate sensor updates every 3 sec
  useEffect(() => {
    const interval = setInterval(() => {
      setSoilMoisture((v) => Math.max(0, Math.min(100, v + (Math.random() * 4 - 2))));
      setWaterLevel((v) => Math.max(0, Math.min(100, v + (Math.random() * 4 - 2))));
      setTemperature((v) => Math.max(15, Math.min(40, v + (Math.random() * 2 - 1))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);


  const crops = {
    "Rice (Paddy)": { flow: "50 mins", level: "High" },
    Maize: { flow: "40 mins", level: "Medium" },
    "Jowar (Sorghum)": { flow: "35 mins", level: "Medium" },
    "Bajra (Pearl millet)": { flow: "30 mins", level: "Low" },
    "Ragi (Finger millet)": { flow: "25 mins", level: "Low" },
    Cotton: { flow: "45 mins", level: "Medium" },
    Groundnut: { flow: "30 mins", level: "Low" },
    Soybean: { flow: "35 mins", level: "Medium" },
    "Sugarcane (year-round)": { flow: "60 mins", level: "High" },
    "Tur (Pigeon pea)": { flow: "30 mins", level: "Medium" },
    "Moong (Green gram)": { flow: "25 mins", level: "Low" },
    "Urad (Black gram)": { flow: "25 mins", level: "Low" },
    Wheat: { flow: "30 mins", level: "Medium" },
    Barley: { flow: "28 mins", level: "Low" },
    "Gram (Chana)": { flow: "25 mins", level: "Low" },
    Peas: { flow: "20 mins", level: "Low" },
    "Masoor (Lentil)": { flow: "25 mins", level: "Low" },
    Mustard: { flow: "30 mins", level: "Medium" },
    Linseed: { flow: "28 mins", level: "Low" },
    Jute: { flow: "55 mins", level: "High" },
    Tobacco: { flow: "35 mins", level: "Medium" },
    "Oilseeds (Mustard, Groundnut, Sunflower, Soybean, Castor, Sesame)": {
      flow: "40 mins",
      level: "Medium",
    },
  };

  const cropNames = Object.keys(crops);


  const filteredCrops =
    search.trim() === ""
      ? cropNames
      : cropNames.filter((crop) =>
        crop.toLowerCase().includes(search.toLowerCase())
      );

  //  irrigation timer
  useEffect(() => {
    if (irrigationOn && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (irrigationOn && timer === 0) {
      setIrrigationOn(false);
      alert("⏰ Irrigation completed!");
    }
  }, [irrigationOn, timer]);

  // Convert "30 mins" → seconds
  const parseMinutes = (str) => {
    if (!str) return 600;
    const num = parseInt(str);
    return isNaN(num) ? 600 : num * 60;
  };

  // Toggle irrigation
  const handleIrrigation = () => {
    if (!irrigationOn) {
      const cropTime = selectedCrop ? crops[selectedCrop].flow : "10 mins";
      setTimer(parseMinutes(cropTime));
      setIrrigationOn(true);
    } else {
      setIrrigationOn(false);
      setTimer(0);
    }
  };

  // Format timer (mm:ss)
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // 💾 Save selected crop
  const handleSave = () => {
    if (selectedCrop) {
      alert(`✅ Saved settings for ${selectedCrop}!\nWater Flow: ${crops[selectedCrop].flow}`);
    } else {
      alert("⚠️ Please select a crop before saving!");
    }
  };
  useEffect(() => {
    if (soilMoisture < threshold && !irrigationOn) {
      // Auto-start irrigation with default or selected crop
      const cropTime = selectedCrop ? crops[selectedCrop].flow : "10 mins";
      setTimer(parseMinutes(cropTime));
      setIrrigationOn(true);
      alert("🌱 Soil moisture is low! Auto irrigation started.");
    }
  }, [soilMoisture, threshold, irrigationOn, selectedCrop]);
  // ⏳ Handle irrigation timer countdown + tank ↔ field connection

  useEffect(() => {
    if (irrigationOn && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((t) => t - 1);

        // ⬇️ Decrease tank level
        setTankLevel((prev) => Math.max(0, prev - 0.1));

        // ⬆️ Increase field water level
        setWaterLevel((prev) => Math.min(100, prev + 0.1));
      }, 1000);

      return () => clearInterval(countdown);
    } else if (irrigationOn && timer === 0) {
      setIrrigationOn(false);
      alert("⏰ Irrigation completed!");
    }
  }, [irrigationOn, timer]);



  const translations = {
    en: {
      soil: "Soil Moisture",
      water: "Water Level",
      temp: "Temperature",
      irrigation: "Irrigation",
      start: "Start",
      stop: "Stop",
      settings: "Settings",
      threshold: "Soil Moisture Threshold (%)",
      search: "Search for a crop...",
      save: "Save",
      saved: "✅ Saved settings for",
      warning: "⚠️ Soil moisture is low!",
      completed: "⏰ Irrigation completed!",
      autoStart: "🌱 Soil moisture is low! Auto irrigation started.",
      lang: "Select Language",
      battery: "battery Level"
    },
    ta: {
      soil: "மண் ஈரப்பதம்",
      lang: "மொழியை தேர்ந்தெடுக்கவும்",
      water: "தண்ணீர் நிலை",
      temp: "வெப்பநிலை",
      irrigation: "நீர்ப்பாசனம்",
      start: "தொடங்கு",
      stop: "நிறுத்து",
      settings: "அமைப்புகள்",
      threshold: "மண் ஈரப்பதம் எல்லை (%)",
      search: "பயிரை தேடவும்...",
      save: "சேமி",
      saved: "✅ பயிர் சேமிக்கப்பட்டது:",
      warning: "⚠️ மண் ஈரப்பதம் குறைந்துள்ளது!",
      completed: "⏰ நீர்ப்பாசனம் முடிந்தது!",
      autoStart: "🌱 மண் ஈரப்பதம் குறைந்தது! தானாக நீர்ப்பாசனம் தொடங்கப்பட்டது.",
      the: "மண் ஈரப்பதம் எல்லை (%)",
      setting: "அமைப்புகள்",
      battery: "பேட்டரி நிலை"
    },
    hi: {
      soil: "मृदा नमी",
      water: "पानी का स्तर",
      temp: "तापमान",
      irrigation: "सिंचाई",
      start: "शुरू करें",
      stop: "रोकें",
      settings: "सेटिंग्स",
      threshold: "मृदा नमी सीमा (%)",
      search: "फसल खोजें...",
      save: "सहेजें",
      saved: "✅ सेटिंग्स सहेज ली गईं",
      warning: "⚠️ मृदा नमी कम है!",
      completed: "⏰ सिंचाई पूरी हुई!",
      autoStart: "🌱 मृदा नमी कम है! ऑटो सिंचाई शुरू हो गई।",
      lang: "भाषा चुनें",
      battery: "बैटरी स्तर"
    }
  };
  const [batteryLevel, setBatteryLevel] = useState(100);

  // Optional: simulate battery drain for testing
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel((prev) => Math.max(0, prev - 0.06));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // inside SmartIrrigation component
  const [language, setLanguage] = useState(localStorage.getItem("lang") || "en");

  const t = translations[language];
  localStorage.removeItem("lang");


  return (
    <div className="p-6 space-y-6  bg-[url('https://thumbs.dreamstime.com/b/rural-farmland-mountain-landscape-countryside-village-illustration-illustration-depicts-serene-rural-landscape-featuring-386114971.jpg')]">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg p-6 sm:p-10 text-center mx-2 sm:mx-auto max-w-6xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide drop-shadow-lg animate-pulse">
          🌱 Crop Monitoring Dashboard
        </h1>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-gray-100">
          Real-time insights for your smart irrigation system
        </p>
      </div>

      {/* Language Selector */}
      <div className="flex justify-end mb-4">
        <h2 className="font-bold m-3">{t.lang}</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="en">English</option>
          <option value="ta">தமிழ்</option>
          <option value="hi">Hindi</option>
        </select>
      </div>

      {/* Sensors & Irrigation Controls */}
      <motion.div
        className="grid md:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Soil Moisture */}
        <div className="bg-white rounded-2xl p-6 text-center shadow-lg relative">
          <Thermometer className="mx-auto text-blue-500 w-12 h-12 mb-2" />
          <h2 className="text-lg font-semibold">{t.soil}</h2>
          <p
            className={`text-2xl font-bold ${soilMoisture < threshold ? "text-red-600" : "text-blue-600"
              }`}
          >
            {soilMoisture.toFixed(1)}%
          </p>
          {soilMoisture < threshold && (
            <p className="mt-2 text-sm font-semibold text-red-500">
              ⚠️{t.warning}
            </p>
          )}
        </div>

        {/* Temperature */}
        <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
          <Thermometer className="mx-auto text-orange-500 w-12 h-12 mb-2" />
          <h2 className="text-lg font-semibold">{t.temp}</h2>
          <p className="text-2xl font-bold text-orange-600">{temperature.toFixed(1)}°C</p>
        </div>

        {/* Battery Level */}
        <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
          <Battery className="mx-auto text-yellow-500 w-12 h-12 mb-2" />
          <h2 className="text-lg font-semibold"> {t.battery}  </h2>
          <p className="text-2xl font-bold text-yellow-600">{batteryLevel.toFixed(1)}%</p>
        </div>

        {/* Irrigation Control */}
        <div className="bg-white rounded-2xl p-6 text-center shadow-lg relative overflow-hidden">
          <Power
            className={`mx-auto w-12 h-12 mb-2 ${irrigationOn ? "text-red-500" : "text-gray-500"
              }`}
          />
          <h2 className="text-lg font-semibold">{t.irrigation}</h2>

          {irrigationOn && (
            <div className="flex items-center justify-center gap-2 text-lg font-bold text-gray-700 mb-2">
              <Clock className="w-5 h-5" /> {formatTime(timer)}
            </div>
          )}

          {irrigationOn && (
            <motion.div
              className="absolute bottom-0 left-0 w-full h-1/2 bg-blue-300 opacity-50"
              initial={{ y: "100%" }}
              animate={{ y: ["100%", "0%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}

          {irrigationOn && (
            <motion.div
              className="absolute top-0 left-1/2 text-blue-500 text-3xl"
              animate={{ y: ["0%", "120%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeIn" }}
            >
              💧
            </motion.div>
          )}

          <button
            onClick={handleIrrigation}
            className={`mt-3 px-4 py-2 rounded-xl font-bold shadow-md relative z-10 ${irrigationOn ? "bg-red-500 text-white" : "bg-green-500 text-white"
              }`}
          >
            {irrigationOn ? t.stop : t.start}
          </button>
        </div>
      </motion.div>

      {/* Crop Database */}
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-5xl mx-auto">
        <h2 className="text-xl font-bold mb-4">🌾 {language === "ta" ? "பயிர் தரவுத்தளம்" : "Crop Database"}</h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Crop List */}
          <div className="flex-1">
            <label className="block font-medium mb-2">{t.threshold}</label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="border rounded-lg p-2 w-full mb-4"
            />

            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Search for a crop..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-lg p-2 w-full"
              />
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-3 py-2 rounded-lg bg-green-100 hover:bg-green-200"
                title="Show all crops"
              >
                🌱
              </button>
            </div>

            {!showAll ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {filteredCrops.map((crop) => (
                  <button
                    key={crop}
                    onClick={() => setSelectedCrop(crop)}
                    className={`px-3 py-1 rounded-full border ${selectedCrop === crop
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 hover:bg-green-100"
                      }`}
                  >
                    {crop}
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {cropNames.map((crop) => (
                  <button
                    key={crop}
                    onClick={() => setSelectedCrop(crop)}
                    className={`p-2 rounded-lg border text-sm ${selectedCrop === crop
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 hover:bg-green-100"
                      }`}
                  >
                    {crop}
                  </button>
                ))}
              </div>
            )}

            {selectedCrop && (
              <div className="mb-4 p-3 border rounded-lg bg-green-50 text-center">
                <p>🌱 <b>{selectedCrop}</b></p>
                <p>💧 Water Flow: {crops[selectedCrop].flow}</p>
                <p>📊 Water Level: {crops[selectedCrop].level}</p>
                <motion.div
                  key={selectedCrop}
                  className="text-4xl mt-3"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  🌱
                </motion.div>
              </div>
            )}

            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md"
            >
              {t.save}
            </button>
          </div>
          {/* 🌧️ Rainwater Harvesting Tank */}
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg relative">
            <h2 className="text-lg font-semibold mb-2">Rainwater Tank</h2>

            {/* Tank Container */}
            <div className="relative w-24 h-32 mx-auto border-4 border-blue-500 rounded-lg overflow-hidden">
              {/* Water Fill */}
              <motion.div
                className="absolute bottom-0 left-0 w-full bg-blue-400"
                animate={{ height: `${tankLevel}%` }}
                transition={{ duration: 1 }}
              />
              {/* Wave Effect */}
              <motion.div
                className="absolute bottom-0 left-0 w-full h-1/2 bg-blue-300 opacity-60"
                animate={{ x: ["0%", "100%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />
            </div>

            {/* Tank Level Text */}
            <p className="mt-3 text-lg font-bold text-blue-700">
              {tankLevel.toFixed(1)}%
            </p>
          </div>
        </div>


      </div>

      {/* Weather Component */}

    </div>

  )
}