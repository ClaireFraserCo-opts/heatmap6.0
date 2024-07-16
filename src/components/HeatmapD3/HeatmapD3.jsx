import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import './HeatmapD3.css';
import { getColorScale, getShadedColor } from '../../utils/colorUtils';
import HeatmapTooltip from '../HeatmapComponent/HeatmapTooltip'; // Adjust path if needed

// Define styled components
const HeatmapContainer = styled.div`
  position: relative;
`;

const HeatmapSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1; /* Adjust as needed */
`;

const HeatmapD3 = ({ sessionData }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!sessionData || sessionData.length === 0) {
      console.log('No session data available.');
      return; // Exit early if sessionData is not ready
    }

    console.log('Session data:', sessionData);

    // Define margins and dimensions
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Select or create the SVG element
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add your D3 heatmap code here
    // Sample implementation for demonstration:
    // Set up scales and axes
    const xScale = d3.scaleBand()
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleBand()
      .range([height, 0])
      .padding(0.1);

    const colorScale = d3.scaleSequential()
      .interpolator(d3.interpolateViridis)
      .domain([0, d3.max(sessionData, d => d.value)]);

    // Update scales' domains based on data
    xScale.domain(sessionData.map(d => d.x));
    yScale.domain(sessionData.map(d => d.y));

    // Append the rectangles for the heatmap
    svg.selectAll('.heatmap-rect')
      .data(sessionData)
      .enter()
      .append('rect')
      .attr('class', 'heatmap-rect')
      .attr('x', d => xScale(d.x))
      .attr('y', d => yScale(d.y))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .style('fill', d => colorScale(d.value))
      .on('mouseover', (event, d) => {
        // Handle mouseover event
        console.log('Mouseover data:', d);
        // Show tooltip
        d3.select('#tooltip')
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY}px`)
          .style('display', 'inline-block')
          .html(`Value: ${d.value}`);
      })
      .on('mouseout', () => {
        // Handle mouseout event
        // Hide tooltip
        d3.select('#tooltip')
          .style('display', 'none');
      });

    // Create tooltip element
    d3.select('body').append('div')
      .attr('id', 'tooltip')
      .attr('class', 'heatmap-tooltip')
      .style('position', 'absolute')
      .style('padding', '8px')
      .style('background', 'rgba(0,0,0,0.7)')
      .style('color', '#fff')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('display', 'none');

  }, [sessionData]);

  return (
    <HeatmapContainer>
      <HeatmapSvg ref={svgRef} />
    </HeatmapContainer>
  );
};

HeatmapD3.propTypes = {
  sessionData: PropTypes.array.isRequired,
};

export default HeatmapD3;
