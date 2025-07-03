import { useState, useEffect } from 'react';
import Header from './header';
import Footer from './footer';
import PredictionForm from './components/PredictionForm';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
      <main className="p-6 flex-grow">
        <PredictionForm setPrediction={setPrediction} />
        {prediction && (
          <section className="result-section mt-8 bg-gray-800 text-yellow-300 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-3">Estimated Duration: {prediction} hourss</h2>
            <h3 className="text-xl mb-2 font-semibold">🔧 Suggestions to Reduce Time:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Use automated or semi-automated equipment.</li>
              <li>Increase crew size or use skilled laborers.</li>
              <li>Optimize task sequencing to avoid delays.</li>
              <li>Schedule work during optimal weather conditions.</li>
              <li>Upgrade tools to higher-efficiency alternatives.</li>
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
