// HeatmapComponent.jsx

import React, { useEffect, useState } from 'react';
import HeatmapCell from './HeatmapCell';
import HeatmapTooltip from './HeatmapTooltip';
import HeatmapD3 from '../HeatmapD3/HeatmapD3';
import { fetchData } from '../../utils/fetchData';
import { processSessionData } from '../../utils/processData';

import './HeatmapComponent.css';

const HeatmapComponent = () => {
  const [sessionData, setSessionData] = useState([]);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const data = await fetchData();
        if (data && data.length > 0) {
          const combinedData = processSessionData(data);
          setSessionData(combinedData);
        } else {
          console.log('No session data fetched or empty array.');
          // Handle no data scenario (e.g., display a message)
        }
      } catch (error) {
        console.error('Error fetching session data:', error.message);
        // Handle error state or UI feedback here (e.g., display an error message)
      }
    };

    fetchSessionData();
  }, []);

  const handleMouseEnter = (cellData) => {
    setTooltipContent(cellData);
    setHoveredCell(cellData);
  };

  const handleMouseLeave = () => {
    setTooltipContent(null);
    setHoveredCell(null);
  };

  const handleClick = (cellData) => {
    console.log(cellData);
    // Handle click interactions
  };

  return (
    <div className="heatmap-container">
      {/* Render D3.js heatmap if sessionData exists */}
      {sessionData.length > 0 && <HeatmapD3 sessionData={sessionData} />}

      {/* Or, render original HeatmapCell */}
      <div className="heatmap-grid">
        {sessionData.map((cell, index) => (
          <HeatmapCell
            key={index}
            speaker={cell.speaker || ''} // Provide default value or use optional chaining
            isSilence={cell.isSilence || false} // Provide default value or use optional chaining
            start={cell.start || 0} // Provide default value or use optional chaining
            end={cell.end || 0} // Provide default value or use optional chaining
            wordFrequency={cell.wordFrequency || 0} // Provide default value or use optional chaining
            confidence={cell.confidence || 0} // Provide default value or use optional chaining
            onMouseEnter={() => handleMouseEnter(cell)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(cell)}
          >
            {/* Conditional rendering example */}
            {cell.speaker && <span>Speaker: {cell.speaker}</span>}
            {cell.isSilence && <span>Silence</span>}
          </HeatmapCell>
        ))}
      </div>

      {/* Heatmap tooltip component (optional) */}
      {tooltipContent && tooltipContent.start && (
        <HeatmapTooltip content={tooltipContent} />
      )}
    </div>
  );
};

export default HeatmapComponent;
