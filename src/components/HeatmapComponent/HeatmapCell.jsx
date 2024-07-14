import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

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
  };

  const handleMouseLeave = () => {
    onMouseLeave();
  };

  const handleClick = () => {
    onClick({ text, start, end, wordFrequency, confidence });
  };

  return (
    <Tooltip
    title={
      <React.Fragment>
        <Typography variant="body2"><strong>Text:</strong> {text}</Typography>
        <Typography variant="body2"><strong>Start:</strong> {start}ms</Typography>
        <Typography variant="body2"><strong>End:</strong> {end}ms</Typography>
        <Typography variant="body2"><strong>Word Frequency:</strong> {wordFrequency}</Typography>
        <Typography variant="body2"><strong>Confidence:</strong> {confidence}</Typography>
      </React.Fragment>
    }
    enterDelay={500} // Optional: Adjust tooltip delay
    arrow
  >

    <div
      className="heatmap-cell"
      style={{ backgroundColor: getColor() }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Optional: Add content or leave empty for visual representation */}
    </div>
    </Tooltip>
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
