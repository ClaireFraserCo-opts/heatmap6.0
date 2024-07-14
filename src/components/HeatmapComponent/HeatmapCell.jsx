import React from 'react';
import PropTypes from 'prop-types';

const HeatmapCell = ({
  speaker,
  isSilence,
  text,
  start,
  end,
  wordFrequency = 0,
  confidence = 0,
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  onClick = () => {},
}) => {
  const getColor = () => {
    if (isSilence) return 'gray';
    switch (speaker) {
      case 'A':
        return 'blue';
      case 'B':
        return 'green';
      default:
        return 'white';
    }
  };

  const handleMouseEnter = () => {
    onMouseEnter({ text, start, end, wordFrequency, confidence });
    // Additional logic if needed
  };

  const handleMouseLeave = () => {
    onMouseLeave();
    // Additional logic if needed
  };

  const handleClick = () => {
    onClick({ text, start, end, wordFrequency, confidence });
    // Additional logic if needed
  };

  return (
    <div
      className="heatmap-cell"
      style={{
        backgroundColor: getColor(),
        width: '10px',
        height: '10px',
        margin: '1px',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Optional: Add content or leave empty for visual representation */}
    </div>
  );
};

HeatmapCell.propTypes = {
  isSilence: PropTypes.bool.isRequired,
  speaker: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  wordFrequency: PropTypes.number,
  confidence: PropTypes.number,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
};

export default HeatmapCell;
