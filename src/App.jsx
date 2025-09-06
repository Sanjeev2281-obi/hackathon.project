import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/DashBoard";
import Sensors from "./pages/Sensors";
import History from "./pages/History";
import Settings from "./pages/Settings";

export default function App() {
  return (
   <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-200">
        <Navbar />
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sensors" element={<Sensors />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
