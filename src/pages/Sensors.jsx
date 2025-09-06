import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { time: "10AM", soil: 40, water: 60 },
  { time: "11AM", soil: 45, water: 62 },
  { time: "12PM", soil: 50, water: 65 },
  { time: "1PM", soil: 42, water: 58 },
];

export default function Sensors() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">📊 Sensor Data</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="soil" stroke="#3b82f6" strokeWidth={3} />
          <Line type="monotone" dataKey="water" stroke="#10b981" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
