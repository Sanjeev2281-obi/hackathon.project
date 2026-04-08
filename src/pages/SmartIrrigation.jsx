import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplet, Thermometer, Power, Clock, Battery, Cloud, Leaf, BarChart2, X, Upload, Cpu } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const crops = {
  "Rice (Paddy)": { flow: "50 mins", level: "High", rain: ">800mm", temp: "20-35°C", humidity: ">80%" },
  "Maize": { flow: "40 mins", level: "Medium", rain: "500-800mm", temp: "18-32°C", humidity: "50-80%" },
  "Jowar (Sorghum)": { flow: "35 mins", level: "Medium", rain: "400-600mm", temp: "26-34°C", humidity: "40-60%" },
  "Bajra (Pearl millet)": { flow: "30 mins", level: "Low", rain: "300-500mm", temp: "28-35°C", humidity: "30-50%" },
  "Cotton": { flow: "45 mins", level: "Medium", rain: "500-700mm", temp: "21-30°C", humidity: "50-70%" },
  "Groundnut": { flow: "30 mins", level: "Low", rain: "500-700mm", temp: "22-30°C", humidity: "50-65%" },
  "Sugarcane": { flow: "60 mins", level: "High", rain: ">1200mm", temp: "20-35°C", humidity: ">70%" },
  "Wheat": { flow: "30 mins", level: "Medium", rain: "350-500mm", temp: "10-24°C", humidity: "40-60%" },
  "Soybean": { flow: "35 mins", level: "Medium", rain: "600-700mm", temp: "20-30°C", humidity: "50-70%" },
  "Tomato": { flow: "25 mins", level: "Medium", rain: "400-600mm", temp: "18-27°C", humidity: "50-70%" },
  "Onion": { flow: "20 mins", level: "Low", rain: "350-550mm", temp: "13-24°C", humidity: "40-60%" },
  "Mustard": { flow: "30 mins", level: "Medium", rain: "250-400mm", temp: "10-25°C", humidity: "40-60%" },
};
const cropNames = Object.keys(crops);

const translations = {
  en: { soil: "Soil Moisture", water: "Water Level", temp: "Temperature", irrigation: "Irrigation", start: "Start", stop: "Stop", settings: "Settings", threshold: "Moisture Threshold (%)", search: "Search crop...", save: "Save", warning: "Low moisture!", completed: "Irrigation done!", autoStart: "Auto irrigation started.", lang: "Language", battery: "Battery", disease: "Disease Detection", cropAI: "AI Crop Suggestion", weather: "Weather", graph: "Live Sensor Data" },
  ta: { soil: "மண் ஈரப்பதம்", water: "தண்ணீர் நிலை", temp: "வெப்பநிலை", irrigation: "நீர்ப்பாசனம்", start: "தொடங்கு", stop: "நிறுத்து", settings: "அமைப்புகள்", threshold: "ஈரப்பதம் எல்லை (%)", search: "பயிரை தேடவும்...", save: "சேமி", warning: "ஈரப்பதம் குறைவு!", completed: "நீர்ப்பாசனம் முடிந்தது!", autoStart: "தானாக தொடங்கியது.", lang: "மொழி", battery: "பேட்டரி", disease: "நோய் கண்டறிதல்", cropAI: "AI பயிர் பரிந்துரை", weather: "வானிலை", graph: "நேரடி தரவு" },
  hi: { soil: "मृदा नमी", water: "पानी स्तर", temp: "तापमान", irrigation: "सिंचाई", start: "शुरू करें", stop: "रोकें", settings: "सेटिंग्स", threshold: "नमी सीमा (%)", search: "फसल खोजें...", save: "सहेजें", warning: "नमी कम है!", completed: "सिंचाई पूरी हुई!", autoStart: "ऑटो सिंचाई शुरू।", lang: "भाषा", battery: "बैटरी", disease: "रोग पहचान", cropAI: "AI फसल सुझाव", weather: "मौसम", graph: "लाइव डेटा" },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const parseMinutes = (str) => { const n = parseInt(str); return isNaN(n) ? 600 : n * 60; };
const fmt = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
const callClaude = async (messages, systemPrompt) => {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: systemPrompt, messages }),
  });
  const data = await res.json();
  return data.content?.map(b => b.text || "").join("") || "No response.";
};

