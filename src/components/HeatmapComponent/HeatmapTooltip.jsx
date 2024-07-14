// src/components/HeatmapComponent/HeatmapTooltip.js
import React from 'react';
import PropTypes from 'prop-types';

const HeatmapTooltip = ({ content }) => {
  // Ensure content and content.start are defined before rendering
  if (!content || !content.start) {
    return null; // Return null if content or content.start is undefined
  }

  // Render tooltip content when content and content.start are defined
  return (
    <div className="heatmap-tooltip">
      <p><strong>Text:</strong> {content.text}</p>
      <p><strong>Start:</strong> {content.start}ms</p>
      <p><strong>End:</strong> {content.end}ms</p>
      <p><strong>Word Frequency:</strong> {content.wordFrequency}</p>
      <p><strong>Confidence:</strong> {content.confidence}</p>
    </div>
  );
};

HeatmapTooltip.propTypes = {
  content: PropTypes.shape({
    text: PropTypes.string,
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    wordFrequency: PropTypes.number,
    confidence: PropTypes.number,
  }),
};

export default HeatmapTooltip;
