import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Sensors from "./pages/Sensors";
import History from "./pages/History";
import Settings from "./pages/Settings";
import SmartIrrigation from "./pages/SmartIrrigation";

export default function App() {
  return (
   <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-200">
        
        <div className="p-6">
          <Routes>
            <Route path="/" element={<SmartIrrigation />} />
            <Route path="/sensors" element={<Sensors />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
