// App.js

import React from 'react';
import './components/styles/App.css'; // Import your CSS file
import HeatmapComponent from './components/HeatmapComponent/HeatmapComponent'; // Import your main component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Therapy Session Heatmap Visualization</h1>
        {/* Add any header content or navigation */}
      </header>
      <main className="App-main">
        <HeatmapComponent /> {/* Render your main component here */}
      </main>
    </div>
  );
}

export default App;
