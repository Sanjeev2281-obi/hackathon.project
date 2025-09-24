import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SmartIrrigation from "./pages/SmartIrrigation";
import LanguageSelect from "./Components/LanguageSelect";
import WeatherApp from "./pages/WeatherApp";

export default function App() {
  return (
   <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-200">
        
        <div className="">
          <Routes>
            <Route path="/" element={<LanguageSelect />} />
            <Route path="/Dashboard" element={<SmartIrrigation />} />  
          </Routes>
           <div><WeatherApp /></div>
        </div>
      </div>
    </Router>
  );
}
