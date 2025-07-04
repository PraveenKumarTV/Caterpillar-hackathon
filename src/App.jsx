import { useState, useEffect } from 'react';
import Header from './header';
import Footer from './footer';
import PredictionForm from './components/PredictionForm';
import { generateSuggestions } from './utils/generateSuggestions';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [suggestions, setSuggestions] = useState("");
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(null);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  const handlePrediction = async (value, formData) => {
    setPrediction(value);
    setSuggestions("");
    setSuggestionsError(null);
    setLoadingSuggestions(true);

    try {
      const aiSuggestions = await generateSuggestions(value, formData);
      setSuggestions(aiSuggestions);
    } catch (error) {
      console.error("Failed to get AI suggestions:", error);
      setSuggestionsError("Failed to load AI suggestions.");
    } finally {
      setLoadingSuggestions(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
      <main className="p-6 flex-grow">
        <PredictionForm setPrediction={handlePrediction} />
        {prediction && (
          <section className="result-section mt-8 bg-gray-800 text-yellow-300 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-3">Estimated Duration: {prediction} days</h2>
            <h3 className="text-xl mb-2 font-semibold">🤖 AI Suggestions to Reduce Time:</h3>
            <div className="whitespace-pre-line text-gray-100">
              {loadingSuggestions
                ? "Loading suggestions..."
                : suggestionsError
                ? suggestionsError
                : suggestions || "No suggestions available."}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
