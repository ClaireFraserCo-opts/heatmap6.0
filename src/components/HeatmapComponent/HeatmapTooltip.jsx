import React from 'react';
import PropTypes from 'prop-types';

const HeatmapTooltip = ({ content, mouseX, mouseY }) => {
  const tooltipStyle = {
    position: 'absolute',
    left: mouseX,
    top: mouseY,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',  // Setting text color to white
    padding: '8px',
    borderRadius: '4px',
    pointerEvents: 'none',
    zIndex: 100,
    fontSize: '14px',
    whiteSpace: 'nowrap',
  };

  const textStyle = {
    color: 'yellow',  // Change text color here
    // Other text styles like fontFamily, fontWeight, etc., can also be added here
  };

  return (
    <div className="heatmap-tooltip" style={tooltipStyle}>
      <p style={textStyle}><strong>Speaker:</strong> {content.speaker}</p>
      <p style={textStyle}><strong>Text:</strong> {content.text}</p>
      <p style={textStyle}><strong>Start:</strong> {content.start}ms</p>
      <p style={textStyle}><strong>End:</strong> {content.end}ms</p>
      <p style={textStyle}><strong>Word Frequency:</strong> {content.wordFrequency}</p>
      <p style={textStyle}><strong>Confidence:</strong> {content.confidence}</p>
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
