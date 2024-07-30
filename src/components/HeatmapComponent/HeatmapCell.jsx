import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { getColorForUtterance } from '../../utils/colorUtils';
import '../styles/HeatmapCell.css'; // Ensure minimal or no conflicting styles

const HeatmapCell = ({
  speaker,
  isSilence,
  text,
  start,
  end,
  percentile,
  cellWidth,
  cellHeight,
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  onClick = () => {},
}) => {
  const utterance = { speaker, isSilence, text, start, end, percentile: percentile !== undefined ? percentile : 0 };
  const cellColor = getColorForUtterance(utterance);

  const handleMouseEnter = (event) => {
    onMouseEnter(utterance, event);
  };

  const handleMouseLeave = () => {
    onMouseLeave();
  };

  const handleClick = () => {
    onClick(utterance);
  };

  return (
    <Tooltip
      title={
        <React.Fragment>
          <Typography variant="body2"><strong>Speaker:</strong> {speaker || (isSilence ? 'Silence' : 'Unknown')}</Typography>
          <Typography variant="body2"><strong>Percentile:</strong> {percentile !== undefined ? `${percentile}%` : 'N/A'}</Typography>
          <Typography variant="body2"><strong>Start:</strong> {start} ms</Typography>
          <Typography variant="body2"><strong>End:</strong> {end} ms</Typography>
          <Typography variant="body2"><strong>Text:</strong> {text || (isSilence ? 'No speech' : 'N/A')}</Typography>
        </React.Fragment>
      }
      enterDelay={500}
      arrow
    >
      <div
        className="heatmap-cell"
        style={{
          backgroundColor: cellColor, // Apply dynamic color
          width: `${cellWidth}px`,     // Apply dynamic width
          height: `${cellHeight}px`,   // Apply dynamic height
          border: '1px solid #d3d3d3',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
      </div>
    </Tooltip>
  );
};

HeatmapCell.propTypes = {
  isSilence: PropTypes.bool.isRequired,
  speaker: PropTypes.string,
  text: PropTypes.string,
  start: PropTypes.number,
  end: PropTypes.number,
  percentile: PropTypes.number,
  cellWidth: PropTypes.number.isRequired,
  cellHeight: PropTypes.number.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
};

export default HeatmapCell;
