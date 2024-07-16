// getColorScale: Returns a color scale with predefined domain and range.
// getShadedColor: Adjusts the brightness of the base color based on intensity.

// src/utils/colorUtils.js

import * as d3 from 'd3';

// Function to get the base color scale
export const getColorScale = () => {
  return d3.scaleOrdinal()
    .domain(['silence', 'A', 'B'])
    .range(['gray', 'blue', 'green']);
};

// Function to get shaded color based on intensity
export const getShadedColor = (baseColor, intensity) => {
  // Implement logic to return a color based on intensity (0-5)
  // Example: use d3 color manipulation methods to adjust the base color's brightness
  return d3.color(baseColor).brighter(intensity / 5).toString();
};
