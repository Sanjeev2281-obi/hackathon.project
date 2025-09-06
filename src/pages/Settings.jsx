import { useState } from "react";

export default function Settings() {
  const [threshold, setThreshold] = useState(40);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg">
      <h2 className="text-xl font-bold mb-4">⚙️ Settings</h2>
      <label className="block font-medium mb-2">Soil Moisture Threshold (%)</label>
      <input
        type="number"
        value={threshold}
        onChange={(e) => setThreshold(e.target.value)}
        className="border rounded-lg p-2 w-full mb-4"
      />
      <button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
        Save
      </button>
    </div>
  );
}
