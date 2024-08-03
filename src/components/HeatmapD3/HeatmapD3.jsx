// import React, { useEffect, useRef, useState } from 'react';
// import * as d3 from 'd3';
// import { debounce } from 'lodash';
// import { getColorForUtterance } from '../../utils/colorUtils';
// import '../styles/HeatmapD3.css';
// import HeatmapTooltip from '../HeatmapComponent/HeatmapTooltip';

// const HeatmapD3 = ({ sessionData }) => {
//   const svgRef = useRef(null);
//   const [cellSize, setCellSize] = useState({ width: 20, height: 20 });
//   const [tooltipData, setTooltipData] = useState(null);
//   const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

//   const minCellSize = 10; // Minimum size in pixels

//   // Debounce resize handler
//   const handleResize = debounce(() => {
//     const svgElement = svgRef.current;
//     if (!svgElement) return;

//     const width = svgElement.clientWidth;
//     const height = svgElement.clientHeight;

//     const numColumns = Math.floor(width / cellSize.width);
//     const numRows = Math.ceil(sessionData.length / numColumns);

//     setCellSize({
//       width: Math.floor(width / numColumns),
//       height: Math.floor(height / numRows),
//     });
//   }, 200);

//   useEffect(() => {
//     handleResize();
//     window.addEventListener('resize', handleResize);

//     return () => window.removeEventListener('resize', handleResize);
//   }, [sessionData, cellSize, handleResize]);

//   useEffect(() => {
//     const svgElement = svgRef.current;
//     if (!svgElement || !sessionData || sessionData.length === 0) return;

//     const svg = d3.select(svgElement);
//     const { width, height } = svgElement.getBoundingClientRect();

//     const numColumns = Math.floor(width / cellSize.width);
//     const numRows = Math.ceil(sessionData.length / numColumns);

//     svg.selectAll('*').remove();

//     const xScale = d3.scaleBand()
//       .domain(d3.range(numColumns))
//       .range([0, width])
//       .padding(0.1);

//     const yScale = d3.scaleBand()
//       .domain(d3.range(numRows))
//       .range([0, height])
//       .padding(0.1);

//     svg.selectAll('.grid-line')
//       .data(xScale.domain())
//       .enter()
//       .append('line')
//       .attr('class', 'grid-line')
//       .attr('x1', d => xScale(d))
//       .attr('x2', d => xScale(d))
//       .attr('y1', 0)
//       .attr('y2', height)
//       .attr('stroke', '#d3d3d3')
//       .attr('stroke-width', 1);

//     svg.selectAll('.grid-line-horizontal')
//       .data(yScale.domain())
//       .enter()
//       .append('line')
//       .attr('class', 'grid-line-horizontal')
//       .attr('x1', 0)
//       .attr('x2', width)
//       .attr('y1', d => yScale(d))
//       .attr('y2', d => yScale(d))
//       .attr('stroke', '#d3d3d3')
//       .attr('stroke-width', 1);

//     svg.selectAll('rect')
//       .data(sessionData)
//       .enter()
//       .append('rect')
//       .attr('x', (d, i) => xScale(i % numColumns))
//       .attr('y', (d, i) => yScale(Math.floor(i / numColumns)))
//       .attr('width', xScale.bandwidth())
//       .attr('height', yScale.bandwidth())
//       .attr('fill', d => d.isSilence ? '#ccc' : getColorForUtterance(d))
//       .attr('stroke', '#d3d3d3')
//       .attr('stroke-width', 1)
//       .style('box-sizing', 'border-box')
//       .on('mouseover', (event, d) => {
//         setTooltipData(d);
//         setTooltipPosition({ x: event.pageX, y: event.pageY });
//       })
//       .on('mousemove', (event) => {
//         setTooltipPosition({ x: event.pageX, y: event.pageY });
//       })
//       .on('mouseout', () => {
//         setTooltipData(null);
//       });

//     svg.selectAll('line.cross')
//       .data(sessionData.filter(d => d.containsTopWords))
//       .enter()
//       .append('line')
//       .attr('class', 'cross')
//       .attr('x1', d => xScale(d.start % numColumns))
//       .attr('y1', d => yScale(Math.floor(d.start / numColumns)))
//       .attr('x2', d => xScale(d.start % numColumns) + xScale.bandwidth())
//       .attr('y2', d => yScale(Math.floor(d.start / numColumns)) + yScale.bandwidth())
//       .attr('stroke', 'red')
//       .attr('stroke-width', 2);

//     svg.selectAll('line.cross')
//       .data(sessionData.filter(d => d.containsTopWords))
//       .enter()
//       .append('line')
//       .attr('class', 'cross')
//       .attr('x1', d => xScale(d.start % numColumns))
//       .attr('y1', d => yScale(Math.floor(d.start / numColumns)) + yScale.bandwidth())
//       .attr('x2', d => xScale(d.start % numColumns) + xScale.bandwidth())
//       .attr('y2', d => yScale(Math.floor(d.start / numColumns)))
//       .attr('stroke', 'red')
//       .attr('stroke-width', 2);
//   }, [sessionData, cellSize]);

//   return (
//     <div className="heatmapContainer">
//       <svg ref={svgRef} className="heatmapSvg" width="100%" height="100%" />
//       {tooltipData && (
//         <HeatmapTooltip data={tooltipData} position={tooltipPosition} />
//       )}
//     </div>
//   );
// };

// export default HeatmapD3;
