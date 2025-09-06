import { motion } from "framer-motion";
import { Droplet, Thermometer, Power } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const [irrigationOn, setIrrigationOn] = useState(false);

  return (
    <motion.div
      className="grid md:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Soil Moisture */}
      <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
        <Thermometer className="mx-auto text-blue-500 w-12 h-12 mb-2" />
        <h2 className="text-lg font-semibold">Soil Moisture</h2>
        <p className="text-2xl font-bold text-blue-600">45%</p>
      </div>

      {/* Water Level */}
      <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
        <Droplet className="mx-auto text-green-500 w-12 h-12 mb-2" />
        <h2 className="text-lg font-semibold">Water Level</h2>
        <p className="text-2xl font-bold text-green-600">70%</p>
      </div>

      {/* Irrigation Control */}
      <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
        <Power
          className={`mx-auto w-12 h-12 mb-2 ${
            irrigationOn ? "text-red-500" : "text-gray-500"
          }`}
        />
        <h2 className="text-lg font-semibold">Irrigation</h2>
        <button
          onClick={() => setIrrigationOn(!irrigationOn)}
          className={`mt-3 px-4 py-2 rounded-xl font-bold shadow-md ${
            irrigationOn ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {irrigationOn ? "Stop" : "Start"}
        </button>
      </div>
    </motion.div>
  );
}
