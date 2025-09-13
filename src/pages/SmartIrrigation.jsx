import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplet, Thermometer, Power, Clock } from "lucide-react";

export default function SmartIrrigation() {
  // 🌱 States
  const [irrigationOn, setIrrigationOn] = useState(false);
  const [threshold, setThreshold] = useState(40);
  const [search, setSearch] = useState("");
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // 📊 Sensor states (simulate real sensors)
  const [soilMoisture, setSoilMoisture] = useState(45);
  const [waterLevel, setWaterLevel] = useState(70);
  const [temperature, setTemperature] = useState(28);

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

  // ✅ Crop list
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

  // 🔎 Search filter
  const filteredCrops =
    search.trim() === ""
      ? cropNames
      : cropNames.filter((crop) =>
        crop.toLowerCase().includes(search.toLowerCase())
      );

  // ⏳ Handle irrigation timer countdown
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
    if (!str) return 600; // default 10 mins
    const num = parseInt(str);
    return isNaN(num) ? 600 : num * 60;
  };

  // 🟢 Toggle irrigation
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
      autoStart: "🌱 Soil moisture is low! Auto irrigation started."
    },
    ta: {
      soil: "மண் ஈரப்பதம்",
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
      the:"மண் ஈரப்பதம் எல்லை (%)",
      setting:"அமைப்புகள்"
    }
  };
  const [language, setLanguage] = useState("en");
  const t = translations[language]; // shorthand

  return (
    <div className="p-6 space-y-6">
     <div className="rounded-2xl bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg p-10 text-center">
  <h1 className="text-5xl font-extrabold tracking-wide drop-shadow-lg animate-pulse">
    🌱 Crop Monitoring Dashboard
  </h1>
  <p className="mt-4 text-lg text-gray-100">
    Real-time insights for your smart irrigation system
  </p>
</div>

      {/* 🌍 Dashboard */}
        <div className="flex justify-end mb-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="en">English</option>
            <option value="ta">தமிழ்</option>
          </select>
        </div>
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

          {/* 🚨 Warning if moisture is low */}
          {soilMoisture < threshold && (
            <p className="mt-2 text-sm font-semibold text-red-500">
              ⚠️ Soil moisture is low!
            </p>
          )}
        </div>

        {/* Water Level */}
        <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
          <Droplet className="mx-auto text-green-500 w-12 h-12 mb-2" />
          <h2 className="text-lg font-semibold">{t.water}</h2>
          <p className="text-2xl font-bold text-green-600">{waterLevel.toFixed(1)}%</p>
        </div>

        {/* Temperature */}
        <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
          <Thermometer className="mx-auto text-orange-500 w-12 h-12 mb-2" />
          <h2 className="text-lg font-semibold">{t.temp}</h2>
          <p className="text-2xl font-bold text-orange-600">{temperature.toFixed(1)}°C</p>
        </div>

        {/* Irrigation Control with Timer */}
        {/* Irrigation Control with Timer + Animation */}
        <div className="bg-white rounded-2xl p-6 text-center shadow-lg relative overflow-hidden">
          <Power
            className={`mx-auto w-12 h-12 mb-2 ${irrigationOn ? "text-red-500" : "text-gray-500"
              }`}
          />
          <h2 className="text-lg font-semibold">{t.irrigation}</h2>

          {/* Timer */}
          {irrigationOn && (
            <div className="flex items-center justify-center gap-2 text-lg font-bold text-gray-700 mb-2">
              <Clock className="w-5 h-5" /> {formatTime(timer)}
            </div>
          )}

          {/* 🚿 Water flow animation */}
          {irrigationOn && (
            <motion.div
              className="absolute bottom-0 left-0 w-full h-1/2 bg-blue-300 opacity-50"
              initial={{ y: "100%" }}
              animate={{ y: ["100%", "0%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}

          {/* 💧 Droplet animation */}
          {irrigationOn && (
            <motion.div
              className="absolute top-0 left-1/2 text-blue-500 text-3xl"
              animate={{ y: ["0%", "120%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeIn" }}
            >
              💧
            </motion.div>
          )}

          {/* Button */}
          <button
            onClick={handleIrrigation}
            className={`mt-3 px-4 py-2 rounded-xl font-bold shadow-md relative z-10 ${irrigationOn ? "bg-red-500 text-white" : "bg-green-500 text-white"
              }`}
          >
           {irrigationOn ? t.stop : t.start}
          </button>
        </div>

      </motion.div>

      {/* ⚙️ Settings */}
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">⚙️{t.settings}</h2>

        {/* Threshold */}
        <label className="block font-medium mb-2">
         {t.the}
        </label>
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="border rounded-lg p-2 w-full mb-4"
        />

        {/* Search bar + Show all */}
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

        {/* Crop list */}
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

        {/* Show selected crop details */}
        {selectedCrop && (
          <div className="mb-4 p-3 border rounded-lg bg-green-50 text-center">
            <p>🌱 <b>{selectedCrop}</b></p>
            <p>💧 Water Flow: {crops[selectedCrop].flow}</p>
            <p>📊 Water Level: {crops[selectedCrop].level}</p>

            {/* 🌿 Growing animation */}
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
    </div>
  );
}
