// import React from 'react';
// import PropTypes from 'prop-types';
// import Tooltip from '@mui/material/Tooltip';
// import Typography from '@mui/material/Typography';
// import { getColorForUtterance } from '../../utils/colorUtils';
// import '../styles/HeatmapCell.css';

// const HeatmapCell = ({
//   speaker,
//   isSilence,
//   text,
//   start,
//   end,
//   percentile,
//   cellWidth,
//   cellHeight,
//   containsTopWords, 
//   onMouseEnter = () => {},
//   onMouseLeave = () => {},
//   onClick = () => {},
// }) => {
//   const utterance = { speaker, isSilence, text, start, end, percentile: percentile !== undefined ? percentile : 0 };
//   const cellColor = getColorForUtterance(utterance);

//   const handleMouseEnter = (event) => {
//     onMouseEnter(utterance, event);
//   };

//   const handleMouseLeave = () => {
//     onMouseLeave();
//   };

//   const handleClick = () => {
//     onClick(utterance);
//   };

//   return (
//     <Tooltip
//       title={
//         <React.Fragment>
//           <Typography variant="body2"><strong>Speaker:</strong> {speaker || (isSilence ? 'Silence' : 'Unknown')}</Typography>
//           <Typography variant="body2"><strong>Percentile:</strong> {percentile !== undefined ? `${percentile}%` : 'N/A'}</Typography>
//           <Typography variant="body2"><strong>Start:</strong> {start} ms</Typography>
//           <Typography variant="body2"><strong>End:</strong> {end} ms</Typography>
//           <Typography variant="body2"><strong>Text:</strong> {text || (isSilence ? 'No speech' : 'N/A')}</Typography>
//         </React.Fragment>
//       }
//       enterDelay={500}
//       arrow
//     >
//       <div
//         className="heatmap-cell"
//         style={{
//           backgroundColor: cellColor, // Apply dynamic color
//           width: `${cellWidth}px`,     // Apply dynamic width
//           height: `${cellHeight}px`,   // Apply dynamic height
//           border: '1px solid #d3d3d3',
//           position: 'relative',        // Ensure proper positioning for the cross
//         }}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//         onClick={handleClick}
//       >
//         {containsTopWords && (
//           <svg
//             width={cellWidth}
//             height={cellHeight}
//             style={{ position: 'absolute', top: 0, left: 0 }}
//           >
//             <line
//               x1={cellWidth * 0.2}
//               y1={cellHeight * 0.2}
//               x2={cellWidth * 0.8}
//               y2={cellHeight * 0.8}
//               stroke="red"
//               strokeWidth="2"
//             />
//             <line
//               x1={cellWidth * 0.8}
//               y1={cellHeight * 0.2}
//               x2={cellWidth * 0.2}
//               y2={cellHeight * 0.8}
//               stroke="red"
//               strokeWidth="2"
//             />
//           </svg>
//         )}
//       </div>
//     </Tooltip>
//   );
// };

// HeatmapCell.propTypes = {
//   isSilence: PropTypes.bool.isRequired,
//   speaker: PropTypes.string,
//   text: PropTypes.string,
//   start: PropTypes.number,
//   end: PropTypes.number,
//   percentile: PropTypes.number,
//   cellWidth: PropTypes.number.isRequired,
//   cellHeight: PropTypes.number.isRequired,
//   containsTopWords: PropTypes.bool.isRequired, 
//   onMouseEnter: PropTypes.func,
//   onMouseLeave: PropTypes.func,
//   onClick: PropTypes.func,
// };

// export default HeatmapCell;
