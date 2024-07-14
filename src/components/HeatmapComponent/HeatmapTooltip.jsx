import React from 'react';
import PropTypes from 'prop-types';
// import './HeatmapComponent.css';

const HeatmapTooltip = ({ content, mouseX, mouseY }) => {
  // Ensure content and content.start are defined before rendering
  if (!content || !content.start) {
    return null; // Return null if content or content.start is undefined
  }

  // Calculate tooltip style based on mouse coordinates
  const tooltipStyle = {
    position: 'fixed',
    left: mouseX + 10, // Offset to the right of the mouse pointer
    top: mouseY + 10, // Offset below the mouse pointer
    backgroundColor: 'white',
    border: '1px solid black',
    padding: '10px',
    zIndex: 1000, // Ensure tooltip appears above other elements
    pointerEvents: 'none', // Disable pointer events so tooltip doesn't interfere with mouse interactions
    // Additional styling as needed
  };

  // Render tooltip content when content and content.start are defined
  return (
    <div className="heatmap-tooltip" style={tooltipStyle}>
      <p><strong>Text:</strong> {content.text}</p>
      <p><strong>Start:</strong> {content.start}ms</p>
      <p><strong>End:</strong> {content.end}ms</p>
      <p><strong>Word Frequency:</strong> {content.wordFrequency}</p>
      <p><strong>Confidence:</strong> {content.confidence}</p>
    </div>
  );
};

// Define PropTypes for content and mouse coordinates
HeatmapTooltip.propTypes = {
  content: PropTypes.shape({
    text: PropTypes.string,
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    wordFrequency: PropTypes.number,
    confidence: PropTypes.number,
  }),
  mouseX: PropTypes.number.isRequired,
  mouseY: PropTypes.number.isRequired,
};

export default HeatmapTooltip;