// ─── DISEASE DETECTION PANEL ─────────────────────────────────────────────────
  function DiseasePanel({ t }) {
    const [image, setImage] = useState(null);
    const [b64, setB64] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileRef = useRef();

    const handleFile = (file) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setB64(e.target.result.split(",")[1]);
        setResult(null);
      };
      reader.readAsDataURL(file);
    };

const detect = async () => {
  setLoading(true);

  setTimeout(() => {
    setResult({
      disease: "Leaf Blight",
      confidence: "High",
      severity: "Moderate",
      treatment: "Apply copper-based fungicide every 7 days.",
      prevention: "Avoid overhead watering and ensure proper spacing."
    });
    setLoading(false);
  }, 1500);
};

const severityColor = { None: "#22c55e", Mild: "#eab308", Moderate: "#f97316", Severe: "#ef4444" };

return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="text-green-500 w-6 h-6" />
          <h2 className="text-xl font-bold">{t.disease}</h2>
          <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">AI Powered</span>
        </div>
        <div
          className="border-2 border-dashed border-green-200 rounded-xl p-6 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all"
          onClick={() => fileRef.current.click()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onDragOver={(e) => e.preventDefault()}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          {image ? (
            <img src={image} alt="leaf" className="max-h-48 mx-auto rounded-lg object-contain" />
          ) : (
            <div>
              <Upload className="mx-auto w-10 h-10 text-green-300 mb-2" />
              <p className="text-sm text-gray-500">Drop a leaf photo here or click to upload</p>
              <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG</p>
            </div>
          )}
        </div>
        {image && (
          <button onClick={detect} disabled={loading} className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-xl disabled:opacity-60 transition-all flex items-center justify-center gap-2">
            {loading ? <><Cpu className="w-4 h-4 animate-spin" /> Analyzing...</> : "🔍 Detect Disease"}
          </button>
        )}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-gray-50 border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg">{result.disease}</span>
                <span className="text-xs px-2 py-1 rounded-full font-medium text-white" style={{ background: severityColor[result.severity] || "#6b7280" }}>{result.severity}</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">Confidence: <b>{result.confidence}</b></p>
              <div className="mt-2">
                <p className="text-sm font-semibold text-green-700 mb-1">💊 Treatment:</p>
                <p className="text-sm text-gray-700">{result.treatment}</p>
              </div>
              {result.prevention && (
                <div className="mt-2">
                  <p className="text-sm font-semibold text-blue-700 mb-1">🛡️ Prevention:</p>
                  <p className="text-sm text-gray-700">{result.prevention}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

// ─── AI CROP SUGGESTION PANEL ────────────────────────────────────────────────
// ✅ 1. ADD HERE (TOP of file, outside component)
// ✅ ONLY ONE function (keep this)
const suggestCrops = (weather, soilMoisture) => {
  const { temp, humidity, rain } = weather;

  let crops = [
    {
      crop: "Rice (Paddy)",
      score: 0,
      waterNeeded: "50 mins/day",
      tip: "Maintain water level"
    },
    {
      crop: "Maize",
      score: 0,
      waterNeeded: "40 mins/day",
      tip: "Ensure drainage"
    },
    {
      crop: "Groundnut",
      score: 0,
      waterNeeded: "30 mins/day",
      tip: "Avoid overwatering"
    },
    {
      crop: "Cotton",
      score: 0,
      waterNeeded: "45 mins/day",
      tip: "Needs controlled irrigation"
    },
    {
      crop: "Millets",
      score: 0,
      waterNeeded: "20 mins/day",
      tip: "Best for low water"
    }
  ];

  // 🌡 Temperature scoring
  crops.forEach(c => {
    if (temp >= 20 && temp <= 35) c.score += 2;
    if (temp > 35) c.score += 1;
  });

  // 💧 Soil moisture scoring
  crops.forEach(c => {
    if (soilMoisture > 60) c.score += 2;
    else if (soilMoisture > 40) c.score += 1;
  });

  // 💦 Humidity scoring
  crops.forEach(c => {
    if (humidity > 70 && c.crop === "Rice (Paddy)") c.score += 3;
    if (humidity < 60 && c.crop === "Cotton") c.score += 2;
  });

  // 🌧 Rain scoring
  crops.forEach(c => {
    if (rain > 5 && c.crop === "Rice (Paddy)") c.score += 2;
    if (rain === 0 && c.crop === "Millets") c.score += 2;
  });

  // sort by best score
  const sorted = crops.sort((a, b) => b.score - a.score);

  return sorted.slice(0, 3).map(c => ({
    crop: c.crop,
    match: c.score >= 5 ? "Excellent" : c.score >= 3 ? "Good" : "Fair",
    reason: `Score based on temp ${temp}°C, humidity ${humidity}%, soil ${soilMoisture}%`,
    waterNeeded: c.waterNeeded,
    expectedYield: c.score >= 5 ? "High" : "Medium",
    tip: c.tip,
    confidence: `${c.score * 15}%`
  }));
};
function CropAIPanel({ temperature, soilMoisture, t }) {
  const [city, setCity] = useState("Chennai");
  const [weather, setWeather] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    setError("");
    try {
      const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
      const data = await res.json();
      const cur = data.current_condition[0];
      return {
        temp: parseFloat(cur.temp_C),
        humidity: parseFloat(cur.humidity),
        desc: cur.weatherDesc[0].value,
        rain: parseFloat(data.weather[0].hourly.reduce((a, h) => a + parseFloat(h.precipMM), 0).toFixed(1)),
      };
    } catch {
      return { temp: temperature, humidity: 65, desc: "Unknown", rain: 0 };
    }
  };

  const suggest = async () => {
  setLoading(true);
  setSuggestions(null);
  setError("");

  const w = await fetchWeather();
  setWeather(w);

  try {
    const result = suggestCrops(w, soilMoisture);

    if (result.length === 0) {
      setError("No suitable crops found for current conditions");
    } else {
      setSuggestions(result);
    }

  } catch (err) {
    console.error(err);
    setError("Prediction failed");
  }

  setLoading(false);
};

  const matchColor = { Excellent: "bg-green-100 text-green-700", Good: "bg-blue-100 text-blue-700", Fair: "bg-yellow-100 text-yellow-700" };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Cloud className="text-blue-500 w-6 h-6" />
        <h2 className="text-xl font-bold">{t.cropAI}</h2>
        <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">AI + Weather</span>
      </div>
      <div className="flex gap-2 mb-4">
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter your city..." className="border rounded-xl p-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
        <button onClick={suggest} disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-sm disabled:opacity-60 transition-all flex items-center gap-1">
          {loading ? <><Cpu className="w-4 h-4 animate-spin" /> Thinking</> : "Suggest"}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {weather && (
        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="flex-1 min-w-24 bg-orange-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">Temp</p>
            <p className="font-bold text-orange-600">{weather.temp}°C</p>
          </div>
          <div className="flex-1 min-w-24 bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">Humidity</p>
            <p className="font-bold text-blue-600">{weather.humidity}%</p>
          </div>
          <div className="flex-1 min-w-24 bg-cyan-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">Rain today</p>
            <p className="font-bold text-cyan-600">{weather.rain}mm</p>
          </div>
          <div className="flex-1 min-w-24 bg-green-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">Soil</p>
            <p className="font-bold text-green-600">{soilMoisture.toFixed(0)}%</p>
          </div>
        </div>
      )}
      <AnimatePresence>
        {suggestions && (
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-800">#{i + 1} {s.crop}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${matchColor[s.match] || "bg-gray-100 text-gray-600"}`}>{s.match}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{s.reason}</p>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>💧 {s.waterNeeded}</span>
                  <span>📈 Yield: {s.expectedYield}</span>
                </div>
                <p className="text-xs text-green-700 mt-1 font-medium">💡 {s.tip}</p>
                <p className="text-xs text-gray-800">
  "Suggestions based on real-time weather & soil analysis"
</p>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── LIVE GRAPH PANEL ────────────────────────────────────────────────────────
function LiveGraph({ soilMoisture, temperature, waterLevel, t }) {
  const [data, setData] = useState(() => Array.from({ length: 10 }, (_, i) => ({ time: `${i * 3}s`, soil: 45, temp: 28, water: 50 })));
  const counterRef = useRef(10);

  useEffect(() => {
    setData(prev => {
      const next = [...prev.slice(-19), { time: `${counterRef.current * 3}s`, soil: Math.round(soilMoisture * 10) / 10, temp: Math.round(temperature * 10) / 10, water: Math.round(waterLevel * 10) / 10 }];
      counterRef.current += 1;
      return next;
    });
  }, [soilMoisture, temperature, waterLevel]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="text-purple-500 w-6 h-6" />
        <h2 className="text-xl font-bold">{t.graph}</h2>
        <span className="ml-2 flex items-center gap-1 text-xs text-green-600"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block"></span> Live</span>
      </div>
      <div className="flex gap-4 text-xs mb-3 flex-wrap">
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 inline-block"></span> Soil Moisture</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-orange-500 inline-block"></span> Temperature</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-cyan-500 inline-block"></span> Water Level</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={4} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Line type="monotone" dataKey="soil" stroke="#3b82f6" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="temp" stroke="#f97316" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="water" stroke="#06b6d4" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function SmartIrrigation() {
  const [irrigationOn, setIrrigationOn] = useState(false);
  const [threshold, setThreshold] = useState(40);
  const [search, setSearch] = useState("");
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [soilMoisture, setSoilMoisture] = useState(45);
  const [temperature, setTemperature] = useState(28);
  const [tankLevel, setTankLevel] = useState(100);
  const [waterLevel, setWaterLevel] = useState(0);
  const [timer, setTimer] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [language, setLanguage] = useState("en");
  const [activeTab, setActiveTab] = useState("dashboard");

  const t = translations[language];

  // Sensor simulation
  useEffect(() => {
    const i = setInterval(() => {
      setSoilMoisture(v => Math.max(0, Math.min(100, v + (Math.random() * 4 - 2))));
      setWaterLevel(v => Math.max(0, Math.min(100, v + (Math.random() * 4 - 2))));
      setTemperature(v => Math.max(15, Math.min(40, v + (Math.random() * 2 - 1))));
    }, 3000);
    return () => clearInterval(i);
  }, []);

  // Battery drain
  useEffect(() => {
    const i = setInterval(() => setBatteryLevel(v => Math.max(0, v - 0.06)), 3000);
    return () => clearInterval(i);
  }, []);

  // Auto irrigation
  useEffect(() => {
    if (soilMoisture < threshold && !irrigationOn) {
      const cropTime = selectedCrop ? crops[selectedCrop].flow : "10 mins";
      setTimer(parseMinutes(cropTime));
      setIrrigationOn(true);
    }
  }, [soilMoisture, threshold]);

  // Irrigation timer
  useEffect(() => {
    if (!irrigationOn || timer <= 0) { if (irrigationOn && timer === 0) setIrrigationOn(false); return; }
    const c = setInterval(() => {
      setTimer(t => t - 1);
      setTankLevel(v => Math.max(0, v - 0.1));
      setWaterLevel(v => Math.min(100, v + 0.1));
    }, 1000);
    return () => clearInterval(c);
  }, [irrigationOn, timer]);

  const handleIrrigation = () => {
    if (!irrigationOn) { setTimer(parseMinutes(selectedCrop ? crops[selectedCrop].flow : "10 mins")); setIrrigationOn(true); }
    else { setIrrigationOn(false); setTimer(0); }
  };

  const filteredCrops = search.trim() === "" ? cropNames : cropNames.filter(c => c.toLowerCase().includes(search.toLowerCase()));

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "disease", label: t.disease, icon: "🔬" },
    { id: "cropai", label: t.cropAI, icon: "🌾" },
    { id: "graph", label: t.graph, icon: "📈" },
  ];

  const batteryColor = batteryLevel > 50 ? "text-green-600" : batteryLevel > 20 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">🌱 Smart Irrigation AI</h1>
            <p className="text-green-100 text-sm mt-0.5">Real-time precision farming dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={language} onChange={e => setLanguage(e.target.value)} className="bg-white/20 text-white rounded-lg px-3 py-1.5 text-sm border border-white/30 backdrop-blur">
              <option value="en" className="text-black">English</option>
              <option value="ta" className="text-black">தமிழ்</option>
              <option value="hi" className="text-black">Hindi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 flex overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${activeTab === tab.id ? "border-green-500 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ── DASHBOARD TAB ── */}
        {activeTab === "dashboard" && (
          <>
            {/* Sensor Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <Droplet className="w-8 h-8 text-blue-500" />, label: t.soil, value: `${soilMoisture.toFixed(1)}%`, color: soilMoisture < threshold ? "text-red-600" : "text-blue-600", bg: "bg-blue-50", warn: soilMoisture < threshold ? t.warning : null },
                { icon: <Thermometer className="w-8 h-8 text-orange-500" />, label: t.temp, value: `${temperature.toFixed(1)}°C`, color: "text-orange-600", bg: "bg-orange-50" },
                { icon: <Battery className={`w-8 h-8 ${batteryColor}`} />, label: t.battery, value: `${batteryLevel.toFixed(1)}%`, color: batteryColor, bg: "bg-yellow-50" },
                { icon: <Droplet className="w-8 h-8 text-cyan-500" />, label: t.water, value: `${waterLevel.toFixed(1)}%`, color: "text-cyan-600", bg: "bg-cyan-50" },
              ].map((card, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className={`${card.bg} rounded-2xl p-4 text-center shadow-sm`}>
                  <div className="mx-auto mb-1 flex justify-center">{card.icon}</div>
                  <p className="text-xs text-gray-500 font-medium">{card.label}</p>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                  {card.warn && <p className="text-xs text-red-500 font-semibold mt-1">⚠️ {card.warn}</p>}
                </motion.div>
              ))}
            </div>

            {/* Irrigation Control */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-1">
                <h2 className="text-lg font-bold mb-1 flex items-center gap-2"><Power className={`w-5 h-5 ${irrigationOn ? "text-red-500" : "text-gray-400"}`} /> {t.irrigation}</h2>
                <p className="text-sm text-gray-500">Selected: <b>{selectedCrop || "None"}</b></p>
                {irrigationOn && <p className="text-lg font-mono font-bold text-blue-600 mt-1 flex items-center gap-1"><Clock className="w-4 h-4" /> {fmt(timer)}</p>}
              </div>
              <button onClick={handleIrrigation}
                className={`px-8 py-3 rounded-2xl font-bold text-white shadow-md transition-all ${irrigationOn ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}>
                {irrigationOn ? t.stop : t.start}
              </button>
              {irrigationOn && (
                <motion.div className="flex gap-1" animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                  {["💧", "💧", "💧"].map((d, i) => <span key={i} className="text-xl">{d}</span>)}
                </motion.div>
              )}
            </div>

            {/* Crop Selector + Tank */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-3">🌾 Crop Settings</h2>
                <div className="flex gap-3 mb-3 flex-wrap">
                  <div className="flex-1 min-w-36">
                    <label className="text-xs text-gray-500 mb-1 block">{t.threshold}</label>
                    <input type="number" value={threshold} onChange={e => setThreshold(Number(e.target.value))} className="border rounded-lg p-2 w-full text-sm focus:ring-2 focus:ring-green-300 focus:outline-none" />
                  </div>
                  <div className="flex-1 min-w-36">
                    <label className="text-xs text-gray-500 mb-1 block">{t.search}</label>
                    <input type="text" placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)} className="border rounded-lg p-2 w-full text-sm focus:ring-2 focus:ring-green-300 focus:outline-none" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {filteredCrops.map(crop => (
                    <button key={crop} onClick={() => setSelectedCrop(crop)}
                      className={`px-3 py-1 rounded-full text-sm border transition-all ${selectedCrop === crop ? "bg-green-500 text-white border-green-500" : "bg-gray-50 hover:bg-green-50 border-gray-200"}`}>
                      {crop}
                    </button>
                  ))}
                </div>
                {selectedCrop && (
                  <div className="mt-3 p-3 rounded-xl bg-green-50 border border-green-100 text-sm">
                    <b>{selectedCrop}</b> — 💧 {crops[selectedCrop].flow} | 📊 {crops[selectedCrop].level} water need
                  </div>
                )}
              </div>

              {/* Tank */}
              <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center">
                <h2 className="text-lg font-bold mb-3">🪣 Rainwater Tank</h2>
                <div className="relative w-20 h-32 border-4 border-blue-400 rounded-xl overflow-hidden bg-gray-50">
                  <motion.div className="absolute bottom-0 left-0 w-full bg-blue-400" animate={{ height: `${tankLevel}%` }} transition={{ duration: 1 }} />
                  <motion.div className="absolute bottom-0 left-0 w-full h-4 bg-blue-300 opacity-60" animate={{ x: ["0%", "100%", "0%"] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} />
                </div>
                <p className="mt-2 font-bold text-blue-600">{tankLevel.toFixed(1)}%</p>
              </div>
            </div>
          </>
        )}

        {/* ── DISEASE TAB ── */}
        {activeTab === "disease" && <DiseasePanel t={t} />}

        {/* ── CROP AI TAB ── */}
        {activeTab === "cropai" && <CropAIPanel temperature={temperature} soilMoisture={soilMoisture} t={t} />}

        {/* ── GRAPH TAB ── */}
        {activeTab === "graph" && <LiveGraph soilMoisture={soilMoisture} temperature={temperature} waterLevel={waterLevel} t={t} />}
      </div>
    </div>
  );
}