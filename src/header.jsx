import caterpillarLogo from '/caterpillar_logo.png';

export default function Header({ darkMode, toggleDarkMode }) {
  return (
    <header className="flex items-center justify-between p-4 bg-black text-yellow-400 shadow-md">
      <div className="flex items-center space-x-3">
        <img src={caterpillarLogo} alt="Caterpillar" className="h-10" />
        <h1 className="text-2xl font-bold">Construction Time Estimator</h1>
      </div>

      <button
        onClick={toggleDarkMode}
        title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className={`p-2 rounded-full text-xl transition-all border-2
          ${darkMode
            ? 'bg-yellow-400 text-black hover:bg-white border-yellow-400'
            : 'bg-black text-yellow-400 hover:bg-yellow-600 border-black'
          }`}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </header>
  );
}
