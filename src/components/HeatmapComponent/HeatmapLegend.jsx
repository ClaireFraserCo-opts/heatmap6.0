// The legendItems array contains color and label pairs for the legend.
// The component iterates over legendItems to render each legend item.

// src/components/HeatmapComponent/HeatmapLegend.jsx

import React from 'react';
import '../styles/HeatmapLegend.css'; // Add styling for the legend

// Define the legend component
const HeatmapLegend = () => {
  // Define legend items here
  const legendItems = [
    { color: 'lightblue', label: 'Speaker A' },
    { color: 'lightgreen', label: 'Speaker B' },
    { color: 'gray', label: 'Silence' },
    { color: 'red', label: 'Overlap' },
    // Add more items as needed
  ];

  return (
    <div className="heatmap-legend">
      {legendItems.map((item, index) => (
        <div key={index} className="legend-item">
          <span className="legend-color" style={{ backgroundColor: item.color }}></span>
          <span className="legend-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default HeatmapLegend;
