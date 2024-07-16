// src/components/HeatmapComponent/HeatmapCell.jsx

import React from 'react';
import PropTypes from 'prop-types';
import './HeatmapComponent.css';  // Importing CSS specific to HeatmapComponent

const HeatmapCell = ({ x, y, width, height, color, onHover, onClick }) => {
  return (
    <rect
      x={x}                    // x-coordinate of the cell
      y={y}                    // y-coordinate of the cell
      width={width}            // width of the cell
      height={height}          // height of the cell
      fill={color}             // color of the cell
      className="heatmap-cell" // Applying the heatmap-cell class for styling
      onMouseEnter={onHover}   // Handling onMouseEnter event for hover functionality
      onClick={onClick}        // Handling onClick event for click functionality
    />
  );
};

HeatmapCell.propTypes = {
  x: PropTypes.number.isRequired,    // PropTypes for x-coordinate
  y: PropTypes.number.isRequired,    // PropTypes for y-coordinate
  width: PropTypes.number.isRequired,  // PropTypes for width
  height: PropTypes.number.isRequired,  // PropTypes for height
  color: PropTypes.string.isRequired,  // PropTypes for color
  onHover: PropTypes.func,  // PropTypes for onMouseEnter event
  onClick: PropTypes.func,  // PropTypes for onClick event
};

export default HeatmapCell;
