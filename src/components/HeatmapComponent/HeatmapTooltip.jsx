import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/HeatmapTooltip.css';

const HeatmapTooltip = ({ content, mouseX, mouseY }) => {
  const tooltipRef = useRef(null);
  const [tooltipStyle, setTooltipStyle] = useState({});

  useEffect(() => {
    if (!tooltipRef.current || !content || content.start === undefined) {
      document.body.classList.remove('no-scroll');
      return;
    }

    const tooltipElement = tooltipRef.current;
    const textLength = content.text ? content.text.length : 0;
    const dynamicWidth = Math.min(100 + textLength * 0.5, 400); // Calculate width based on text length

    tooltipElement.style.width = `${dynamicWidth}px`;

    const tooltipWidth = tooltipElement.offsetWidth;
    const tooltipHeight = tooltipElement.offsetHeight;

    const margin = 10; // Margin from the edges of the screen
    let newMouseX = mouseX + margin; // Offset to the right of the mouse pointer
    let newMouseY = mouseY + margin; // Offset below the mouse pointer

    // Adjust position if tooltip goes off-screen horizontally
    if (newMouseX + tooltipWidth > window.innerWidth) {
      newMouseX = mouseX - tooltipWidth - margin;
      if (newMouseX < margin) {
        newMouseX = margin; // Ensure tooltip is within the viewport horizontally
      }
    }

    // Adjust position if tooltip goes off-screen vertically
    if (newMouseY + tooltipHeight > window.innerHeight) {
      newMouseY = mouseY - tooltipHeight - margin;
      if (newMouseY < margin) {
        newMouseY = margin; // Ensure tooltip is within the viewport vertically
      }
    }

    setTooltipStyle({
      left: `${newMouseX}px`,
      top: `${newMouseY}px`,
    });

    document.body.classList.add('no-scroll');

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [mouseX, mouseY, content]);

  if (!content || content.start === undefined) {
    return null; // Return null if content or content.start is undefined
  }

  return (
    <div
      ref={tooltipRef}
      className="heatmap-tooltip"
      style={tooltipStyle}
    >
      <p><strong>Speaker:</strong> {content.isSilence ? 'Silence' : (content.speaker || 'Unknown Speaker')}</p>
      <p><strong>Percentile:</strong> {content.percentile !== undefined ? `${content.percentile}%` : 'N/A'}</p>
      <p><strong>Start Time:</strong> {content.start} ms</p>
      <p><strong>End Time:</strong> {content.end} ms</p>
      <p><strong>Word Frequency:</strong> {content.wordFrequency !== undefined ? content.wordFrequency : 'N/A'}</p>
      <p><strong>Text:</strong> {content.text || (content.isSilence ? 'No speech' : 'N/A')}</p>
    </div>
  );
};

HeatmapTooltip.propTypes = {
  content: PropTypes.shape({
    text: PropTypes.string,
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    wordFrequency: PropTypes.number,
    confidence: PropTypes.number,
    isSilence: PropTypes.bool,
    speaker: PropTypes.string,
    percentile: PropTypes.number,
  }),
  mouseX: PropTypes.number.isRequired,
  mouseY: PropTypes.number.isRequired,
};

export default HeatmapTooltip;