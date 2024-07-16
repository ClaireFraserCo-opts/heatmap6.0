// HeatmapTooltip.jsx

import React from 'react';
import PropTypes from 'prop-types';

const HeatmapTooltip = ({ content, mouseX, mouseY }) => {
  // Ensure content and content.speaker are defined before rendering
  if (!content || !content.speaker) {
    return null; // Return null if content or content.speaker is undefined
  }

  const { speaker, text, startTime, endTime, wordFrequency, confidence } = content;

  // Calculate tooltip style based on mouse coordinates
  const tooltipStyle = {
    position: 'fixed',
    left: mouseX + 10,
    top: mouseY + 10,
    backgroundColor: 'white',
    border: '1px solid black',
    padding: '10px',
    zIndex: 1000,
    pointerEvents: 'none',
  };

  // Render tooltip content when content and content.speaker are defined
  return (
    <div className="heatmap-tooltip" style={tooltipStyle}>
      <p><strong>Speaker:</strong> {speaker}</p>
      <p><strong>Text:</strong> {text}</p>
      <p><strong>Start:</strong> {startTime}ms</p>
      <p><strong>End:</strong> {endTime}ms</p>
      <p><strong>Word Frequency:</strong> {wordFrequency}</p>
      <p><strong>Confidence:</strong> {confidence}</p>
    </div>
  );
};

HeatmapTooltip.propTypes = {
  content: PropTypes.shape({
    speaker: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
    wordFrequency: PropTypes.number,
    confidence: PropTypes.number,
  }),
  mouseX: PropTypes.number.isRequired,
  mouseY: PropTypes.number.isRequired,
};

export default HeatmapTooltip;
