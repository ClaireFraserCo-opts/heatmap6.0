import React from 'react';
import PropTypes from 'prop-types';

const HeatmapTooltip = ({ content, mouseX, mouseY }) => {
  // Ensure content and content.start are defined before rendering
  if (!content || !content.start) {
    return null; // Return null if content or content.start is undefined
  }

  // Style object to position the tooltip
  const tooltipStyle = {
    left: `${mouseX}px`,
    top: `${mouseY}px`,
  };

  // Render tooltip content when content and content.start are defined
  return (
    <div className="heatmap-tooltip" style={tooltipStyle}>
      <p><strong>Speaker:</strong> {content.speaker}</p>
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
    speaker: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    wordFrequency: PropTypes.number,
    confidence: PropTypes.number,
  }),
  mouseX: PropTypes.number.isRequired,
  mouseY: PropTypes.number.isRequired,
};

export default HeatmapTooltip;
