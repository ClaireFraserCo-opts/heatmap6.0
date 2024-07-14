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

  return (
    <div
      className="heatmap-cell"
      style={{
        backgroundColor: getColor(),
        width: '10px',
        height: '10px',
        margin: '1px',
      }}
      onMouseEnter={() =>
        onMouseEnter({ text, start, end, wordFrequency, confidence })
      }
      onMouseLeave={onMouseLeave}
      onClick={() => onClick({ text, start, end, wordFrequency, confidence })}
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
