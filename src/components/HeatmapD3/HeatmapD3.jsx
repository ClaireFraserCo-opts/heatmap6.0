import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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
    if (!sessionData || sessionData.length === 0 || !sessionData[0].speaker) {
      return; // Exit early if sessionData is not ready
    }

    const svg = d3.select(svgRef.current);
    if (!svg) return; // Exit early if svgRef.current is null

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(sessionData.map(d => d.start))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleBand()
      .domain(sessionData.map(d => d.speaker))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const color = d3.scaleLinear()
      .range(["white", "blue"]) // Example color range
      .domain([0, 1]); // Example domain

    svg.selectAll("rect")
      .data(sessionData)
      .join("rect")
      .attr("x", d => x(d.start))
      .attr("y", d => y(d.speaker))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", d => color(d.isSilence ? 0 : 1)) // Handle undefined isSilence
      .on("mouseover", (event, d) => {
        console.log(`Mouseover on ${d.text}`);
      })
      .on("mouseout", () => {
        console.log("Mouseout");
      });

    return () => {
      svg.selectAll("rect").remove();
    };

  }, [sessionData]);

  return (
    <HeatmapContainer>
      <HeatmapSvg ref={svgRef} width={500} height={300}>
        {/* SVG content */}
      </HeatmapSvg>
    </HeatmapContainer>
  );
};

HeatmapD3.propTypes = {
  sessionData: PropTypes.arrayOf(
    PropTypes.shape({
      speaker: PropTypes.string.isRequired,
      isSilence: PropTypes.bool, // Make isSilence optional
      text: PropTypes.string.isRequired,
      start: PropTypes.number.isRequired,
      end: PropTypes.number.isRequired,
      wordFrequency: PropTypes.number,
      confidence: PropTypes.number,
    })
  ).isRequired,
};

export default HeatmapD3;
