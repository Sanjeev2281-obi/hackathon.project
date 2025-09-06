import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-green-600">🌱 SmartFarm</h1>
      <div className="space-x-6 font-medium">
        <Link to="/" className="hover:text-green-500">Dashboard</Link>
        <Link to="/sensors" className="hover:text-green-500">Sensors</Link>
        <Link to="/history" className="hover:text-green-500">History</Link>
        <Link to="/settings" className="hover:text-green-500">Settings</Link>
      </div>
    </nav>
  );
}
