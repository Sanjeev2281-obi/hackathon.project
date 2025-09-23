import { useNavigate } from "react-router-dom";

export default function LanguageSelect() {
  const navigate = useNavigate();

  const handleSelect = (lang) => {
   
    localStorage.setItem("lang", lang);
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-green-400 to-blue-500 text-white border-4 border-white rounded-lg shadow-lg p-8">
      <div className="p-8 bg-green-300 rounded-lg shadow-md text-center">
      <h1 className="text-4xl font-bold mb-6">🌱 Select Language</h1>
     <div className="flex flex-col space-y-8">

        <button
          onClick={() => handleSelect("en")}
          className="px-9 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200"
        >
          English
        </button>
        <button
          onClick={() => handleSelect("ta")}
          className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200"
        >
          தமிழ்
        </button>
        <button
          onClick={() => handleSelect("hi")}
          className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200"
        >
          हिन्दी
        </button>
        </div>
      </div>
    </div>
  );
}
