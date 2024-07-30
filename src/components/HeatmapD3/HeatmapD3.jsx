import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const HeatmapContainer = styled.div`
  position: relative;
  width: 100%; /* Adjust based on your layout */
  height: 100%; /* Adjust based on your layout */
`;

const HeatmapSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
`;

const HeatmapD3 = ({ sessionData }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!sessionData || sessionData.length === 0) {
      return;
    }

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    // Define scales with adjusted padding
    const x = d3.scaleBand()
      .domain(sessionData.map(d => d.start))
      .range([margin.left, width - margin.right])
      .padding(0.05); // Reduced padding

    const y = d3.scaleBand()
      .domain(sessionData.map(d => d.speaker))
      .range([margin.top, height - margin.bottom])
      .padding(0.05); // Reduced padding

    const color = d3.scaleLinear()
      .range(["#ffffff", "#0000ff"]) // Adjust color range as needed
      .domain([0, 1]);

    svg.selectAll("rect")
      .data(sessionData)
      .join(
        enter => enter
          .append("rect")
          .attr("x", d => x(d.start))
          .attr("y", d => y(d.speaker))
          .attr("width", x.bandwidth())
          .attr("height", y.bandwidth())
          .attr("fill", d => color(d.isSilence ? 0 : 1))
          .on("mouseover", (event, d) => {
            console.log(`Mouseover on ${d.text}`);
          })
          .on("mouseout", () => {
            console.log("Mouseout");
          }),
        update => update
          .attr("x", d => x(d.start))
          .attr("y", d => y(d.speaker))
          .attr("width", x.bandwidth())
          .attr("height", y.bandwidth())
          .attr("fill", d => color(d.isSilence ? 0 : 1)),
        exit => exit.remove()
      );

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
