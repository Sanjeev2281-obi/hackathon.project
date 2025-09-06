export default function History() {
  const irrigationHistory = [
    { time: "10:30 AM", action: "Irrigation Started" },
    { time: "11:00 AM", action: "Irrigation Stopped" },
    { time: "Yesterday", action: "Low Water Alert" },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">📜 Irrigation History</h2>
      <ul className="space-y-2">
        {irrigationHistory.map((item, idx) => (
          <li key={idx} className="flex justify-between bg-gray-100 p-2 rounded-lg">
            <span>{item.action}</span>
            <span className="text-sm text-gray-500">{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
