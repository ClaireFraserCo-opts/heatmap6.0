import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import styled from 'styled-components';


const HeatmapContainer = styled.div`
  position: relative;
  width: 100%; /* Full width of the parent container */
  height: 100%; /* Full height of the parent container */
`;

const HeatmapSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: all; /* Enable interaction */
  z-index: 1;
`;

const HeatmapD3 = ({ sessionData }) => {
  const svgRef = useRef(null);
  const [cellSize, setCellSize] = useState({ width: 20, height: 20 });

  useEffect(() => {
    const updateSize = () => {
      const svgElement = svgRef.current;
      if (!svgElement) return;

      const width = svgElement.clientWidth;
      const height = svgElement.clientHeight;

      // Dynamically adjust cell size based on container size
      const numColumns = Math.floor(width / cellSize.width);
      const numRows = Math.ceil(sessionData.length / numColumns);

      setCellSize({
        width: Math.floor(width / numColumns),
        height: Math.floor(height / numRows),
      });
    };

    window.addEventListener('resize', updateSize);
    updateSize(); // Initial call

    return () => window.removeEventListener('resize', updateSize);
  }, [sessionData]);

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement || !sessionData || sessionData.length === 0) return;

    const svg = d3.select(svgElement);
    const { width, height } = svgElement.getBoundingClientRect();

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const numColumns = Math.floor(innerWidth / cellSize.width);
    const numRows = Math.ceil(sessionData.length / numColumns);

    const x = d3.scaleBand()
      .domain(d3.range(numColumns))
      .range([margin.left, innerWidth + margin.left])
      .padding(0.1);

    const y = d3.scaleBand()
      .domain(d3.range(numRows))
      .range([margin.top, innerHeight + margin.top])
      .padding(0.1);

    const color = d3.scaleLinear()
      .domain([0, 1])
      .range(["#ffffff", "#0000ff"]);

    const zoom = d3.zoom()
      .scaleExtent([1, 10])
      .translateExtent([[0, 0], [width, height]])
      .on('zoom', (event) => {
        svg.selectAll('rect')
          .attr('transform', event.transform);
      });

    svg.call(zoom);

    svg.selectAll('rect')
      .data(sessionData)
      .join(
        enter => enter
          .append('rect')
          .attr('x', d => x(d.start) || 0)
          .attr('y', d => y(d.speaker) || 0)
          .attr('width', x.bandwidth() || 0)
          .attr('height', y.bandwidth() || 0)
          .attr('fill', d => color(d.isSilence ? 0 : 1))
          .on('mouseover', (event, d) => {
            tooltip.transition().duration(200).style('opacity', .9);
            tooltip.html(`Details: ${d.text}`)
              .style('left', (event.pageX + 5) + 'px')
              .style('top', (event.pageY - 28) + 'px');
          })
          .on('mouseout', () => {
            tooltip.transition().duration(500).style('opacity', 0);
          }),
        update => update
          .attr('x', d => x(d.start) || 0)
          .attr('y', d => y(d.speaker) || 0)
          .attr('width', x.bandwidth() || 0)
          .attr('height', y.bandwidth() || 0)
          .attr('fill', d => color(d.isSilence ? 0 : 1)),
        exit => exit.remove()
      );

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', '#fff')
      .style('border', '1px solid #ccc')
      .style('padding', '5px')
      .style('border-radius', '3px');

    return () => {
      svg.selectAll('rect').remove();
      d3.select('.tooltip').remove();
    };
  }, [sessionData, cellSize]);

  return (
    <HeatmapContainer>
      <HeatmapSvg ref={svgRef}>
        {/* SVG content */}
      </HeatmapSvg>
    </HeatmapContainer>
  );
};

HeatmapD3.propTypes = {
  sessionData: PropTypes.arrayOf(
    PropTypes.shape({
      speaker: PropTypes.string.isRequired,
      isSilence: PropTypes.bool,
      text: PropTypes.string.isRequired,
      start: PropTypes.number.isRequired,
      end: PropTypes.number.isRequired,
      wordFrequency: PropTypes.number,
      confidence: PropTypes.number,
    })
  ).isRequired,
};

export default HeatmapD3;
