import React from 'react';
import PropTypes from 'prop-types';
import '../styles/HeatmapTooltip.css'; // Ensure your CSS file is imported

const HeatmapTooltip = ({ content, mouseX, mouseY }) => {
  if (!content || content.start === undefined) {
    return null; // Return null if content or content.start is undefined
  }

  const tooltipStyle = {
    position: 'fixed',
    left: mouseX + 10, // Offset to the right of the mouse pointer
    top: mouseY + 10, // Offset below the mouse pointer
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    padding: '10px',
    borderRadius: '4px',
    zIndex: 1000, // Ensure tooltip appears above other elements
    pointerEvents: 'none', // Disable pointer events so tooltip doesn't interfere with mouse interactions
    // Additional styling as needed
  };

  return (
    <div className="heatmap-tooltip" style={tooltipStyle}>
      <p><strong>Speaker:</strong> {content.isSilence ? 'Silence' : (content.speaker || 'Unknown Speaker')}</p>
      <p><strong>Percentile:</strong> {content.percentile !== undefined ? `${content.percentile}%` : 'N/A'}</p>
      <p><strong>Start Time:</strong> {content.start} ms</p>
      <p><strong>End Time:</strong> {content.end} ms</p>
      {/* Uncomment if needed */}
      {/* <p><strong>Word Frequency:</strong> {content.wordFrequency !== undefined ? content.wordFrequency : 'N/A'}</p>
      <p><strong>Confidence:</strong> {content.confidence !== undefined ? `${content.confidence}%` : 'N/A'}</p> */}
      <p><strong>Text:</strong> {content.text || (content.isSilence ? 'No speech' : 'N/A')}</p>
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
    isSilence: PropTypes.bool, // Ensure `isSilence` is included
    speaker: PropTypes.string, // Ensure `speaker` is included
    percentile: PropTypes.number, // Ensure `percentile` is included
  }),
  mouseX: PropTypes.number.isRequired,
  mouseY: PropTypes.number.isRequired,
};

export default HeatmapTooltip;
